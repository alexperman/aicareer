import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export const createServerSupabaseClient = () => {
  return createServerComponentClient({
    cookies: {
      get(name: string) {
        return process.cookies[name]
      },
      set(name: string, value: string) {
        process.cookies[name] = value
      },
      remove(name: string) {
        delete process.cookies[name]
      },
    },
  })
}

export const createClientSupabaseClient = () => {
  return createClientComponentClient()
}
