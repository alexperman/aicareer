import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import mockClient from './__mocks__/supabase';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockClient),
}));

describe('Agency Users Table', () => {
  const testUserId = 'test-user-id';
  const testAgencyId = 'test-agency-id';
  const validAgencyUserData = {
    user_id: testUserId,
    agency_id: testAgencyId,
    role: 'recruiter',
    status: 'active',
    permissions: ['view_candidates', 'manage_jobs', 'send_messages'],
    profile: {
      title: 'Senior Recruiter',
      department: 'Technical Recruiting',
      phone: '+1234567890',
      timezone: 'America/Los_Angeles'
    },
    joined_date: new Date().toISOString()
  };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  beforeEach(() => {
    (supabase.from as jest.Mock).mockImplementation(() => ({
      insert: jest.fn().mockImplementation((data) => ({
        data: data.user_id && data.agency_id ? data : null,
        error: data.user_id && data.agency_id ? null : { message: 'Invalid data provided' },
        single: jest.fn().mockReturnThis()
      })),
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validAgencyUserData } : null,
            error: id === testUserId ? null : { message: 'Record not found' }
          })
        }))
      })),
      update: jest.fn().mockImplementation((data) => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validAgencyUserData, ...data } : null,
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

  it('should create a new agency user', async () => {
    const result = await supabase
      .from('agency_users')
      .insert({ id: testUserId, ...validAgencyUserData })
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validAgencyUserData });
  });

  it('should read an existing agency user', async () => {
    const result = await supabase
      .from('agency_users')
      .select('*')
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validAgencyUserData });
  });

  it('should update an existing agency user', async () => {
    const updateData = {
      role: 'senior_recruiter',
      permissions: [
        ...validAgencyUserData.permissions,
        'manage_team',
        'view_analytics'
      ],
      profile: {
        ...validAgencyUserData.profile,
        title: 'Lead Technical Recruiter',
        department: 'Engineering Recruitment'
      }
    };
    const result = await supabase
      .from('agency_users')
      .update(updateData)
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validAgencyUserData, ...updateData });
  });

  it('should delete an existing agency user', async () => {
    const result = await supabase
      .from('agency_users')
      .delete()
      .eq('id', testUserId)
      .then();

    expect(result.error).toBeNull();
    expect(result.data).toBeNull();
  });

  it('should handle non-existent agency user operations', async () => {
    const nonExistentId = 'non-existent-id';
    const operations = await Promise.all([
      supabase.from('agency_users').select('*').eq('id', nonExistentId).single(),
      supabase.from('agency_users').update({ status: 'inactive' }).eq('id', nonExistentId).single(),
      supabase.from('agency_users').delete().eq('id', nonExistentId).then()
    ]);

    operations.forEach(result => {
      expect(result.error).toBeDefined();
      expect(result.error!.message).toBe('Record not found');
    });
  });
});
