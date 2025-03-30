import '@testing-library/jest-dom';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock Supabase
jest.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    from: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn(),
  }),
}));

// Mock Sonner
jest.mock('sonner', () => ({
  toast: jest.fn(),
}));

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
