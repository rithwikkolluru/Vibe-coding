import type { ProfileDetailResponse } from "@/types";

const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

export async function loadProfileByUsername(
  username: string
): Promise<ProfileDetailResponse | null> {
  // import.meta.glob keys preserve the file system casing (e.g. "MrBeast6000.json")
  // We need to match it case-insensitively against the username from the URL
  const targetPathLower = `../assets/data/profiles/${username.toLowerCase()}.json`;
  
  const matchingKey = Object.keys(profileModules).find(
    (key) => key.toLowerCase() === targetPathLower
  );

  const loader = matchingKey ? profileModules[matchingKey] : undefined;

  if (!loader) {
    return null;
  }

  const result = await loader();
  const data =
    (result as { default?: ProfileDetailResponse }).default ?? result;
  return data as ProfileDetailResponse;
}
