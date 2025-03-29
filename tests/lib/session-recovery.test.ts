import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookie, setSessionCookie, clearSessionCookie } from '@/lib/session-recovery';
import { createClient } from '@supabase/supabase-js';

// Define types for mocking
interface SessionType {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface SessionResponseType {
  data: { session: SessionType | null };
  error: Error | null;
}

// Mock the createClient function
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('Session Recovery', () => {
  // Store original environment variables
  const originalEnv = process.env;

  // Create mock objects
  const mockRequest = new NextRequest('http://localhost');
  const mockResponse = new NextResponse();
  
  // Create mock session data
  const mockSession: SessionType = {
    access_token: 'test-token',
    refresh_token: 'test-refresh-token',
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  };

  // Create mock Supabase client with properly typed mock function
  const mockGetSession = jest.fn<() => Promise<SessionResponseType>>().mockImplementation(() => {
    return Promise.resolve({
      data: { session: mockSession },
      error: null,
    });
  });

  const mockSupabase = {
    auth: {
      getSession: mockGetSession,
    },
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock environment variables
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test-supabase-url.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    };
    
    // Setup mock Supabase client
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    
    // Setup cookies for tests
    mockRequest.cookies.set('aicareer_session', mockSession.access_token);
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('should get session from cookie', async () => {
    const session = await getSessionFromCookie(mockRequest);
    expect(session).toBeDefined();
    expect(session?.access_token).toBe(mockSession.access_token);
  });

  it('should handle expired sessions', async () => {
    const expiredSession: SessionType = {
      ...mockSession,
      expires_at: Math.floor(Date.now() / 1000) - 3600,
    };
    
    // Mock the Supabase response for this test
    mockGetSession.mockImplementationOnce(() => {
      return Promise.resolve({
        data: { session: expiredSession },
        error: null,
      });
    });

    const session = await getSessionFromCookie(mockRequest);
    expect(session).toBeNull();
  });

  it('should set session cookie', () => {
    setSessionCookie(mockResponse, mockSession);
    
    const cookie = mockResponse.cookies.get('aicareer_session');
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBe(mockSession.access_token);
  });

  it('should clear session cookie', () => {
    clearSessionCookie(mockResponse);
    
    const cookie = mockResponse.cookies.get('aicareer_session');
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBe('');
  });

  it('should handle custom options', () => {
    const customOptions = {
      maxAge: 3600,
      cookieName: 'custom_session',
      cookieOptions: {
        path: '/api',
        httpOnly: true,
        secure: true,
        sameSite: 'strict' as const,
      },
    };

    setSessionCookie(mockResponse, mockSession, customOptions);
    
    const cookie = mockResponse.cookies.get('custom_session');
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBe(mockSession.access_token);
  });
});
