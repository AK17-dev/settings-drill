"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSettings, updateSettings } from "@/lib/settings";
import { settingsSchema, type SettingsFormValues } from "./schema";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const currentSettings = getSettings();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    mode: "onBlur",
    defaultValues: {
      name: currentSettings.name,
      email: currentSettings.email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setSaved(false);
    await updateSettings(data);
    setSaved(true);
  });

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-xl font-semibold">Profile Settings</h1>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            {...register("name")}
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="rounded border px-3 py-2"
          />
          {errors.name && (
            <p id="name-error" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            {...register("email")}
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="rounded border px-3 py-2"
          />
          {errors.email && (
            <p id="email-error" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="currentPassword">Current password</label>
          <input
            id="currentPassword"
            type="password"
            {...register("currentPassword")}
            aria-invalid={errors.currentPassword ? "true" : undefined}
            aria-describedby={
              errors.currentPassword ? "currentPassword-error" : undefined
            }
            className="rounded border px-3 py-2"
          />
          {errors.currentPassword && (
            <p id="currentPassword-error" role="alert">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            type="password"
            {...register("newPassword")}
            aria-invalid={errors.newPassword ? "true" : undefined}
            aria-describedby={
              errors.newPassword ? "newPassword-error" : undefined
            }
            className="rounded border px-3 py-2"
          />
          {errors.newPassword && (
            <p id="newPassword-error" role="alert">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            aria-invalid={errors.confirmPassword ? "true" : undefined}
            aria-describedby={
              errors.confirmPassword ? "confirmPassword-error" : undefined
            }
            className="rounded border px-3 py-2"
          />
          {errors.confirmPassword && (
            <p id="confirmPassword-error" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          Save
        </button>

        <p aria-live="polite">{saved ? "Settings saved." : ""}</p>
      </form>
    </main>
  );
}
