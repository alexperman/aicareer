import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import mockClient from './__mocks__/supabase';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockClient),
}));

describe('Offers Negotiation Table', () => {
  const testUserId = 'test-user-id';
  const validOfferData = {
    user_id: testUserId,
    application_id: 'application-id',
    company: 'Tech Corp',
    position: 'Senior Software Engineer',
    base_salary: 150000,
    bonus: {
      signing: 20000,
      performance: '10-15%',
      stock: '100 RSUs vesting over 4 years'
    },
    benefits: {
      health_insurance: 'Full coverage',
      pto: '20 days',
      remote_work: 'Hybrid',
      other: ['401k match', 'Professional development']
    },
    status: 'received',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Initial offer, room for negotiation',
    negotiation_history: []
  };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  beforeEach(() => {
    (supabase.from as jest.Mock).mockImplementation(() => ({
      insert: jest.fn().mockImplementation((data) => ({
        data: data.user_id && data.application_id ? data : null,
        error: data.user_id && data.application_id ? null : { message: 'Invalid data provided' },
        single: jest.fn().mockReturnThis()
      })),
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validOfferData } : null,
            error: id === testUserId ? null : { message: 'Record not found' }
          })
        }))
      })),
      update: jest.fn().mockImplementation((data) => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validOfferData, ...data } : null,
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

  it('should create a new offer negotiation', async () => {
    const result = await supabase
      .from('offers_negotiation')
      .insert({ id: testUserId, ...validOfferData })
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validOfferData });
  });

  it('should read an existing offer negotiation', async () => {
    const result = await supabase
      .from('offers_negotiation')
      .select('*')
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validOfferData });
  });

  it('should update an existing offer negotiation', async () => {
    const updateData = {
      status: 'counter_offered',
      base_salary: 165000,
      negotiation_history: [
        {
          date: new Date().toISOString(),
          action: 'counter_offer',
          details: 'Requested higher base salary and additional RSUs'
        }
      ]
    };
    const result = await supabase
      .from('offers_negotiation')
      .update(updateData)
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validOfferData, ...updateData });
  });

  it('should delete an existing offer negotiation', async () => {
    const result = await supabase
      .from('offers_negotiation')
      .delete()
      .eq('id', testUserId)
      .then();

    expect(result.error).toBeNull();
    expect(result.data).toBeNull();
  });

  it('should handle non-existent offer negotiation operations', async () => {
    const nonExistentId = 'non-existent-id';
    const operations = await Promise.all([
      supabase.from('offers_negotiation').select('*').eq('id', nonExistentId).single(),
      supabase.from('offers_negotiation').update({ status: 'declined' }).eq('id', nonExistentId).single(),
      supabase.from('offers_negotiation').delete().eq('id', nonExistentId).then()
    ]);

    operations.forEach(result => {
      expect(result.error).toBeDefined();
      expect(result.error!.message).toBe('Record not found');
    });
  });
});
