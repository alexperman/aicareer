import { z } from 'zod';

// Profile settings schema
export const profileSettingsSchema = z.object({
  privacy: z.object({
    profile_visibility: z.enum(['public', 'recruiters_only', 'private']),
    show_email: z.boolean(),
    show_location: z.boolean(),
    show_social_links: z.boolean(),
    contact_preferences: z.object({
      allow_messages: z.boolean(),
      allow_connection_requests: z.boolean(),
      notification_email: z.boolean(),
      notification_push: z.boolean(),
    }),
  }),
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string(),
  timezone: z.string(),
});

// Profile schema
export const profileSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(1, 'Full name is required'),
  occupation: z.string().optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  location: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  github_url: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
  avatar_url: z.string().optional(),
  is_recruiter: z.boolean().default(false),
  settings: profileSettingsSchema,
});

// Profile form schema (subset of profile schema for form submission)
export const profileFormSchema = profileSchema.omit({ 
  id: true, 
  avatar_url: true, 
  is_recruiter: true,
  settings: true 
});

export type ProfileSettings = z.infer<typeof profileSettingsSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type ProfileFormValues = z.infer<typeof profileFormSchema>;
