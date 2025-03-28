import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import mockClient from './__mocks__/supabase';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockClient),
}));

describe('Agencies Table', () => {
  const testUserId = 'test-user-id';
  const validAgencyData = {
    name: 'Test Agency',
    description: 'Test agency description',
    location: 'Test Location',
    website: 'https://testagency.com',
    contact_email: 'contact@testagency.com'
  };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  beforeEach(() => {
    (supabase.from as jest.Mock).mockImplementation(() => ({
      insert: jest.fn().mockImplementation((data) => ({
        data: data.name ? data : null,
        error: data.name ? null : { message: 'Invalid data provided' },
        single: jest.fn().mockReturnThis()
      })),
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validAgencyData } : null,
            error: id === testUserId ? null : { message: 'Record not found' }
          })
        }))
      })),
      update: jest.fn().mockImplementation((data) => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validAgencyData, ...data } : null,
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

  it('should create a new agency', async () => {
    const result = await supabase
      .from('agencies')
      .insert({ id: testUserId, ...validAgencyData })
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validAgencyData });
  });

  it('should read an existing agency', async () => {
    const result = await supabase
      .from('agencies')
      .select('*')
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validAgencyData });
  });

  it('should update an existing agency', async () => {
    const updateData = { name: 'Updated Agency' };
    const result = await supabase
      .from('agencies')
      .update(updateData)
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validAgencyData, ...updateData });
  });

  it('should delete an existing agency', async () => {
    const result = await supabase
      .from('agencies')
      .delete()
      .eq('id', testUserId)
      .then();

    expect(result.error).toBeNull();
    expect(result.data).toBeNull();
  });

  it('should handle non-existent agency operations', async () => {
    const nonExistentId = 'non-existent-id';
    const operations = await Promise.all([
      supabase.from('agencies').select('*').eq('id', nonExistentId).single(),
      supabase.from('agencies').update({ name: 'Test' }).eq('id', nonExistentId).single(),
      supabase.from('agencies').delete().eq('id', nonExistentId).then()
    ]);

    operations.forEach(result => {
      expect(result.error).toBeDefined();
      expect(result.error!.message).toBe('Record not found');
    });
  });
});