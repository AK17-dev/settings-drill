export type Theme = "system" | "light" | "dark";

export type UserSettings = {
  name: string;
  email: string;
  theme: Theme;
  emailNotifications: boolean;
  marketingEmails: boolean;
};

// In-memory stand-in for a real persistence layer (database, API, etc.).
// State resets on server restart — swap this out once you wire up storage.
let settings: UserSettings = {
  name: "Jamie Rivera",
  email: "jamie@example.com",
  theme: "system",
  emailNotifications: true,
  marketingEmails: false,
};

export function getSettings(): UserSettings {
  return settings;
}

export function saveSettings(next: UserSettings): void {
  settings = next;
}
