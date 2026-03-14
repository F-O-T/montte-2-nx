import { env } from "@core/env/web";
import posthog from "posthog-js";

export function initPostHog() {
  posthog.init(env.VITE_POSTHOG_API_KEY, {
    api_host: env.VITE_POSTHOG_HOST,
  });
  return posthog;
}

export { posthog };
