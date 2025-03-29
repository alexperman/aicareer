import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { handlers } from './tests/mocks/handlers';

// Define cookie option types
interface CookieOptions {
  path?: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

// Mock Request and Response classes for Next.js
class MockRequest {
  private _url: string;
  method: string;
  headers: Headers;
  body?: BodyInit | null;
  cache: RequestCache;
  credentials: RequestCredentials;
  destination: string;
  integrity: string;
  mode: RequestMode;
  redirect: RequestRedirect;
  referrer: string;
  referrerPolicy: ReferrerPolicy;
  private _cookies: Map<string, { name: string; value: string }>;

  constructor(input: RequestInfo | URL, init?: RequestInit) {
    this._url = typeof input === 'string' ? input : input.toString();
    this.method = init?.method || 'GET';
    this.headers = new Headers(init?.headers);
    this.body = init?.body;
    this.cache = 'default';
    this.credentials = 'same-origin';
    this.destination = '';
    this.integrity = '';
    this.mode = 'cors';
    this.redirect = 'follow';
    this.referrer = '';
    this.referrerPolicy = 'no-referrer';
    this._cookies = new Map();
  }

  // Define url as a getter-only property
  get url(): string {
    return this._url;
  }

  // Define cookies getter
  get cookies() {
    return {
      get: (name: string) => this._cookies.get(name),
      getAll: () => Array.from(this._cookies.values()),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      set: (name: string, value: string, _: CookieOptions = {}) => {
        this._cookies.set(name, { name, value });
      },
      delete: (name: string) => {
        this._cookies.delete(name);
      },
      has: (name: string) => this._cookies.has(name),
    };
  }

  clone(): MockRequest {
    return new MockRequest(this._url, {
      method: this.method,
      headers: this.headers,
      body: this.body,
    });
  }

  static json(body: Record<string, unknown>): MockRequest {
    return new MockRequest('http://localhost', { 
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  static error(): MockRequest {
    return new MockRequest('http://localhost/error');
  }

  static redirect(url: string): MockRequest {
    return new MockRequest(url);
  }
}

class MockResponse {
  status: number;
  statusText: string;
  headers: Headers;
  body?: BodyInit | null;
  ok: boolean;
  redirected: boolean;
  type: ResponseType;
  url: string;
  private _cookies: Map<string, { name: string; value: string; options?: CookieOptions }>;

  constructor(body?: BodyInit | null, init?: ResponseInit) {
    this.status = init?.status || 200;
    this.statusText = init?.statusText || 'OK';
    this.headers = new Headers(init?.headers);
    this.body = body;
    this.ok = this.status >= 200 && this.status < 300;
    this.redirected = false;
    this.type = 'basic';
    this.url = '';
    this._cookies = new Map();
  }

  // Define cookies getter
  get cookies() {
    return {
      get: (name: string) => this._cookies.get(name),
      getAll: () => Array.from(this._cookies.values()),
      set: (name: string, value: string, options: CookieOptions = {}) => {
        this._cookies.set(name, { name, value, options });
        return true;
      },
      delete: (name: string) => {
        return this._cookies.delete(name);
      },
      has: (name: string) => this._cookies.has(name),
    };
  }

  clone(): MockResponse {
    return new MockResponse(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
    });
  }

  json(): Promise<Record<string, unknown>> {
    return Promise.resolve(JSON.parse(this.body as string));
  }

  text(): Promise<string> {
    return Promise.resolve(this.body as string);
  }

  static json(data: Record<string, unknown>, init?: ResponseInit): MockResponse {
    return new MockResponse(JSON.stringify(data), {
      ...init,
      headers: {
        ...init?.headers,
        'Content-Type': 'application/json',
      },
    });
  }

  static error(): MockResponse {
    return new MockResponse(null, { status: 500 });
  }

  static redirect(url: string, status = 302): MockResponse {
    return new MockResponse(null, {
      status,
      headers: { Location: url },
    });
  }
}

// Assign the mock implementations to the global objects
global.Request = MockRequest as unknown as typeof Request;
global.Response = MockResponse as unknown as typeof Response;

// Mock Next.js server components
jest.mock('next/server', () => {
  return {
    NextRequest: jest.fn().mockImplementation((url, init) => {
      return new MockRequest(url, init);
    }),
    NextResponse: jest.fn().mockImplementation((body, init) => {
      return new MockResponse(body, init);
    }),
  };
});

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

// Setup MSW server
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
