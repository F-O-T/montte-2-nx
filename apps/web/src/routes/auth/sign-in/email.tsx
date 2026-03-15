import { Button } from "@packages/ui/components/button";
import {
   Field,
   FieldError,
   FieldGroup,
   FieldLabel,
} from "@packages/ui/components/field";
import { Input } from "@packages/ui/components/input";
import { PasswordInput } from "@packages/ui/components/password-input";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { type FormEvent, useCallback } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/auth/sign-in/email")({
   component: SignInEmailPage,
});

function SignInEmailPage() {
   const schema = z.object({
      email: z.email("Please enter a valid email address."),
      password: z.string().min(8, "Password must be at least 8 characters."),
   });
   const router = useRouter();

   const handleSignIn = useCallback(
      async (email: string, password: string) => {
         await authClient.signIn.email(
            {
               email,
               password,
            },
            {
               onError: ({ error }) => {
                  toast.error(error.message);
               },
               onRequest: () => {
                  toast.loading("Signing in...", {
                     id: "sign-in-email",
                  });
               },
               onSuccess: () => {
                  toast.success("Welcome back!", { id: "sign-in-email" });
                  router.navigate({ to: "/auth/callback" });
               },
            },
         );
      },
      [router],
   );

   const form = useForm({
      defaultValues: {
         email: "",
         password: "",
      },
      onSubmit: async ({ value, formApi }) => {
         const { email, password } = value;
         await handleSignIn(email, password);
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

   return (
      <section className="space-y-6 w-full">
         <Link to="/auth/sign-in">
            <Button className="gap-2 px-0" variant="link">
               <ArrowLeft className="size-4" />
               Back to sign in options
            </Button>
         </Link>

         <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold font-serif">
               Sign in with Email
            </h1>
            <p className="text-muted-foreground text-sm">
               Use your email and password to access your account.
            </p>
         </div>

         <form className="space-y-4" onSubmit={handleSubmit}>
            <FieldGroup>
               <form.Field name="email">
                  {(field) => {
                     const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                     return (
                        <Field data-invalid={isInvalid}>
                           <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                           <Input
                              aria-invalid={isInvalid}
                              id={field.name}
                              name={field.name}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                 field.handleChange(e.target.value)
                              }
                              placeholder="you@email.com"
                              type="email"
                              value={field.state.value}
                           />
                           {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                           )}
                        </Field>
                     );
                  }}
               </form.Field>
            </FieldGroup>
            <FieldGroup>
               <form.Field name="password">
                  {(field) => {
                     const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                     return (
                        <Field aria-required data-invalid={isInvalid}>
                           <div className="flex justify-between items-center">
                              <FieldLabel htmlFor={field.name}>
                                 Password
                              </FieldLabel>
                              <Link
                                 className="underline text-sm text-muted-foreground hover:text-primary"
                                 to="/auth/forgot-password"
                              >
                                 Forgot password
                              </Link>
                           </div>
                           <PasswordInput
                              autoComplete="current-password"
                              id={field.name}
                              name={field.name}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                 field.handleChange(e.target.value)
                              }
                              placeholder="********"
                              value={field.state.value}
                           />
                           {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                           )}
                        </Field>
                     );
                  }}
               </form.Field>
            </FieldGroup>
            <form.Subscribe selector={(state) => state}>
               {(formState) => (
                  <Button
                     className="w-full h-11"
                     disabled={!formState.canSubmit || formState.isSubmitting}
                     type="submit"
                  >
                     Sign In
                  </Button>
               )}
            </form.Subscribe>
         </form>

         <div className="text-sm text-center">
            <div className="flex gap-1 justify-center items-center">
               <span>First time here? </span>
               <Link
                  className="text-primary font-medium hover:underline"
                  to="/auth/sign-up"
               >
                  Create account
               </Link>
            </div>
         </div>
      </section>
   );
}
