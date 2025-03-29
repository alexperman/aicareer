'use server';

import { createClient } from '@/utils/supabase/server';
import { profileFormSchema, type ProfileFormValues } from '@/lib/schemas/profile';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: ProfileFormValues) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'Authentication error' };
    }
    
    // Validate the form data
    const validatedData = profileFormSchema.parse(formData);
    
    // Update the profile
    const { error } = await supabase
      .from('profiles')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);
    
    if (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
    
    // Revalidate the profile page
    revalidatePath('/profile');
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error in updateProfile action:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

export async function getProfile() {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'Authentication error', profile: null };
    }
    
    // Get the profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return { success: false, error: error.message, profile: null };
    }
    
    return { success: true, profile: data };
  } catch (error) {
    console.error('Error in getProfile action:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      profile: null
    };
  }
}
