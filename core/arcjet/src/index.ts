import { env } from '@core/env';
import arcjet, {
  detectBot,
  fixedWindow,
  shield,
  slidingWindow,
  tokenBucket,
  validateEmail,
} from '@arcjet/node';
import type { ArcjetNodeRequest } from '@arcjet/node';

export const aj = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ['ip.src'],
  rules: [shield({ mode: 'LIVE' })],
});

export function toArcjetRequest(req: Request): ArcjetNodeRequest {
  const url = new URL(req.url);
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    headers,
    method: req.method,
    url: url.pathname + url.search,
    socket: {
      remoteAddress: headers['x-forwarded-for']?.split(',')[0]?.trim(),
    },
  };
}

export {
  detectBot,
  fixedWindow,
  shield,
  slidingWindow,
  tokenBucket,
  validateEmail,
};
export type { ArcjetDecision, ArcjetRuleResult } from '@arcjet/node';
