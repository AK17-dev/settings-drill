"use client";

import { useState, type FormEvent } from "react";

type FormValues = {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  const wantsPasswordChange =
    values.currentPassword || values.newPassword || values.confirmPassword;

  if (wantsPasswordChange) {
    if (!values.currentPassword) {
      errors.currentPassword = "Enter your current password.";
    }
    if (!values.newPassword) {
      errors.newPassword = "Enter a new password.";
    } else if (values.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters.";
    }
    if (values.confirmPassword !== values.newPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }

  return errors;
}

export default function SettingsPage() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  function handleChange(field: keyof FormValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      setStatus("idle");
    };
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    console.log("Settings saved:", values);
    setValues((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    setStatus("saved");
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-8 px-6 py-16 sm:px-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Settings
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Update your profile information and password.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-8 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-[#0a0a0a] sm:p-8"
        >
          <section className="flex flex-col gap-5">
            <h2 className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Profile
            </h2>

            <Field
              id="name"
              label="Full name"
              value={values.name}
              onChange={handleChange("name")}
              error={errors.name}
              autoComplete="name"
            />

            <Field
              id="email"
              label="Email"
              type="email"
              value={values.email}
              onChange={handleChange("email")}
              error={errors.email}
              autoComplete="email"
            />
          </section>

          <hr className="border-black/[.08] dark:border-white/[.145]" />

          <section className="flex flex-col gap-5">
            <h2 className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Password
            </h2>
            <p className="-mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Leave blank if you don&apos;t want to change your password.
            </p>

            <Field
              id="currentPassword"
              label="Current password"
              type="password"
              value={values.currentPassword}
              onChange={handleChange("currentPassword")}
              error={errors.currentPassword}
              autoComplete="current-password"
            />

            <Field
              id="newPassword"
              label="New password"
              type="password"
              value={values.newPassword}
              onChange={handleChange("newPassword")}
              error={errors.newPassword}
              autoComplete="new-password"
            />

            <Field
              id="confirmPassword"
              label="Confirm new password"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
          </section>

          <div className="flex items-center justify-between pt-2">
            <span
              className="text-sm text-zinc-600 dark:text-zinc-400"
              role="status"
              aria-live="polite"
            >
              {status === "saved" ? "Settings saved." : ""}
            </span>
            <button
              type="submit"
              className="flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Save changes
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-11 rounded-lg border bg-transparent px-3 text-sm text-black outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 ${
          error
            ? "border-red-500 dark:border-red-500"
            : "border-black/[.12] dark:border-white/[.145]"
        }`}
      />
      {error ? (
        <span
          id={`${id}-error`}
          className="text-xs text-red-600 dark:text-red-400"
        >
          {error}
        </span>
      ) : null}
    </div>
  );
}
