import { useState, useMemo } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { useDebounce } from "@/hooks/useDebounce";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered = useMemo(
    () => filterProfiles(allProfiles, debouncedSearchQuery),
    [allProfiles, debouncedSearchQuery]
  );

  return (
    <Layout title="Find Influencers">
      {/* Hero */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-1">
          Discover <span className="text-violet-600">Top Influencers</span>
        </h2>
        <p className="text-slate-500">
          Browse top creators across social platforms and build your campaign list.
        </p>
      </div>

      {/* Filters */}
      <PlatformFilter
        selected={platform}
        onChange={(p) => {
          setPlatform(p);
          setSearchQuery("");
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Results meta */}
      <p className="text-xs text-slate-400 mb-4">
        Showing {filtered.length} of {allProfiles.length} influencers on{" "}
        <span className="capitalize font-medium">{platform}</span>
        {debouncedSearchQuery && ` matching "${debouncedSearchQuery}"`}
      </p>

      {/* List */}
      <ProfileList
        profiles={filtered}
        platform={platform}
        isFiltered={!!debouncedSearchQuery}
      />
    </Layout>
  );
}
