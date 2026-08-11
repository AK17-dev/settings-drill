import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsPage from "./page";

const { getSettings, updateSettings } = vi.hoisted(() => ({
  getSettings: vi.fn(() => ({
    name: "Jane Doe",
    email: "jane.doe@example.com",
  })),
  updateSettings: vi.fn(async (data: unknown) => data),
}));

vi.mock("@/lib/settings", () => ({
  getSettings,
  updateSettings,
}));

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  const name = screen.getByLabelText("Name");
  const email = screen.getByLabelText("Email");
  await user.clear(name);
  await user.type(name, "John Smith");
  await user.clear(email);
  await user.type(email, "john@example.com");
}

beforeEach(() => {
  updateSettings.mockClear();
  getSettings.mockClear();
});

describe("SettingsPage", () => {
  it("submits successfully and calls the persistence layer", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Settings saved.")).toBeInTheDocument();
    expect(updateSettings).toHaveBeenCalledTimes(1);
    expect(updateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "John Smith",
        email: "john@example.com",
      })
    );
  });

  it("requires the name field", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const name = screen.getByLabelText("Name");
    await user.clear(name);
    await user.tab();

    const error = await screen.findByText("Name is required");
    expect(error).toBeInTheDocument();
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAttribute("aria-describedby", "name-error");
    expect(error).toHaveAttribute("id", "name-error");
  });

  it("requires the email field", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const email = screen.getByLabelText("Email");
    await user.clear(email);
    await user.tab();

    const error = await screen.findByText("Email is required");
    expect(error).toBeInTheDocument();
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAttribute("aria-describedby", "email-error");
  });

  it("rejects an invalid email format", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const email = screen.getByLabelText("Email");
    await user.clear(email);
    await user.type(email, "not-an-email");
    await user.tab();

    const error = await screen.findByText("Invalid email address");
    expect(error).toBeInTheDocument();
    expect(email).toHaveAttribute("aria-invalid", "true");
  });

  it("rejects a new password shorter than 8 characters", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const newPassword = screen.getByLabelText("New password");
    await user.type(newPassword, "short");
    await user.tab();

    const error = await screen.findByText(
      "Password must be at least 8 characters"
    );
    expect(error).toBeInTheDocument();
    expect(newPassword).toHaveAttribute("aria-invalid", "true");
    expect(newPassword).toHaveAttribute(
      "aria-describedby",
      "newPassword-error"
    );

    expect(
      screen.queryByLabelText("Confirm password")
    ).not.toHaveAttribute("aria-invalid", "true");
  });

  it("rejects a confirm password that does not match", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const current = screen.getByLabelText("Current password");
    const newPassword = screen.getByLabelText("New password");
    const confirmPassword = screen.getByLabelText("Confirm password");

    await user.type(current, "oldpassword");
    await user.type(newPassword, "newpassword123");
    await user.type(confirmPassword, "different123");
    await user.tab();

    const error = await screen.findByText("Passwords must match");
    expect(error).toBeInTheDocument();
    expect(confirmPassword).toHaveAttribute("aria-invalid", "true");
    expect(confirmPassword).toHaveAttribute(
      "aria-describedby",
      "confirmPassword-error"
    );
  });

  it("does not flag confirmPassword as a mismatch when newPassword is empty", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const confirmPassword = screen.getByLabelText("Confirm password");
    await user.type(confirmPassword, "something123");
    await user.tab();

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.queryByText("Passwords must match")).not.toBeInTheDocument();
    expect(confirmPassword).not.toHaveAttribute("aria-invalid", "true");
  });
});
