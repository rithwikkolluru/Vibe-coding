import { useMemo } from "react";
import { X, Trash2, Users, ListX } from "lucide-react";
import { useSelectedListStore } from "@/store/useSelectedListStore";
import type { UserProfileSummary } from "@/types";

interface SelectedListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatFollowers(count: number): string {
  if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + "M";
  if (count >= 1_000) return (count / 1_000).toFixed(0) + "K";
  return count.toString();
}

function DrawerItem({ profile, onRemove }: { profile: UserProfileSummary; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
      {profile.picture ? (
        <img
          src={profile.picture}
          alt={profile.username}
          className="w-10 h-10 rounded-xl object-cover flex-shrink-0 bg-slate-200"
          loading="lazy"
        />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
          <Users size={18} className="text-slate-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-slate-800 text-sm truncate">
          @{profile.username}
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <Users size={10} />
          {formatFollowers(profile.followers)} followers
        </div>
      </div>
      <button
        onClick={onRemove}
        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
        aria-label={`Remove @${profile.username} from list`}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

export function SelectedListDrawer({ isOpen, onClose }: SelectedListDrawerProps) {
  // Subscribe to the profiles object directly — Zustand returns the same reference
  // when the state is unchanged, so this is stable and won't loop.
  const profilesRecord = useSelectedListStore((state) => state.profiles);
  const profiles = useMemo(() => Object.values(profilesRecord), [profilesRecord]);
  const removeProfile = useSelectedListStore((state) => state.removeProfile);
  const clearList = useSelectedListStore((state) => state.clearList);

  const handleClearAll = () => {
    if (window.confirm(`Remove all ${profiles.length} influencer(s) from your list?`)) {
      clearList();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Selected influencer list"
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">My List</h2>
            <p className="text-xs text-slate-400">
              {profiles.length === 0
                ? "No influencers added yet"
                : `${profiles.length} influencer${profiles.length !== 1 ? "s" : ""} selected`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Close list"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {profiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <ListX size={28} className="text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-600 mb-1">Your list is empty</h3>
              <p className="text-slate-400 text-sm">
                Browse influencers and click "Add to List" to build your campaign.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {profiles.map((profile) => (
                <DrawerItem
                  key={profile.user_id}
                  profile={profile}
                  onRemove={() => removeProfile(profile.user_id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer: clear button */}
        {profiles.length > 0 && (
          <div className="px-5 py-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={handleClearAll}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-sm transition-colors"
            >
              <Trash2 size={15} />
              Clear All
            </button>
          </div>
        )}
      </div>
    </>
  );
}
