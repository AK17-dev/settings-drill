export type ProfileSettings = {
  name: string;
  email: string;
};

export type UpdateSettingsInput = {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
};

let store: ProfileSettings = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
};

export function getSettings(): ProfileSettings {
  return { ...store };
}

export async function updateSettings(
  input: UpdateSettingsInput
): Promise<ProfileSettings> {
  store = { name: input.name, email: input.email };
  return { ...store };
}
