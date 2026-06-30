import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse } from "@/types";
import { formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import {
  useIsProfileSelected,
  useSelectedListStore,
} from "@/store/useSelectedListStore";
import {
  ArrowLeft,
  Users,
  BarChart2,
  FileText,
  Heart,
  MessageCircle,
  Play,
  Zap,
  ExternalLink,
  CheckCircle,
  PlusCircle,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";

function formatNumber(count: number | undefined): string {
  if (count === undefined) return "N/A";
  if (count >= 1_000_000) return (count / 1_000_000).toFixed(2) + "M";
  if (count >= 1_000) return (count / 1_000).toFixed(1) + "K";
  return String(count);
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4">
      <div className="flex items-center gap-2 text-slate-400 mb-2 text-xs font-medium uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <div className="font-bold text-slate-800 text-xl">{value}</div>
    </div>
  );
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "unknown";
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  const toggleProfile = useSelectedListStore((state) => state.toggleProfile);
  const isSelected = useIsProfileSelected(
    profileData?.data.user_profile.user_id ?? ""
  );

  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    loadProfileByUsername(username).then((data) => {
      if (!cancelled) {
        setProfileData(data);
        setLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <p className="text-slate-500">Invalid profile</p>
        <Link to="/">Back</Link>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <Loader2 size={36} className="text-violet-500 animate-spin mb-4" />
          <p className="text-slate-500">Loading profile…</p>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <h2 className="font-semibold text-slate-700 text-xl mb-2">
            Profile not found
          </h2>
          <p className="text-slate-400 text-sm mb-6 max-w-xs">
            Could not load profile details for @{username}.
          </p>
          <Link
            to="/"
            className="px-5 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
          >
            Back to Search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;

  return (
    <Layout title={user.fullname}>
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Search
      </Link>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile header card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col sm:flex-row items-start gap-5">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.username}
                className="w-24 h-24 rounded-2xl object-cover border border-slate-100"
                loading="lazy"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center">
                <User size={36} className="text-slate-400" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-2xl font-bold text-slate-800">
                @{user.username}
              </h2>
              <VerifiedBadge verified={user.is_verified} />
            </div>
            <p className="text-slate-500 mb-1">{user.fullname}</p>
            <p className="text-xs text-slate-400 capitalize mb-3">
              Platform: {platform}
            </p>

            {user.description && (
              <p className="text-sm text-slate-600 leading-relaxed">
                {user.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:items-end">
            {user.url && (
              <a
                href={user.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 font-medium"
              >
                View on platform
                <ExternalLink size={14} />
              </a>
            )}

            {/* Add to List button */}
            <button
              onClick={() => toggleProfile(user)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isSelected
                  ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                  : "bg-violet-600 text-white hover:bg-violet-700 shadow-sm"
              }`}
            >
              {isSelected ? (
                <>
                  <CheckCircle size={16} />
                  Added to List
                </>
              ) : (
                <>
                  <PlusCircle size={16} />
                  Add to List
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            icon={<Users size={14} />}
            label="Followers"
            value={formatNumber(user.followers)}
          />
          <StatCard
            icon={<BarChart2 size={14} />}
            label="Engagement Rate"
            value={formatEngagementRate(user.engagement_rate)}
          />
          {user.posts_count !== undefined && (
            <StatCard
              icon={<FileText size={14} />}
              label="Posts"
              value={formatNumber(user.posts_count)}
            />
          )}
          {user.avg_likes !== undefined && (
            <StatCard
              icon={<Heart size={14} />}
              label="Avg. Likes"
              value={formatNumber(user.avg_likes)}
            />
          )}
          {user.avg_comments !== undefined && (
            <StatCard
              icon={<MessageCircle size={14} />}
              label="Avg. Comments"
              value={formatNumber(user.avg_comments)}
            />
          )}
          {user.avg_views !== undefined && user.avg_views > 0 && (
            <StatCard
              icon={<Play size={14} />}
              label="Avg. Views"
              value={formatNumber(user.avg_views)}
            />
          )}
          {user.engagements !== undefined && (
            <StatCard
              icon={<Zap size={14} />}
              label="Total Engagements"
              value={formatNumber(user.engagements)}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
