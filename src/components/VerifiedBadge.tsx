import { CheckCircle } from "lucide-react";

interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <CheckCircle
      size={14}
      className="text-blue-500 flex-shrink-0"
      aria-label="Verified"
    />
  );
}
