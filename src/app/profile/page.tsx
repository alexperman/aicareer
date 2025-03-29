import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { getProfile } from '@/app/actions/profile';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login?callbackUrl=/profile');
  }
  
  // Get the profile data
  const { profile } = await getProfile();
  
  return (
    <div className="container max-w-4xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and how it appears to others.
          </p>
        </div>
        
        <Suspense fallback={<div>Loading profile...</div>}>
          <ProfileForm initialData={profile} userId={user.id} />
        </Suspense>
      </div>
    </div>
  );
}
