
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey || !webhookSecret) {
      throw new Error("Missing Stripe configuration");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Use service role for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const signature = req.headers.get("stripe-signature");
    if (!signature) throw new Error("No Stripe signature found");

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    logStep("Event verified", { type: event.type, id: event.id });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const isFounder = session.metadata?.is_founder === "true";

        if (!userId) {
          logStep("No user_id in metadata, skipping");
          break;
        }

        logStep("Processing checkout completion", { userId, isFounder, customerId: session.customer });

        // Update user profile with PRO plan
        const { error: updateError } = await supabaseClient
          .from("profiles")
          .update({
            plan: "pro",
            is_founder: isFounder,
            stripe_customer_id: session.customer as string,
            subscription_id: session.subscription as string,
            plan_expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            updated_at: new Date().toISOString()
          })
          .eq("id", userId);

        if (updateError) {
          logStep("Error updating user", { error: updateError.message });
          throw new Error(`Failed to update user: ${updateError.message}`);
        }

        logStep("User updated successfully", { userId, plan: "pro", isFounder });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Processing subscription cancellation", { subscriptionId: subscription.id });

        const { error: updateError } = await supabaseClient
          .from("profiles")
          .update({
            plan: "free",
            plan_expires: null,
            subscription_id: null,
            updated_at: new Date().toISOString()
          })
          .eq("subscription_id", subscription.id);

        if (updateError) {
          logStep("Error downgrading user", { error: updateError.message });
          throw new Error(`Failed to downgrade user: ${updateError.message}`);
        }

        logStep("User downgraded successfully", { subscriptionId: subscription.id });
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
