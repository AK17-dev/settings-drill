import { z } from "zod";

export const settingsSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    currentPassword: z.string().default(""),
    newPassword: z.string().default(""),
    confirmPassword: z.string().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword.length === 0) {
      return;
    }

    if (data.newPassword.length < 8) {
      ctx.addIssue({
        code: "custom",
        path: ["newPassword"],
        message: "Password must be at least 8 characters",
      });
    }

    if (data.currentPassword.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["currentPassword"],
        message: "Current password is required to set a new password",
      });
    }

    if (data.confirmPassword !== data.newPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords must match",
      });
    }
  });

export type SettingsFormValues = z.infer<typeof settingsSchema>;
