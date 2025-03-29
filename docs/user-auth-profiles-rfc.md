# RFC: User Authentication & Profiles for AICareer Platform

## Overview

This RFC details the implementation of the User Authentication & Profiles feature for the AICareer platform. This is a foundational component that will enable users to create accounts, manage their profiles, and access role-specific features across the platform.

## Goals

- Implement secure user authentication using Supabase Auth
- Create extended user profiles with role-based permissions
- Establish secure session management
- Provide privacy settings management
- Support both job seeker and recruiter user types

## Technical Design

### Authentication Flow

1. **Registration Process**:
   - User enters email, password, and selects account type (job seeker/recruiter)
   - Email verification flow with confirmation link
   - Upon verification, user completes profile setup (onboarding)

2. **Login Process**:
   - Email/password authentication
   - Social login options (Google, LinkedIn, GitHub)
   - Magic link authentication (passwordless)
   - Multi-factor authentication (optional for enhanced security)

3. **Session Management**:
   - JWT-based session handling
   - Configurable session duration
   - Secure token storage and refresh mechanism
   - Cross-device logout capability

4. **Password Management**:
   - Secure password reset flow
   - Password strength enforcement
   - Password change history

### User Profile System

1. **Core Profile Data**:
   - Basic information (name, contact details, location)
   - Professional information (occupation, bio)
   - Social links (LinkedIn, GitHub, personal website)
   - Role-specific fields (job seeker vs. recruiter)

2. **Profile Privacy Controls**:
   - Granular visibility settings for profile sections
   - Contact preference management
   - Data sharing controls
   - Profile visibility status (active, hidden, etc.)

3. **Profile Completion System**:
   - Guided profile completion steps
   - Profile strength indicator
   - Recommendations for profile improvement

## Required Endpoints/Functions

### Authentication API

```typescript
// Registration
POST /api/auth/register
Body: { email, password, userType, fullName }
Response: { userId, message, verificationSent }

// Email Verification
GET /api/auth/verify?token={verificationToken}
Response: { success, message }

// Login
POST /api/auth/login
Body: { email, password }
Response: { session, user }

// Social Login
GET /api/auth/login/{provider}
Response: Redirect to OAuth flow

// Magic Link
POST /api/auth/magiclink
Body: { email }
Response: { success, message }

// Logout
POST /api/auth/logout
Response: { success, message }

// Password Reset Request
POST /api/auth/reset-password
Body: { email }
Response: { success, message }

// Password Reset Completion
POST /api/auth/reset-password/confirm
Body: { token, newPassword }
Response: { success, message }

// Refresh Token
POST /api/auth/refresh
Body: { refreshToken }
Response: { session }
```

### User Profile API

```typescript
// Get Current User Profile
GET /api/profile
Response: { profile }

// Update Profile
PATCH /api/profile
Body: { fullName, occupation, bio, location, ... }
Response: { profile, updated }

// Get Profile by ID (public data only)
GET /api/profile/{id}
Response: { profile }

// Upload Avatar
POST /api/profile/avatar
Body: FormData with image
Response: { avatarUrl }

// Update Privacy Settings
PATCH /api/profile/privacy
Body: { settings }
Response: { settings, updated }

// Delete Account
DELETE /api/profile
Body: { confirmation }
Response: { success, message }
```

### Admin Functions

```typescript
// List Users (admin only)
GET /api/admin/users?page={page}&limit={limit}
Response: { users, total, pages }

// Update User Status (admin only)
PATCH /api/admin/users/{id}/status
Body: { status }
Response: { user, updated }
```

## Data Models

### User Model (Auth)

```typescript
interface User {
  id: string; // UUID
  email: string;
  created_at: Date;
  email_confirmed_at?: Date;
  last_sign_in_at?: Date;
  role: 'job_seeker' | 'recruiter' | 'admin';
  auth_provider: 'email' | 'google' | 'linkedin' | 'github';
}
```

### Profile Model

