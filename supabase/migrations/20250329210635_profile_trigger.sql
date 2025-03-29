-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, updated_at, full_name, avatar_url, is_recruiter, settings)
  VALUES (
    NEW.id,
    NOW(),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'is_recruiter')::boolean, FALSE),
    jsonb_build_object(
      'privacy', jsonb_build_object(
        'profile_visibility', 'public',
        'show_email', true,
        'show_location', true,
        'show_social_links', true,
        'contact_preferences', jsonb_build_object(
          'allow_messages', true,
          'allow_connection_requests', true,
          'notification_email', true,
          'notification_push', true
        )
      ),
      'theme', 'system',
      'language', 'en',
      'timezone', 'UTC'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create a profile when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add a policy to allow the service role to create profiles
CREATE POLICY "Service role can create profiles" ON profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Add a policy to allow the service role to update profiles
CREATE POLICY "Service role can update profiles" ON profiles
  FOR UPDATE
  TO service_role
  USING (true);

-- Add a policy to allow users to delete their own profiles
CREATE POLICY "Users can delete their own profile" ON profiles
  FOR DELETE
  USING (auth.uid() = id);
