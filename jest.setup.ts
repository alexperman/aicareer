import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { handlers } from './tests/mocks/handlers';

// Setup MSW server
export const server = setupServer(...handlers);

// Establish API mocking before all tests
beforeAll(() => server.listen());
// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished
afterAll(() => server.close());

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock Supabase client
jest.mock('@/utils/supabase/client', () => {
  const mockClient = {
    auth: {
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      user: { id: 'test-user-id' },
    },
    from: jest.fn().mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      match: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      data: null,
      error: null,
    })),
  };
  
  return {
    createClient: jest.fn(() => mockClient),
  };
});

// Add custom matchers for testing
expect.extend({
  toHaveBeenCalledWithMatch(received, ...expected) {
    const pass = this.equals(
      received.mock.calls.some((call: unknown[]) => 
        this.equals(call, expected, [this.utils.iterableEquality])
      ),
      true
    );

    const message = pass
      ? () => `expected ${this.utils.printReceived(received)} not to have been called with ${this.utils.printExpected(expected)}`
      : () => `expected ${this.utils.printReceived(received)} to have been called with ${this.utils.printExpected(expected)}`;

    return { pass, message };
  },
});

// Define global types for custom matchers
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledWithMatch(...args: unknown[]): R;
    }
  }
}
