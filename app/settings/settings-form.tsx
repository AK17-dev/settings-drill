"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateSettings, type SettingsFormState } from "./actions";
import type { UserSettings } from "@/app/lib/settings";

const initialState: SettingsFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc]"
    >
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

export function SettingsForm({
  initialSettings,
}: {
  initialSettings: UserSettings;
}) {
  const [state, formAction] = useActionState(updateSettings, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Update your name and email address.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={initialSettings.name}
            required
            aria-invalid={state.errors?.name ? true : undefined}
            aria-describedby={state.errors?.name ? "name-error" : undefined}
            className="h-10 rounded-lg border border-black/10 bg-transparent px-3 text-sm outline-none focus:border-foreground dark:border-white/15"
          />
          {state.errors?.name && (
            <p id="name-error" className="text-sm text-red-600 dark:text-red-400">
              {state.errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={initialSettings.email}
            required
            aria-invalid={state.errors?.email ? true : undefined}
            aria-describedby={state.errors?.email ? "email-error" : undefined}
            className="h-10 rounded-lg border border-black/10 bg-transparent px-3 text-sm outline-none focus:border-foreground dark:border-white/15"
          />
          {state.errors?.email && (
            <p id="email-error" className="text-sm text-red-600 dark:text-red-400">
              {state.errors.email}
            </p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">Preferences</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Control how the app looks and notifies you.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="theme" className="text-sm font-medium">
            Theme
          </label>
          <select
            id="theme"
            name="theme"
            defaultValue={initialSettings.theme}
            className="h-10 rounded-lg border border-black/10 bg-transparent px-3 text-sm outline-none focus:border-foreground dark:border-white/15"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="emailNotifications"
            defaultChecked={initialSettings.emailNotifications}
            className="mt-0.5 h-4 w-4 rounded border-black/20 dark:border-white/25"
          />
          <span>
            <span className="font-medium">Email notifications</span>
            <br />
            <span className="text-zinc-500 dark:text-zinc-400">
              Get notified about activity on your account.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="marketingEmails"
            defaultChecked={initialSettings.marketingEmails}
            className="mt-0.5 h-4 w-4 rounded border-black/20 dark:border-white/25"
          />
          <span>
            <span className="font-medium">Marketing emails</span>
            <br />
            <span className="text-zinc-500 dark:text-zinc-400">
              Occasional product updates and tips.
            </span>
          </span>
        </label>
      </section>

      <div className="flex items-center gap-4">
        <SubmitButton />
        <p aria-live="polite" className="text-sm">
          {state.status === "success" && (
            <span className="text-green-600 dark:text-green-400">
              {state.message}
            </span>
          )}
          {state.status === "error" && !state.errors && (
            <span className="text-red-600 dark:text-red-400">{state.message}</span>
          )}
        </p>
      </div>
    </form>
  );
}
