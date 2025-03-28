import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import mockClient from './__mocks__/supabase';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockClient),
}));

describe('Chats Table', () => {
  const testUserId = 'test-user-id';
  const validChatData = {
    sender_id: testUserId,
    receiver_id: 'receiver-id',
    last_message: 'Hello',
    last_message_time: new Date().toISOString(),
    is_active: true
  };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  beforeEach(() => {
    (supabase.from as jest.Mock).mockImplementation(() => ({
      insert: jest.fn().mockImplementation((data) => ({
        data: data.sender_id && data.receiver_id ? data : null,
        error: data.sender_id && data.receiver_id ? null : { message: 'Invalid data provided' },
        single: jest.fn().mockReturnThis()
      })),
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validChatData } : null,
            error: id === testUserId ? null : { message: 'Record not found' }
          })
        }))
      })),
      update: jest.fn().mockImplementation((data) => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validChatData, ...data } : null,
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

  it('should create a new chat', async () => {
    const result = await supabase
      .from('chats')
      .insert({ id: testUserId, ...validChatData })
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validChatData });
  });

  it('should read an existing chat', async () => {
    const result = await supabase
      .from('chats')
      .select('*')
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validChatData });
  });

  it('should update an existing chat', async () => {
    const updateData = { last_message: 'Updated message' };
    const result = await supabase
      .from('chats')
      .update(updateData)
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validChatData, ...updateData });
  });

  it('should delete an existing chat', async () => {
    const result = await supabase
      .from('chats')
      .delete()
      .eq('id', testUserId)
      .then();

    expect(result.error).toBeNull();
    expect(result.data).toBeNull();
  });

  it('should handle non-existent chat operations', async () => {
    const nonExistentId = 'non-existent-id';
    const operations = await Promise.all([
      supabase.from('chats').select('*').eq('id', nonExistentId).single(),
      supabase.from('chats').update({ last_message: 'Test' }).eq('id', nonExistentId).single(),
      supabase.from('chats').delete().eq('id', nonExistentId).then()
    ]);

    operations.forEach(result => {
      expect(result.error).toBeDefined();
      expect(result.error!.message).toBe('Record not found');
    });
  });
});
