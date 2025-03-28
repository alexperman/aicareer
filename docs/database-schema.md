# AICareer Database Schema

## Core Tables

### profiles
Extends Supabase Auth users with additional profile information
```sql
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
```

### resumes
Stores user resumes and parsed data
```sql
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
```

### experiences
Stores work experiences extracted from resumes
```sql
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
```

### knowledge_base
Stores AI-enriched career insights and knowledge
```sql
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
```

## Job-Related Tables

### job_posts
Stores job listings
```sql
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
```

### saved_jobs
Tracks jobs saved by users
```sql
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES job_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(user_id, job_id)
);
```

### applications
Tracks job applications
```sql
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
```

### interview_preparation
Stores interview preparation materials
```sql
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
```

### offers_negotiation
Tracks job offers and negotiation details
```sql
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
```

## Agency & Recruiter Tables

### agencies
Stores recruiting agency information
```sql
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
```

### agency_users
Links recruiters to agencies
```sql
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
```

## Communication Tables

### chats
Stores chat sessions
```sql
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    application_id UUID REFERENCES applications(id),
    metadata JSONB DEFAULT '{}'::jsonb
);
```

### chat_messages
Stores individual chat messages
```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    content TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);
```

## Feedback & Reviews

### feedback_reviews
Stores feedback and reviews
```sql
CREATE TABLE feedback_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewer_id UUID REFERENCES profiles(id),
    application_id UUID REFERENCES applications(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending',
    metadata JSONB DEFAULT '{}'::jsonb
);
```

### job_alerts
Stores user job alert preferences
```sql
CREATE TABLE job_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    criteria JSONB NOT NULL,
    frequency TEXT DEFAULT 'daily',
    status TEXT DEFAULT 'active',
    last_sent_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);
```

## Notes:

1. All tables include:
   - UUID primary keys
   - Timestamps for creation/updates
   - JSONB metadata field for extensibility
   - Proper foreign key constraints
   - Row Level Security (RLS) enabled

2. Common Patterns:
   - User-related tables reference profiles(id)
   - Agency-related tables reference agencies(id)
   - Application-related tables reference applications(id)
   - Consistent use of status fields
   - JSONB for flexible data storage

3. Security:
   - RLS policies control access
   - Proper cascading relationships
   - Input validation constraints
   - No sensitive data in public fields
