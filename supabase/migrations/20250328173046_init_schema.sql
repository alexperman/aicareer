-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE,
    full_name TEXT,
    avatar_url TEXT,
    occupation TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    is_recruiter BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create agencies table
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT,
    website TEXT,
    logo_url TEXT,
    location TEXT,
    status TEXT DEFAULT 'active',
    settings JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create resumes table
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    parsed_data JSONB DEFAULT '{}'::jsonb,
    is_primary BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending',
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create experiences table
CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    position TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    location TEXT,
    description TEXT,
    skills TEXT[],
    achievements TEXT[],
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create knowledge_base table
CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[],
    source TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create job_posts table
CREATE TABLE job_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    posted_by UUID REFERENCES profiles(id),
    title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    location TEXT,
    job_type TEXT,
    salary_range JSONB,
    description TEXT NOT NULL,
    requirements TEXT[],
    benefits TEXT[],
    skills_required TEXT[],
    status TEXT DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create saved_jobs table
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES job_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(user_id, job_id)
);

-- Create applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES job_posts(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES resumes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'submitted',
    cover_letter TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create interview_preparation table
CREATE TABLE interview_preparation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    questions JSONB[],
    answers JSONB[],
    feedback JSONB[],
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create offers_negotiation table
CREATE TABLE offers_negotiation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    offer_details JSONB NOT NULL,
    negotiation_history JSONB[],
    status TEXT DEFAULT 'pending',
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create agency_users table
CREATE TABLE agency_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    role TEXT DEFAULT 'member',
    status TEXT DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(agency_id, user_id)
);

-- Add RLS policies for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT
    USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Add RLS policies for resumes table
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own resumes" ON resumes
    FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own resumes" ON resumes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own resumes" ON resumes
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Add RLS policies for experiences table
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own experiences" ON experiences
    FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own experiences" ON experiences
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own experiences" ON experiences
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Add RLS policies for knowledge_base table
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all knowledge base entries" ON knowledge_base
    FOR SELECT
    USING (true);
CREATE POLICY "Users can create knowledge base entries" ON knowledge_base
    FOR INSERT
    WITH CHECK (true);
CREATE POLICY "Users can update knowledge base entries" ON knowledge_base
    FOR UPDATE
    USING (true);

-- Add RLS policies for job_posts table
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view job posts" ON job_posts
    FOR SELECT
    USING (true);
CREATE POLICY "Recruiters can create job posts" ON job_posts
    FOR INSERT
    WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Recruiters can update their own job posts" ON job_posts
    FOR UPDATE
    USING (auth.uid() = posted_by);

-- Add RLS policies for saved_jobs table
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their saved jobs" ON saved_jobs
    FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Users can save jobs" ON saved_jobs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their saved jobs" ON saved_jobs
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add RLS policies for applications table
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their applications" ON applications
    FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Users can create applications" ON applications
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for interview_preparation table
ALTER TABLE interview_preparation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their interview preparations" ON interview_preparation
    FOR SELECT
    USING (auth.uid() = (SELECT user_id FROM applications WHERE id = application_id));
CREATE POLICY "Users can create interview preparations" ON interview_preparation
    FOR INSERT
    WITH CHECK (auth.uid() = (SELECT user_id FROM applications WHERE id = application_id));

-- Add RLS policies for offers_negotiation table
ALTER TABLE offers_negotiation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their offer negotiations" ON offers_negotiation
    FOR SELECT
    USING (auth.uid() = (SELECT user_id FROM applications WHERE id = application_id));
CREATE POLICY "Users can create offer negotiations" ON offers_negotiation
    FOR INSERT
    WITH CHECK (auth.uid() = (SELECT user_id FROM applications WHERE id = application_id));

-- Add RLS policies for agencies table
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recruiters can view their agencies" ON agencies
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM agency_users WHERE agency_id = id));
CREATE POLICY "Recruiters can create agencies" ON agencies
    FOR INSERT
    WITH CHECK (auth.uid() IN (SELECT user_id FROM agency_users WHERE agency_id = id));

-- Add RLS policies for agency_users table
ALTER TABLE agency_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recruiters can view their agency users" ON agency_users
    FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Recruiters can add users to their agency" ON agency_users
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Recruiters can remove users from their agency" ON agency_users
    FOR DELETE
    USING (auth.uid() = user_id);
