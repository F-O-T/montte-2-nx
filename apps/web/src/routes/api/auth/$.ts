import { createFileRoute } from '@tanstack/react-router';
import {
  aj,
  detectBot,
  slidingWindow,
  toArcjetRequest,
  validateEmail,
} from '@core/arcjet';
import { auth } from '@core/auth';

import { protectBetterAuthRequest } from '@web/routes/api/auth/arcjet';

function createAuthProtection() {
  return aj
    .withRule(
      detectBot({
        allow: [],
        mode: 'LIVE',
      }),
    )
    .withRule(
      validateEmail({
        deny: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
        mode: 'LIVE',
      }),
    )
    .withRule(
      slidingWindow({
        interval: '10m',
        max: 5,
        mode: 'LIVE',
      }),
    );
}

const signupProtection = createAuthProtection();
const magicLinkProtection = createAuthProtection();

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