```typescript
interface Profile {
  id: string; // Same as User.id
  updated_at: Date;
  full_name: string;
  avatar_url?: string;
  occupation?: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedin_url?: string;
  github_url?: string;
  is_recruiter: boolean;
  settings: ProfileSettings;
  metadata: Record<string, any>;
}

interface ProfileSettings {
  privacy: {
    profile_visibility: 'public' | 'recruiters_only' | 'private';
    show_email: boolean;
    show_location: boolean;
    show_social_links: boolean;
    contact_preferences: {
      allow_messages: boolean;
      allow_connection_requests: boolean;
      notification_email: boolean;
      notification_push: boolean;
    };
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
}
```

## Database Schema Changes

The database schema already includes the necessary tables as defined in the database-schema.md file. No additional changes are needed for the core authentication and profile features.

Key tables utilized:
- `auth.users` (Supabase Auth built-in table)
- `profiles` (Extensions for user profiles)

## Security Considerations

1. **Authentication Security**:
   - Implement rate limiting for login attempts
   - Use secure password hashing (Argon2id)
   - Secure JWT handling with appropriate expiration
   - Implement CSRF protection
   - Use HTTP-only, secure cookies
   - Implement proper session invalidation

2. **Row Level Security (RLS)**:
   - Implement RLS policies for Supabase tables
   - Example policy for profiles:

```sql
-- Only allow users to select their own profile
CREATE POLICY "Users can read own profile" ON "profiles"
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update only their own profile
CREATE POLICY "Users can update own profile" ON "profiles"
  FOR UPDATE USING (auth.uid() = id);

-- Only admins can delete profiles
CREATE POLICY "Only admins can delete profiles" ON "profiles"
  FOR DELETE USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE role = 'admin'
  ));
```

3. **Input Validation**:
   - Server-side validation for all user inputs
   - Sanitization of user-provided HTML content
   - Proper handling of file uploads with size and type validation

4. **Privacy Controls**:
   - Implementation of GDPR-compliant data handling
   - Data export functionality
   - Clear data deletion processes
   - Audit logging for sensitive operations

## Dependencies

1. **External Services**:
   - Supabase Auth for identity management
   - Supabase Storage for avatar uploads

2. **Libraries**:
   - @supabase/supabase-js for client-side integration
   - @supabase/auth-helpers-nextjs for Next.js integration
   - zod for validation
   - next/auth for additional auth providers if needed

3. **Frontend Components**:
   - Auth forms (login, registration, password reset)
   - Profile editor
   - Avatar uploader
   - Privacy settings panel

## Implementation Tasks

Breaking down the implementation into atomic, testable tasks:

### Authentication Setup

1. **Initialize Supabase Auth**
   - Configure Supabase project
   - Set up auth providers (email, social)
   - Configure email templates

2. **Implement Registration Flow**
   - Create registration form component
   - Implement email verification
   - Set up onboarding redirect

3. **Implement Login Flow**
   - Create login form component
   - Implement social login buttons
   - Add "remember me" functionality
   - Implement magic link option

4. **Session Management**
   - Set up JWT handling
   - Implement token refresh logic
   - Create logout functionality
   - Add session recovery

### Profile Management

5. **Basic Profile Setup**
   - Create profile table migration
   - Implement RLS policies
   - Create profile creation trigger on auth

6. **Profile Editor**
   - Build profile form components
   - Implement validation
   - Create save/update functionality

7. **Avatar Management**
   - Set up file upload component
   - Configure Supabase storage
   - Implement image resizing/optimization

8. **Privacy Settings**
   - Create privacy settings interface
   - Implement settings save logic
   - Add visibility indicators

### Testing Tasks

9. **Authentication Tests**
   - Unit tests for auth functions
   - Integration tests for auth flows
   - E2E tests for user registration and login

10. **Profile Tests**
    - Unit tests for profile functions
    - Integration tests for profile updates
    - E2E tests for profile completion

11. **Security Tests**
    - Test RLS policies
    - Verify CSRF protection
    - Test rate limiting
    - Validate input sanitization

## Success Metrics

- Successful registration rate (>95%)
- Profile completion rate (>80%)
- Auth error rate (<1%)
- Average time to complete registration (<2 minutes)
- Password reset success rate (>99%)

## Timeline

This feature is part of Phase 1 (Core Features) and should be completed before moving to Job Search and Applications.

Estimated timeline: 2-3 weeks for initial implementation and testing.
