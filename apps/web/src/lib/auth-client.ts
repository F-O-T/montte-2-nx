import { createAuthClient } from "better-auth/react";
import {
  magicLinkClient,
  emailOTPClient,
  organizationClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    magicLinkClient(),
    emailOTPClient(),
    organizationClient({
      teams: {
        enabled: true,
      },
    }),
  ],
});
