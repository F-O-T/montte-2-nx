import { describe, expect, it, vi } from 'vitest';

import {
  createArcjetDeniedResponse,
  protectBetterAuthRequest,
  shouldProtectBetterAuthRequest,
} from '@web/routes/api/auth/arcjet';

function createDecision(options?: {
  denied?: boolean;
  bot?: boolean;
  email?: boolean;
  rateLimit?: boolean;
}) {
  return {
    isDenied: () => options?.denied ?? false,
    reason: {
      isBot: () => options?.bot ?? false,
      isEmail: () => options?.email ?? false,
      isRateLimit: () => options?.rateLimit ?? false,
    },
  };
}

describe('shouldProtectBetterAuthRequest', () => {
  it('matches the email sign-up endpoint', () => {
    const request = new Request('https://example.com/api/auth/sign-up/email', {
      method: 'POST',
    });

    expect(shouldProtectBetterAuthRequest(request)).toBe('signup');
  });

  it('matches the magic-link sign-in endpoint', () => {
    const request = new Request(
      'https://example.com/api/auth/sign-in/magic-link',
      {
        method: 'POST',
      },
    );

    expect(shouldProtectBetterAuthRequest(request)).toBe('magic-link');
  });

  it('matches protected endpoints with trailing slashes', () => {
    const signUpRequest = new Request(
      'https://example.com/api/auth/sign-up/email/',
      {
        method: 'POST',
      },
    );
    const magicLinkRequest = new Request(
      'https://example.com/api/auth/sign-in/magic-link/',
      {
        method: 'POST',
      },
    );

    expect(shouldProtectBetterAuthRequest(signUpRequest)).toBe('signup');
    expect(shouldProtectBetterAuthRequest(magicLinkRequest)).toBe('magic-link');
  });

  it('ignores unrelated auth requests', () => {
    const request = new Request('https://example.com/api/auth/sign-in/email', {
      method: 'POST',
    });

    expect(shouldProtectBetterAuthRequest(request)).toBeNull();
  });
});

describe('createArcjetDeniedResponse', () => {
  it('returns an invalid email response for email denials', async () => {
    const response = createArcjetDeniedResponse(
      createDecision({ denied: true, email: true }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      code: 'INVALID_EMAIL',
      message: 'Invalid email address.',
    });
  });

  it('returns a rate-limit response for rate-limit denials', async () => {
    const response = createArcjetDeniedResponse(
      createDecision({ denied: true, rateLimit: true }),
    );

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Please try again in a few minutes.',
    });
  });

  it('returns a forbidden response for bot denials', async () => {
    const response = createArcjetDeniedResponse(
      createDecision({ denied: true, bot: true }),
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      code: 'FORBIDDEN',
      message: 'Forbidden',
    });
  });
});

describe('protectBetterAuthRequest', () => {
  it('protects email sign-up requests with the submitted email', async () => {
    const signupProtect = vi.fn().mockResolvedValue(createDecision());
    const request = new Request('https://example.com/api/auth/sign-up/email', {
      body: JSON.stringify({ email: 'ada@example.com' }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });

    const response = await protectBetterAuthRequest(request, {
      getArcjetRequest: (currentRequest: Request) => currentRequest,
      magicLinkProtector: { protect: vi.fn() },
      signupProtector: { protect: signupProtect },
    });

    expect(response).toBeNull();
    expect(signupProtect).toHaveBeenCalledWith(request, {
      email: 'ada@example.com',
    });
  });

  it('validates the email submitted to magic-link sign-in', async () => {
    const magicLinkProtect = vi.fn().mockResolvedValue(createDecision());
    const request = new Request(
      'https://example.com/api/auth/sign-in/magic-link',
      {
        body: JSON.stringify({ email: 'ada@example.com' }),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      },
    );

    const response = await protectBetterAuthRequest(request, {
      getArcjetRequest: (currentRequest: Request) => currentRequest,
      magicLinkProtector: { protect: magicLinkProtect },
      signupProtector: { protect: vi.fn() },
    });

    expect(response).toBeNull();
    expect(magicLinkProtect).toHaveBeenCalledWith(request, {
      email: 'ada@example.com',
    });
  });

  it('rejects requests without an email payload', async () => {
    const request = new Request('https://example.com/api/auth/sign-up/email', {
      body: JSON.stringify({ name: 'Ada' }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });

    const response = await protectBetterAuthRequest(request, {
      getArcjetRequest: (currentRequest: Request) => currentRequest,
      magicLinkProtector: { protect: vi.fn() },
      signupProtector: { protect: vi.fn() },
    });

    expect(response?.status).toBe(400);
    await expect(response?.json()).resolves.toEqual({
      code: 'INVALID_REQUEST',
      message: 'Email is required.',
    });
  });

  it('rejects malformed JSON bodies for protected requests', async () => {
    const request = new Request('https://example.com/api/auth/sign-up/email', {
      body: '}{',
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });

    const response = await protectBetterAuthRequest(request, {
      getArcjetRequest: (currentRequest: Request) => currentRequest,
      magicLinkProtector: { protect: vi.fn() },
      signupProtector: { protect: vi.fn() },
    });

    expect(response?.status).toBe(400);
    await expect(response?.json()).resolves.toEqual({
      code: 'INVALID_REQUEST',
      message: 'Email is required.',
    });
  });

  it('returns a controlled error response when protector rejects', async () => {
    const request = new Request('https://example.com/api/auth/sign-up/email', {
      body: JSON.stringify({ email: 'ada@example.com' }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });

    const response = await protectBetterAuthRequest(request, {
      getArcjetRequest: (currentRequest: Request) => currentRequest,
      magicLinkProtector: { protect: vi.fn() },
      signupProtector: {
        protect: vi.fn().mockRejectedValue(new Error('boom')),
      },
    });

    expect(response).not.toBeNull();
    expect(response?.status).toBe(403);
    await expect(response?.json()).resolves.toEqual({
      code: 'PROTECTION_FAILED',
      message: 'Unable to validate request.',
    });
  });
});
