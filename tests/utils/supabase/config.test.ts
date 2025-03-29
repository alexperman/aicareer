import { describe, it, expect, jest, beforeEach } from '@jest/globals'

// Mock the environment variables
const mockEnv = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-key',
  SUPABASE_AUTH_EMAIL_FROM: 'test-from',
  SUPABASE_AUTH_GOOGLE_CLIENT_ID: 'google-id',
  SUPABASE_AUTH_GITHUB_CLIENT_ID: 'github-id',
  SUPABASE_AUTH_LINKEDIN_CLIENT_ID: 'linkedin-id',
}

beforeEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

describe('Supabase Configuration', () => {
  describe('Client Configuration', () => {
    it('should throw error when environment variables are missing', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      await expect(
        import('@/utils/supabase/config')
      ).rejects.toThrow('Missing Supabase environment variables')
    })

    it('should create client with correct configuration', async () => {
      // Mock environment variables
      process.env.NEXT_PUBLIC_SUPABASE_URL = mockEnv.NEXT_PUBLIC_SUPABASE_URL
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = mockEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
      process.env.SUPABASE_AUTH_EMAIL_FROM = mockEnv.SUPABASE_AUTH_EMAIL_FROM
      process.env.SUPABASE_AUTH_GOOGLE_CLIENT_ID = mockEnv.SUPABASE_AUTH_GOOGLE_CLIENT_ID
      process.env.SUPABASE_AUTH_GITHUB_CLIENT_ID = mockEnv.SUPABASE_AUTH_GITHUB_CLIENT_ID
      process.env.SUPABASE_AUTH_LINKEDIN_CLIENT_ID = mockEnv.SUPABASE_AUTH_LINKEDIN_CLIENT_ID

      // Mock createClient
      const mockCreateClient = jest.fn(() => ({
        auth: {
          signInWithPassword: jest.fn(),
          signInWithOtp: jest.fn(),
          signInWithOAuth: jest.fn(),
        },
      }))

      jest.doMock('@supabase/supabase-js', () => ({
        createClient: mockCreateClient,
      }))

      // Import the module fresh
      const configModule = await import('@/utils/supabase/config')
      const { supabase } = configModule

      expect(supabase).toBeDefined()
      expect(supabase.auth).toBeDefined()
      expect(mockCreateClient).toHaveBeenCalledTimes(1)
      expect(mockCreateClient).toHaveBeenCalledWith(
        mockEnv.NEXT_PUBLIC_SUPABASE_URL,
        mockEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        expect.objectContaining({
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
          },
        })
      )
    })
  })
})
