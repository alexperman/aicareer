import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import mockClient from './__mocks__/supabase';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockClient),
}));

describe('Resumes Table', () => {
  const testUserId = 'test-user-id';
  const validResumeData = {
    user_id: testUserId,
    title: 'Software Engineer Resume',
    content: {
      summary: 'Experienced software engineer with expertise in web development',
      experience: [
        {
          company: 'Tech Corp',
          position: 'Senior Software Engineer',
          start_date: '2020-01',
          end_date: '2023-12',
          description: 'Led development of multiple web applications...'
        }
      ],
      education: [
        {
          institution: 'University of Technology',
          degree: 'BS Computer Science',
          graduation_date: '2019-05'
        }
      ],
      skills: [
        'JavaScript',
        'TypeScript',
        'React',
        'Node.js',
        'PostgreSQL'
      ],
      certifications: [
        {
          name: 'AWS Certified Developer',
          issuer: 'Amazon Web Services',
          date: '2022-06'
        }
      ]
    },
    file_url: 'https://example.com/resume.pdf',
    file_type: 'pdf',
    is_primary: true,
    status: 'active',
    last_updated: new Date().toISOString()
  };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  beforeEach(() => {
    (supabase.from as jest.Mock).mockImplementation(() => ({
      insert: jest.fn().mockImplementation((data) => ({
        data: data.user_id && data.title ? data : null,
        error: data.user_id && data.title ? null : { message: 'Invalid data provided' },
        single: jest.fn().mockReturnThis()
      })),
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validResumeData } : null,
            error: id === testUserId ? null : { message: 'Record not found' }
          })
        }))
      })),
      update: jest.fn().mockImplementation((data) => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validResumeData, ...data } : null,
            error: id === testUserId ? null : { message: 'Record not found' }
          })
        }))
      })),
      delete: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          then: jest.fn().mockResolvedValue({
            error: id === testUserId ? null : { message: 'Record not found' },
            data: null
          })
        }))
      }))
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new resume', async () => {
    const result = await supabase
      .from('resumes')
      .insert({ id: testUserId, ...validResumeData })
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validResumeData });
  });

  it('should read an existing resume', async () => {
    const result = await supabase
      .from('resumes')
      .select('*')
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validResumeData });
  });

  it('should update an existing resume', async () => {
    const updateData = {
      title: 'Updated Software Engineer Resume',
      content: {
        ...validResumeData.content,
        summary: 'Senior software engineer with full-stack expertise',
        skills: [
          ...validResumeData.content.skills,
          'GraphQL',
          'Docker'
        ]
      },
      is_primary: false,
      status: 'updated'
    };
    const result = await supabase
      .from('resumes')
      .update(updateData)
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validResumeData, ...updateData });
  });

  it('should delete an existing resume', async () => {
    const result = await supabase
      .from('resumes')
      .delete()
      .eq('id', testUserId)
      .then();

    expect(result.error).toBeNull();
    expect(result.data).toBeNull();
  });

  it('should handle non-existent resume operations', async () => {
    const nonExistentId = 'non-existent-id';
    const operations = await Promise.all([
      supabase.from('resumes').select('*').eq('id', nonExistentId).single(),
      supabase.from('resumes').update({ status: 'archived' }).eq('id', nonExistentId).single(),
      supabase.from('resumes').delete().eq('id', nonExistentId).then()
    ]);

    operations.forEach(result => {
      expect(result.error).toBeDefined();
      expect(result.error!.message).toBe('Record not found');
    });
  });
});
