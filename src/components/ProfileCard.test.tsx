import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProfileCard } from "./ProfileCard";
import { useSelectedListStore } from "@/store/useSelectedListStore";
import type { UserProfileSummary } from "@/types";
import { MemoryRouter } from "react-router-dom";

const mockProfile: UserProfileSummary = {
  user_id: "123",
  username: "testuser",
  fullname: "Test User",
  picture: "https://example.com/pic.jpg",
  is_verified: true,
  followers: 1000,
  url: "https://instagram.com/testuser",
};

describe("ProfileCard", () => {
  it("renders profile information correctly", () => {
    render(
      <MemoryRouter>
        <ProfileCard profile={mockProfile} platform="instagram" />
      </MemoryRouter>
    );

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("@testuser")).toBeInTheDocument();
  });

  it('toggles selection state when "Add to List" is clicked', () => {
    // Ensure store is empty
    useSelectedListStore.getState().clearList();

    render(
      <MemoryRouter>
        <ProfileCard profile={mockProfile} platform="instagram" />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /Add to List/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    // After click, it should be in the store
    expect(useSelectedListStore.getState().profiles["123"]).toBeDefined();
  });
});
