import { call } from '@orpc/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { protectMock, toArcjetRequestMock } = vi.hoisted(() => ({
  protectMock: vi.fn(),
  toArcjetRequestMock: vi.fn((req: Request) => req),
}));

vi.mock('@core/arcjet', () => ({
  aj: {
    withRule: vi.fn(() => ({
      protect: protectMock,
    })),
  },
  tokenBucket: vi.fn(() => ({ type: 'token-bucket' })),
  toArcjetRequest: toArcjetRequestMock,
}));

import { appRouter } from '../src/routers/index';

function allowDecision() {
  return {
    isDenied: () => false,
  };
}

function denyDecision() {
  return {
    isDenied: () => true,
  };
}

describe('appRouter', () => {
  beforeEach(() => {
    protectMock.mockReset();
    toArcjetRequestMock.mockClear();
    protectMock.mockResolvedValue(allowDecision());
  });

  it('returns OK for health checks when the request is allowed', async () => {
    const req = new Request('https://example.com/api/rpc');

    const result = await call(appRouter.healthCheck, undefined, {
      context: {
        req,
        session: null,
      },
    });

    expect(result).toBe('OK');
    expect(toArcjetRequestMock).toHaveBeenCalledWith(req);
    expect(protectMock).toHaveBeenCalledWith(req, { requested: 1 });
  });

  it('rejects private data when the request is unauthenticated', async () => {
    const req = new Request('https://example.com/api/rpc');

    await expect(
      call(appRouter.privateData, undefined, {
        context: {
          req,
          session: null,
        },
      }),
    ).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    });
  });

  it('returns private data for authenticated requests', async () => {
    const req = new Request('https://example.com/api/rpc');
    const session = {
      session: {
        id: 'session_1',
        createdAt: new Date('2030-01-01T00:00:00.000Z'),
        updatedAt: new Date('2030-01-01T00:00:00.000Z'),
        userId: 'user_1',
        expiresAt: new Date('2030-01-02T00:00:00.000Z'),
        token: 'token_1',
      },
      user: {
        id: 'user_1',
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        emailVerified: false,
        createdAt: new Date('2030-01-01T00:00:00.000Z'),
        updatedAt: new Date('2030-01-01T00:00:00.000Z'),
      },
    };

    const result = await call(appRouter.privateData, undefined, {
      context: {
        req,
        session,
      },
    });

    expect(result).toEqual({
      message: 'This is private',
      user: session.user,
    });
  });

  it('rejects requests when the rate limit is exceeded', async () => {
    const req = new Request('https://example.com/api/rpc');

    protectMock.mockResolvedValueOnce(denyDecision());

    await expect(
      call(appRouter.healthCheck, undefined, {
        context: {
          req,
          session: null,
        },
      }),
    ).rejects.toMatchObject({
      code: 'TOO_MANY_REQUESTS',
      message: 'Rate limit exceeded. Please try again later.',
    });
  });
});
