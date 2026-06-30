import { describe, it, expect, beforeEach } from "vitest";
import { useSelectedListStore } from "./useSelectedListStore";
import type { UserProfileSummary } from "@/types";

describe("useSelectedListStore", () => {
  const mockProfile: UserProfileSummary = {
    user_id: "123",
    username: "testuser",
    fullname: "Test User",
    picture: "https://example.com/pic.jpg",
    is_verified: true,
    followers: 1000,
    url: "https://instagram.com/testuser",
  };

  beforeEach(() => {
    // Clear the store before each test
    useSelectedListStore.getState().clearList();
  });

  it("should initially be empty", () => {
    expect(useSelectedListStore.getState().profiles).toEqual({});
  });

  it("should add a profile", () => {
    useSelectedListStore.getState().addProfile(mockProfile);
    expect(useSelectedListStore.getState().profiles["123"]).toEqual(
      mockProfile
    );
  });

  it("should remove a profile", () => {
    useSelectedListStore.getState().addProfile(mockProfile);
    useSelectedListStore.getState().removeProfile("123");
    expect(useSelectedListStore.getState().profiles["123"]).toBeUndefined();
  });

  it("should toggle a profile", () => {
    // Toggle on
    useSelectedListStore.getState().toggleProfile(mockProfile);
    expect(useSelectedListStore.getState().profiles["123"]).toEqual(
      mockProfile
    );

    // Toggle off
    useSelectedListStore.getState().toggleProfile(mockProfile);
    expect(useSelectedListStore.getState().profiles["123"]).toBeUndefined();
  });

  it("should clear the list", () => {
    useSelectedListStore.getState().addProfile(mockProfile);
    useSelectedListStore.getState().clearList();
    expect(useSelectedListStore.getState().profiles).toEqual({});
  });
});
