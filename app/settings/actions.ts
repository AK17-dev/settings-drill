"use server";

import { revalidatePath } from "next/cache";
import { saveSettings, type Theme } from "@/app/lib/settings";

export type SettingsFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email", string>>;
};

const THEMES: Theme[] = ["system", "light", "dark"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function updateSettings(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  // TODO: verify the current user's session/authorization here before
  // reading or writing anything — this action is reachable via direct POST.

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const themeInput = String(formData.get("theme") ?? "system");
  const emailNotifications = formData.get("emailNotifications") === "on";
  const marketingEmails = formData.get("marketingEmails") === "on";

  const errors: SettingsFormState["errors"] = {};
  if (!name) errors.name = "Name is required.";
  if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, message: "Please fix the errors below." };
  }

  const theme = THEMES.includes(themeInput as Theme)
    ? (themeInput as Theme)
    : "system";

  saveSettings({ name, email, theme, emailNotifications, marketingEmails });

  revalidatePath("/settings");

  return { status: "success", message: "Settings saved." };
}
