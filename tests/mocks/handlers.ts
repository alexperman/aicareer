import { rest } from 'msw';
import { RequestHandler } from 'msw';

interface AuthResponse {
  data: {
    user: {
      id: string;
      email: string;
    };
    session: {
      access_token: string;
      refresh_token: string;
      expires_at: number;
    };
  };
}

interface SignoutResponse {
  data: {
    session: null;
  };
}

export const handlers: RequestHandler[] = [
  rest.post<AuthResponse>('/auth/v1/signup', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
          },
          session: {
            access_token: 'test-token',
            refresh_token: 'test-refresh-token',
            expires_at: Math.floor(Date.now() / 1000) + 3600,
          },
        },
      }),
    );
  }),

  rest.post<AuthResponse>('/auth/v1/signin', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
          },
          session: {
            access_token: 'test-token',
            refresh_token: 'test-refresh-token',
            expires_at: Math.floor(Date.now() / 1000) + 3600,
          },
        },
      }),
    );
  }),

  rest.post<SignoutResponse>('/auth/v1/signout', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          session: null,
        },
      }),
    );
  }),
];
