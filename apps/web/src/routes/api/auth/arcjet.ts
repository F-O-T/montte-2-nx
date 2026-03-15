export type BetterAuthDecision = {
  isDenied(): boolean;
  reason: {
    isBot(): boolean;
    isEmail(): boolean;
    isRateLimit(): boolean;
  };
};

export type BetterAuthArcjetProtector = {
  protect(
    request: unknown,
    details: { email: string },
  ): Promise<BetterAuthDecision>;
};

type BetterAuthRequestKind = 'magic-link' | 'signup';

type ProtectBetterAuthRequestOptions = {
  getArcjetRequest(request: Request): unknown;
  magicLinkProtector: BetterAuthArcjetProtector;
  signupProtector: BetterAuthArcjetProtector;
};

function getEmailFromBody(body: unknown): string | null {
  if (typeof body !== 'object' || body === null || !('email' in body)) {
    return null;
  }

  const { email } = body;

  if (typeof email !== 'string') {
    return null;
  }

  const normalizedEmail = email.trim();

  return normalizedEmail.length > 0 ? normalizedEmail : null;
}

export function shouldProtectBetterAuthRequest(
  request: Request,
): BetterAuthRequestKind | null {
  if (request.method !== 'POST') {
    return null;
  }

  const pathname = new URL(request.url).pathname;

  if (pathname.endsWith('/sign-up/email')) {
    return 'signup';
  }

  if (pathname.endsWith('/sign-in/magic-link')) {
    return 'magic-link';
  }

  return null;
}

export function createArcjetDeniedResponse(
  decision: BetterAuthDecision,
): Response {
  if (decision.reason.isEmail()) {
    return Response.json(
      {
        code: 'INVALID_EMAIL',
        message: 'Invalid email address.',
      },
      { status: 400 },
    );
  }

  if (decision.reason.isRateLimit()) {
    return Response.json(
      {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Please try again in a few minutes.',
      },
      { status: 429 },
    );
  }

  return Response.json(
    {
      code: 'FORBIDDEN',
      message: 'Forbidden',
    },
    { status: 403 },
  );
}

export async function protectBetterAuthRequest(
  request: Request,
  options: ProtectBetterAuthRequestOptions,
): Promise<Response | null> {
  const requestKind = shouldProtectBetterAuthRequest(request);

  if (requestKind === null) {
    return null;
  }

  const body = await request
    .clone()
    .json()
    .catch(() => null);
  const email = getEmailFromBody(body);

  if (email === null) {
    return Response.json(
      {
        code: 'INVALID_REQUEST',
        message: 'Email is required.',
      },
      { status: 400 },
    );
  }

  const protectedRequest = options.getArcjetRequest(request);
  const protector =
    requestKind === 'signup'
      ? options.signupProtector
      : options.magicLinkProtector;
  const decision = await protector.protect(protectedRequest, { email });

  if (!decision.isDenied()) {
    return null;
  }

  return createArcjetDeniedResponse(decision);
}
