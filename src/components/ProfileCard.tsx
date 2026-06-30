import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import {
  useIsProfileSelected,
  useSelectedListStore,
} from "@/store/useSelectedListStore";
import { CheckCircle, PlusCircle, Users } from "lucide-react";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
}

function formatFollowersLocal(count: number) {
  if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + "M";
  if (count >= 1_000) return (count / 1_000).toFixed(0) + "K";
  return count.toString();
}

function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined) return "";
  return (rate * 100).toFixed(2) + "% eng.";
}

export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const isSelected = useIsProfileSelected(profile.user_id);
  const toggleProfile = useSelectedListStore((state) => state.toggleProfile);
  const [imgError, setImgError] = useState(false);

  const handleCardClick = () => {
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleProfile(profile);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-slate-100 p-4 cursor-pointer hover:shadow-lg hover:border-violet-200 hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3"
    >
      {/* Top: avatar + info */}
      <div className="flex items-start gap-3">
        {imgError ? (
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Users size={22} className="text-slate-400" />
          </div>
        ) : (
          <img
            src={profile.picture}
            alt={profile.username}
            className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 bg-slate-100"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="font-bold text-slate-800 text-sm truncate">
              @{profile.username}
            </span>
            <VerifiedBadge verified={profile.is_verified} />
          </div>
          <div className="text-xs text-slate-500 truncate mt-0.5">
            {profile.fullname}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 rounded-xl px-3 py-2">
        <div className="flex items-center gap-1">
          <Users size={12} className="text-violet-400" />
          <span className="font-semibold">
            {formatFollowersLocal(profile.followers)}
          </span>
          <span className="text-slate-400">followers</span>
        </div>
        {profile.engagement_rate !== undefined && (
          <span className="text-slate-300">·</span>
        )}
        {profile.engagement_rate !== undefined && (
          <span className="text-violet-600 font-medium">
            {formatEngagementRate(profile.engagement_rate)}
          </span>
        )}
      </div>

      {/* Add to list button */}
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
          isSelected
            ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
            : "bg-violet-600 text-white hover:bg-violet-700 shadow-sm shadow-violet-200 group-hover:shadow-violet-300"
        }`}
        aria-label={isSelected ? "Remove from list" : "Add to list"}
      >
        {isSelected ? (
          <>
            <CheckCircle size={15} />
            Added to List
          </>
        ) : (
          <>
            <PlusCircle size={15} />
            Add to List
          </>
        )}
      </button>
    </div>
  );
});
