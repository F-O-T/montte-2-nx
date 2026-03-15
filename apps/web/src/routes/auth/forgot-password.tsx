import { Button } from "@packages/ui/components/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@packages/ui/components/field";
import { Input } from "@packages/ui/components/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@packages/ui/components/input-otp";
import { PasswordInput } from "@packages/ui/components/password-input";
import { defineStepper } from "@packages/ui/components/stepper";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";

const steps = [
  { id: "enter-email", title: "enter-email" },
  { id: "enter-otp", title: "enter-otp" },
  { id: "enter-password", title: "enter-password" },
] as const;

const { Stepper } = defineStepper(...steps);

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const router = useRouter();
  const schema = z
    .object({
      confirmPassword: z.string(),
      email: z.email("Please enter a valid email address."),
      otp: z.string().min(6, "Code must be at least 6 characters."),
      password: z.string().min(8, "Password must be at least 8 characters."),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    });

  const handleSendOtp = useCallback(async (email: string) => {
    await authClient.emailOtp.sendVerificationOtp(
      {
        email,
        type: "forget-password",
      },
      {
        onError: ({ error }) => {
          toast.error(error.message);
        },
        onRequest: () => {
          toast.loading("Processing...");
        },
        onSuccess: () => {
          toast.success("Code sent!");
        },
      },
    );
  }, []);

  const handleResetPassword = useCallback(
    async (email: string, otp: string, password: string) => {
      await authClient.emailOtp.resetPassword(
        {
          email,
          otp,
          password,
        },
        {
          onError: ({ error }) => {
            toast.error(error.message);
          },
          onRequest: () => {
            toast.loading("Resetting...");
          },
          onSuccess: () => {
            toast.success("Password reset successfully!");
            router.navigate({
              to: "/auth/sign-in",
            });
          },
        },
      );
    },
    [router.navigate],
  );

  const form = useForm({
    defaultValues: {
      confirmPassword: "",
      email: "",
      otp: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await handleResetPassword(value.email, value.otp, value.password);
    },
    validators: {
      onBlur: schema,
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form],
  );

  function EmailStep() {
    return (
      <FieldGroup>
        <form.Field name="email">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  autoComplete="email"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="you@email.com"
                  type="email"
                  value={field.state.value}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>
    );
  }

  function OtpStep() {
    return (
      <FieldGroup>
        <form.Field name="otp">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>OTP Code</FieldLabel>
                <InputOTP
                  aria-invalid={isInvalid}
                  autoComplete="one-time-code"
                  id={field.name}
                  maxLength={6}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  value={field.state.value}
                >
                  <div className="w-full flex justify-center items-center gap-2">
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </div>
                </InputOTP>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>
    );
  }

  function PasswordStep() {
    return (
      <>
        <FieldGroup>
          <form.Field name="password">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <PasswordInput
                    aria-invalid={isInvalid}
                    autoComplete="new-password"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Minimum 8 characters"
                    value={field.state.value}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
        <FieldGroup>
          <form.Field name="confirmPassword">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                  <PasswordInput
                    aria-invalid={isInvalid}
                    autoComplete="new-password"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Repeat password"
                    value={field.state.value}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      </>
    );
  }

  return (
    <Stepper.Provider>
      {({ methods }) => (
        <section className="space-y-6 w-full">
          <Link to="/auth/sign-in">
            <Button className="gap-2 px-0" variant="link">
              <ArrowLeft className="size-4" />
              Back to sign in
            </Button>
          </Link>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold font-serif">Forgot Password</h1>
            <p className="text-muted-foreground text-sm">
              {methods.state.current.data.id === "enter-email"
                ? "Enter your email to receive a recovery code"
                : methods.state.current.data.id === "enter-otp"
                  ? "Enter the code sent to your email"
                  : "Enter your new password"}
            </p>
          </div>

          <div className="space-y-6">
            <Stepper.Navigation className="w-full">
              {steps.map((step) => (
                <Stepper.Step key={step.id} of={step.id} />
              ))}
            </Stepper.Navigation>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {methods.flow.switch({
                "enter-email": () => <EmailStep />,
                "enter-otp": () => <OtpStep />,
                "enter-password": () => <PasswordStep />,
              })}
              <Stepper.Controls className="flex w-full justify-between">
                <Button
                  disabled={methods.state.isFirst}
                  onClick={() => methods.navigation.prev()}
                  type="button"
                  variant="outline"
                >
                  Back
                </Button>
                {methods.state.isLast ? (
                  <form.Subscribe selector={(state) => state}>
                    {(formState) => (
                      <Button
                        className="flex gap-2 items-center justify-center"
                        disabled={!formState.canSubmit || formState.isSubmitting}
                        type="submit"
                        variant="default"
                      >
                        Reset Password
                      </Button>
                    )}
                  </form.Subscribe>
                ) : methods.flow.is("enter-email") ? (
                  <form.Subscribe
                    selector={(state) => ({
                      emailValid: state.fieldMeta.email?.isValid,
                      emailValue: state.values.email,
                    })}
                  >
                    {({ emailValid, emailValue }) => (
                      <Button
                        disabled={!emailValid}
                        onClick={async () => {
                          await handleSendOtp(emailValue);
                          methods.navigation.next();
                        }}
                        type="button"
                      >
                        Next
                      </Button>
                    )}
                  </form.Subscribe>
                ) : (
                  <Button onClick={() => methods.navigation.next()} type="button">
                    Next
                  </Button>
                )}
              </Stepper.Controls>
            </form>
          </div>

          <div className="text-sm text-center">
            <div className="flex gap-1 justify-center items-center">
              <span>Remember your password?</span>
              <Link className="text-primary hover:underline" to="/auth/sign-in">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      )}
    </Stepper.Provider>
  );
}
