

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Determine if we're in test mode based on the stripe key
    const isTestMode = stripeKey.startsWith('sk_test_');
    logStep("Stripe mode detected", { isTestMode });

    // Use anon key for auth verification
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check if user can still be founder
    const { data: canBeFounder, error: founderError } = await supabaseClient.rpc('can_be_founder');
    if (founderError) throw new Error(`Error checking founder status: ${founderError.message}`);
    if (!canBeFounder) throw new Error("Founder offer is no longer available (10,000 limit reached)");
    logStep("Founder status verified", { canBeFounder });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check for existing customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      logStep("Creating new customer");
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    // Use appropriate Price ID based on environment
    const priceId = isTestMode 
      ? "price_1Rawf6H7TnhtLpgPu0gkTAoA" // Test Price ID - $1/month
      : "price_1Rawf6H7TnhtLpgPu0gkTAoA"; // Live Price ID - Update this when you have live pricing
    
    logStep("Using Price ID", { priceId, isTestMode });
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard?upgrade=success`,
      cancel_url: `${origin}/upgrade?canceled=1`,
      metadata: {
        user_id: user.id,
        is_founder: "true"
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ 
      url: session.url,
      sessionId: session.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    
    // Return more detailed error information for debugging
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: error instanceof Error ? error.stack : null,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

