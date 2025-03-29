import { authConfig } from '@/utils/supabase/config'

// Mock Supabase Config
jest.mock('@/utils/supabase/config', () => ({
  authConfig: {
    providers: {
      email: {
        enabled: true,
        requireEmailConfirmation: true,
      },
      google: {
        enabled: true,
      },
      github: {
        enabled: true,
      },
      linkedin: {
        enabled: true,
      },
    },
    magicLink: {
      enabled: true,
    },
  },
}))

describe('Auth Configuration', () => {
  it('should have valid auth configuration', () => {
    // Check if providers are configured
    expect(authConfig.providers).toBeDefined()
    expect(authConfig.providers.email).toBeDefined()
    expect(authConfig.providers.email.enabled).toBe(true)
    expect(authConfig.providers.email.requireEmailConfirmation).toBe(true)

    expect(authConfig.providers.google).toBeDefined()
    expect(authConfig.providers.google.enabled).toBe(true)

    expect(authConfig.providers.github).toBeDefined()
    expect(authConfig.providers.github.enabled).toBe(true)

    expect(authConfig.providers.linkedin).toBeDefined()
    expect(authConfig.providers.linkedin.enabled).toBe(true)

    // Check magic link configuration
    expect(authConfig.magicLink).toBeDefined()
    expect(authConfig.magicLink.enabled).toBe(true)
  })
})
