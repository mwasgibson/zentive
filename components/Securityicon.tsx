import {
  Lock,
  ShieldCheck,
  KeyRound,
  ScrollText,
  Clock3,
  ListChecks,
  HelpCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  lock: Lock,
  "shield-check": ShieldCheck,
  "key-round": KeyRound,
  "scroll-text": ScrollText,
  "clock-3": Clock3,
  "list-checks": ListChecks,
};

/**
 * Renders a security-bullet icon from its CMS string key. Falls back to a
 * generic icon for any key an editor might type that isn't in ICON_MAP,
 * rather than crashing the page over an unrecognized value from a form
 * field a non-developer can edit.
 */
export function SecurityIcon({
  iconKey,
  ...props
}: {
  iconKey: string;
  size?: number;
  className?: string;
}) {
  const Icon = ICON_MAP[iconKey] ?? HelpCircle;
  return <Icon aria-hidden {...props} />;
}

export const KNOWN_ICON_KEYS = Object.keys(ICON_MAP);
