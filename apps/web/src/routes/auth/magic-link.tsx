import { Button } from '@packages/ui/components/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@packages/ui/components/field';
import { Input } from '@packages/ui/components/input';
import { Spinner } from '@packages/ui/components/spinner';
import { useForm } from '@tanstack/react-form';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Mail } from 'lucide-react';
import { type FormEvent, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { authClient } from '@web/lib/auth-client';
import { m } from '@web/paraglide/messages';

export const Route = createFileRoute('/auth/magic-link')({
  component: MagicLinkPage,
});

function MagicLinkPage() {
  const [isSent, setIsSent] = useState(false);

  const schema = z.object({
    email: z.email(m.invalid_email()),
  });

  const handleMagicLinkSignIn = useCallback(async (email: string) => {
    await authClient.signIn.magicLink(
      {
        email,
        callbackURL: `${window.location.origin}/auth/callback`,
      },
      {
        onError: ({ error }) => {
          toast.error(error.message, { id: 'magic-link-sign-in' });
        },
        onRequest: () => {
          toast.loading(m.auth_magic_link_sending_access_link(), {
            id: 'magic-link-sign-in',
          });
        },
        onSuccess: async () => {
          if (import.meta.env.DEV) {
            try {
              const res = await fetch(
                `/api/auth/dev/magic-link?email=${encodeURIComponent(email)}`,
              );
              const data = await res.json();
              if (data.url) {
                window.location.href = data.url;
                return;
              }
            } catch {}
          }

          setIsSent(true);
          toast.success(m.auth_magic_link_sent_toast(), {
            id: 'magic-link-sign-in',
          });
        },
      },
    );
  }, []);

  const form = useForm({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      await handleMagicLinkSignIn(value.email);
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

  if (isSent) {
    return (
      <section className="space-y-6 w-full">
        <div className="text-center space-y-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
              <Mail className="size-8 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold font-serif">
              {m.auth_magic_link_check_email_title()}
            </h1>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              {m.auth_magic_link_check_email_description()}
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              className="h-11"
              onClick={() => setIsSent(false)}
              variant="outline"
            >
              {m.auth_magic_link_try_another_email()}
            </Button>
            <Link to="/auth/sign-in">
              <Button className="w-full" variant="ghost">
                <ArrowLeft className="size-4" />
                {m.auth_back_to_sign_in()}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 w-full">
      <Link to="/auth/sign-in">
        <Button className="gap-2 px-0" variant="link">
          <ArrowLeft className="size-4" />
          {m.auth_back_to_sign_in()}
        </Button>
      </Link>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold font-serif">
          {m.auth_magic_link_title()}
        </h1>
        <p className="text-muted-foreground text-sm">
          {m.auth_magic_link_description()}
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
                  <FieldLabel htmlFor={field.name}>{m.email()}</FieldLabel>
                  <Input
                    aria-invalid={isInvalid}
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={m.auth_email_placeholder()}
                    type="email"
                    value={field.state.value}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
              {formState.isSubmitting ? (
                <Spinner />
              ) : (
                m.auth_magic_link_send_cta()
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <FieldDescription className="text-center">
        {m.auth_magic_link_expiration_note()}
      </FieldDescription>

      <div className="text-sm text-center">
        <div className="flex gap-1 justify-center items-center">
          <span>{m.auth_first_time_here()}</span>
          <Link
            className="text-primary font-medium hover:underline"
            to="/auth/sign-up"
          >
            {m.create_account()}
          </Link>
        </div>
      </div>
    </section>
  );
}
