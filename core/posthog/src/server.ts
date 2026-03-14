import { env } from "@core/env/server";
import { PostHog } from "posthog-node";

export function createPostHogClient() {
  return new PostHog(env.POSTHOG_API_KEY, {
    host: env.POSTHOG_HOST,
  });
}

export const posthog = createPostHogClient();

export { PostHog };
