import { db } from "@core/db";
import * as schema from "@core/db/schema/auth";
import { env } from "@core/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins/magic-link";
import { emailOTP } from "better-auth/plugins/email-otp";
import { organization } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  plugins: [
    tanstackStartCookies(),
    magicLink({
      expiresIn: 60 * 15,
      sendMagicLink: async ({ email, url }) => {
        console.log(`[DEV] Magic link for ${email}: ${url}`);
      },
    }),
    emailOTP({
      otpLength: 6,
      expiresIn: 60 * 10,
      sendVerificationOTP: async ({ email, otp, type }) => {
        console.log(`[DEV] OTP for ${email} (${type}): ${otp}`);
      },
    }),
    organization({
      organizationLimit: 3,
      sendInvitationEmail: async (data) => {
        console.log(`[DEV] Organization invitation for ${data.email}: ${data.id}`);
      },
      teams: {
        enabled: true,
        maximumTeams: 10,
        maximumMembersPerTeam: 50,
      },
    }),
  ],
});
