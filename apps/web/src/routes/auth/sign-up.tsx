import { Button } from "@packages/ui/components/button";
import { FieldError, FieldGroup, FieldLabel, Field } from "@packages/ui/components/field";
import { Input } from "@packages/ui/components/input";
import { PasswordInput } from "@packages/ui/components/password-input";
import { defineStepper } from "@packages/ui/components/stepper";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { type FormEvent, useCallback } from "react";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";

const steps = [
  { id: "basic-info", title: "basic-info" },
  { id: "password", title: "password" },
] as const;

const { Stepper } = defineStepper(...steps);

export const Route = createFileRoute("/auth/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  const router = useRouter();
  const schema = z
    .object({
      confirmPassword: z.string(),
      email: z.email("Please enter a valid email address."),
      name: z.string().min(2, "Name must be at least 2 characters."),
      password: z.string().min(8, "Password must be at least 8 characters."),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    });

  const handleSignUp = useCallback(
    async (email: string, name: string, password: string) => {
      await authClient.signUp.email(
        {
          email,
          name,
          password,
        },
        {
          onError: ({ error }) => {
            toast.error(error.message);
          },
          onRequest: () => {
            toast.loading("Creating your account...");
          },
          onSuccess: () => {
            toast.success("Account created successfully!");
            router.navigate({
              search: { email },
              to: "/auth/email-verification",
            });
          },
        },
      );
    },
    [router],
  );

  const form = useForm({
    defaultValues: {
      confirmPassword: "",
      email: "",
      name: "",
      password: "",
    },
    onSubmit: async ({ value, formApi }) => {
      const { email, name, password } = value;
      await handleSignUp(email, name, password);
      formApi.reset();
    },
    validators: {
      onBlur: schema,
    },
  });

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form],
  );

  function BasicInfoStep() {
    return (
      <>
        <FieldGroup>
          <form.Field name="name">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    aria-invalid={isInvalid}
                    autoComplete="name"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Your full name"
                    value={field.state.value}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
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
      </>
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
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold font-serif">Create Account</h1>
            <p className="text-muted-foreground text-sm">Create your account to get started.</p>
          </div>

          <div className="space-y-6">
            <Stepper.Navigation>
              {steps.map((step) => (
                <Stepper.Step key={step.id} of={step.id}></Stepper.Step>
              ))}
            </Stepper.Navigation>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {methods.flow.switch({
                "basic-info": () => <BasicInfoStep />,
                password: () => <PasswordStep />,
              })}
              <Stepper.Controls className="flex w-full justify-between">
                <Button
                  className="h-11"
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
                        className="h-11"
                        disabled={!formState.canSubmit || formState.isSubmitting}
                        type="submit"
                        variant="default"
                      >
                        Submit
                      </Button>
                    )}
                  </form.Subscribe>
                ) : (
                  <form.Subscribe
                    selector={(state) => ({
                      emailValid: state.fieldMeta.email?.isValid,
                      nameValid: state.fieldMeta.name?.isValid,
                    })}
                  >
                    {({ nameValid, emailValid }) => (
                      <Button
                        className="h-11"
                        disabled={!nameValid || !emailValid}
                        onClick={() => methods.navigation.next()}
                        type="button"
                      >
                        Next
                      </Button>
                    )}
                  </form.Subscribe>
                )}
              </Stepper.Controls>
            </form>
          </div>

          <div className="text-sm text-center space-y-4">
            <div className="flex gap-1 justify-center items-center">
              <span>Already have an account?</span>
              <Link className="text-primary font-medium hover:underline" to="/auth/sign-in">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      )}
    </Stepper.Provider>
  );
}
