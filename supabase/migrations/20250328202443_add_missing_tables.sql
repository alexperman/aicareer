-- Create chats table
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    last_message_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(sender_id, receiver_id)
);

-- Create chat_messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'sent',
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create feedback_reviews table
CREATE TABLE feedback_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    company_id UUID REFERENCES job_posts(id) ON DELETE CASCADE,
    job_id UUID REFERENCES job_posts(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    interview_experience TEXT,
    interview_difficulty INTEGER CHECK (interview_difficulty >= 1 AND interview_difficulty <= 5),
    anonymous BOOLEAN DEFAULT TRUE,
    approved BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create job_alerts table
CREATE TABLE job_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES job_posts(id) ON DELETE CASCADE,
    score FLOAT,
    match_reasons JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Add RLS policies for chats table
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own chats" ON chats
    FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can insert their own chats" ON chats
    FOR INSERT
    WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their own chats" ON chats
    FOR UPDATE
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Add RLS policies for chat_messages table
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in their chats" ON chat_messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM chats
            WHERE chats.id = chat_messages.chat_id
            AND (chats.sender_id = auth.uid() OR chats.receiver_id = auth.uid())
        )
    );
CREATE POLICY "Users can send messages in their chats" ON chat_messages
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM chats
            WHERE chats.id = chat_messages.chat_id
            AND chats.sender_id = auth.uid()
        )
    );
CREATE POLICY "Users can update their own messages" ON chat_messages
    FOR UPDATE
    USING (auth.uid() = sender_id);

-- Add RLS policies for feedback_reviews table
ALTER TABLE feedback_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own reviews" ON feedback_reviews
    FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own reviews" ON feedback_reviews
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON feedback_reviews
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Add RLS policies for job_alerts table
ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own job alerts" ON job_alerts
    FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own job alerts" ON job_alerts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own job alerts" ON job_alerts
    FOR UPDATE
    USING (auth.uid() = user_id);
