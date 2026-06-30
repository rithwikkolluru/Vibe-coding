import { useMemo } from "react";
import { X, Trash2, Users, ListX } from "lucide-react";
import { useSelectedListStore } from "@/store/useSelectedListStore";
import type { UserProfileSummary } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface SelectedListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatFollowers(count: number): string {
  if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + "M";
  if (count >= 1_000) return (count / 1_000).toFixed(0) + "K";
  return count.toString();
}

function DrawerItem({
  profile,
  onRemove,
}: {
  profile: UserProfileSummary;
  onRemove: () => void;
}) {
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

export function SelectedListDrawer({
  isOpen,
  onClose,
}: SelectedListDrawerProps) {
  const profilesRecord = useSelectedListStore((state) => state.profiles);
  const profiles = useMemo(
    () => Object.values(profilesRecord),
    [profilesRecord]
  );
  const removeProfile = useSelectedListStore((state) => state.removeProfile);
  const clearList = useSelectedListStore((state) => state.clearList);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-screen max-w-md pointer-events-auto bg-white shadow-xl flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-violet-50 rounded-lg text-violet-600">
                    <ListX size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Selected Influencers
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                  aria-label="Close panel"
                >
                  <X size={20} />
                </button>
              </div>

              {/* List Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {profiles.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                    <Users size={48} className="mb-4 text-slate-200" />
                    <p className="text-sm">Your selected list is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence initial={false}>
                      {profiles.map((profile) => (
                        <motion.div
                          key={profile.user_id}
                          initial={{ opacity: 0, height: 0, x: 20 }}
                          animate={{ opacity: 1, height: "auto", x: 0 }}
                          exit={{ opacity: 0, height: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <DrawerItem
                            profile={profile}
                            onRemove={() => removeProfile(profile.user_id)}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              {profiles.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50">
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to clear your entire list?"
                        )
                      ) {
                        clearList();
                      }
                    }}
                    className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    Clear List
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
