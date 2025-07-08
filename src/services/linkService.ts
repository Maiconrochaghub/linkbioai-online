import { supabase } from '@/integrations/supabase/client';
import { Link, CreateLinkData } from '@/types/link';
import { validateLinkData, validateUrl, validateTitle } from './linkValidation';

export async function fetchUserLinks(userId: string): Promise<{ data: Link[] | null; error: any }> {
  console.log('🔗 Fetching links for user:', userId);
  
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true });

  if (error) {
    console.error('❌ Error fetching links:', error);
    return { data: null, error };
  }

  console.log('✅ Links loaded:', data?.length || 0);
  return { data: data || [], error: null };
}

export async function createLink(
  linkData: CreateLinkData, 
  userId: string, 
  maxPosition: number
): Promise<{ data: Link | null; error: any }> {
  console.log('➕ Adding link:', linkData.title);
  
  const validation = validateLinkData(linkData);
  if (!validation.isValid) {
    return { data: null, error: { message: validation.error } };
  }
  
  const newLink = {
    user_id: userId,
    title: validation.cleanTitle!,
    url: validation.cleanUrl!,
    position: maxPosition + 1,
    is_active: true,
    icon: linkData.icon || 'website'
  };

  const { data, error } = await supabase
    .from('links')
    .insert([newLink])
    .select()
    .single();

  if (error) {
    console.error('❌ Error adding link:', error);
    return { data: null, error };
  }

  console.log('✅ Link added:', data.title);
  return { data, error: null };
}

export async function updateLink(
  id: string, 
  updates: Partial<Link>
): Promise<{ success: boolean; error: any }> {
  console.log('✏️ Updating link:', id, updates);
  
  // Clean URL if provided
  if (updates.url) {
    updates.url = validateUrl(updates.url);
  }

  // Clean title if provided
  if (updates.title) {
    const titleValidation = validateTitle(updates.title);
    if (!titleValidation.isValid) {
      return { success: false, error: { message: titleValidation.error } };
    }
    updates.title = titleValidation.cleanTitle;
  }
  
  const { error } = await supabase
    .from('links')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('❌ Error updating link:', error);
    return { success: false, error };
  }

  console.log('✅ Link updated successfully');
  return { success: true, error: null };
}

export async function deleteLink(id: string): Promise<{ success: boolean; error: any }> {
  console.log('🗑️ Deleting link:', id);
  
  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('❌ Error deleting link:', error);
    return { success: false, error };
  }

  console.log('✅ Link deleted successfully');
  return { success: true, error: null };
}

export async function updateLinksPositions(
  updates: Array<{ id: string; position: number }>
): Promise<{ success: boolean; error: any }> {
  console.log('🔄 Reordering links...');
  
  // Use Promise.all for better performance
  const updatePromises = updates.map(update => 
    supabase
      .from('links')
      .update({ 
        position: update.position,
        updated_at: new Date().toISOString()
      })
      .eq('id', update.id)
  );

  const results = await Promise.allSettled(updatePromises);
  
  // Check for any failures
  const failures = results.filter(result => result.status === 'rejected');
  if (failures.length > 0) {
    console.error('❌ Some position updates failed:', failures);
    return { success: false, error: { message: 'Algumas posições podem não ter sido salvas corretamente' } };
  }

  console.log('✅ Links reordered successfully');
  return { success: true, error: null };
}