import '@testing-library/jest-dom';
import { expect } from '@jest/globals';

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

// Extend Jest's expect to include custom matchers
expect.extend({
  toBeInTheDocument(received: any) {
    return {
      pass: received !== null,
      message: () => `Expected element to be in the document but it was not found`
    };
  },
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
      toBeInTheDocument(): R;
    }
  }
}
