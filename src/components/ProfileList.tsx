import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { Search } from "lucide-react";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  isFiltered: boolean;
}

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function ProfileList({
  profiles,
  platform,
  isFiltered,
}: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <Search size={28} className="text-slate-400" />
        </div>
        <h3 className="font-semibold text-slate-700 text-lg mb-1">
          {isFiltered ? "No results found" : "No influencers available"}
        </h3>
        <p className="text-slate-400 text-sm max-w-xs">
          {isFiltered
            ? "Try a different name or username to find influencers."
            : "There are no influencers on this platform yet."}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {profiles.map((profile) => (
        <motion.div key={profile.user_id} variants={itemVariants}>
          <ProfileCard profile={profile} platform={platform} />
        </motion.div>
      ))}
    </motion.div>
  );
}
