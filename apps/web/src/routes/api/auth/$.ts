import { createFileRoute } from '@tanstack/react-router';
import {
  aj,
  detectBot,
  slidingWindow,
  toArcjetRequest,
  validateEmail,
} from '@core/arcjet';
import { auth } from '@core/auth';

import { protectBetterAuthRequest } from './arcjet';

const signupProtection = aj.withRule(
  detectBot({
    allow: [],
    mode: 'LIVE',
  }),
  validateEmail({
    block: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
    mode: 'LIVE',
  }),
  slidingWindow({
    interval: '10m',
    max: 5,
    mode: 'LIVE',
  }),
);

const magicLinkProtection = aj.withRule(
  validateEmail({
    block: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
    mode: 'LIVE',
  }),
);

async function handleAuthRequest(request: Request) {
  const deniedResponse = await protectBetterAuthRequest(request, {
    getArcjetRequest: toArcjetRequest,
    magicLinkProtector: magicLinkProtection,
    signupProtector: signupProtection,
  });

  if (deniedResponse) {
    return deniedResponse;
  }

  return auth.handler(request);
}

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => {
        return auth.handler(request);
      },
      POST: ({ request }) => {
        return handleAuthRequest(request);
      },
    },
  },
});
