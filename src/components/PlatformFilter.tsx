import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { Camera, Video, Music, Search } from "lucide-react";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  instagram: <Camera size={16} />,
  youtube: <Video size={16} />,
  tiktok: <Music size={16} />,
};

const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-200",
  youtube: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md shadow-red-200",
  tiktok: "bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-md shadow-slate-300",
};

const PLATFORM_INACTIVE: Record<Platform, string> = {
  instagram: "text-pink-600 border border-pink-200 hover:bg-pink-50",
  youtube: "text-red-600 border border-red-200 hover:bg-red-50",
  tiktok: "text-slate-600 border border-slate-200 hover:bg-slate-50",
};

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Platform pills */}
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
              selected === p
                ? PLATFORM_COLORS[p]
                : `bg-white ${PLATFORM_INACTIVE[p]}`
            }`}
          >
            {PLATFORM_ICONS[p]}
            {getPlatformLabel(p)}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative max-w-lg">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username or name..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent shadow-sm transition-shadow"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
