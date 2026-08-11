import type { Metadata } from "next";
import { getSettings } from "@/app/lib/settings";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  const settings = getSettings();

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="w-full max-w-xl rounded-2xl border border-black/10 bg-white p-8 dark:border-white/15 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your profile and preferences.
        </p>
        <div className="mt-8">
          <SettingsForm initialSettings={settings} />
        </div>
      </div>
    </div>
  );
}
