import { ContentStatus, ContentType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FileText, Linkedin, Twitter, Mail } from "lucide-react";

const statusConfig: Record<ContentStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  review: { label: "In Review", className: "bg-status-review/15 text-status-review border-status-review/30" },
  approved: { label: "Approved", className: "bg-status-approved/15 text-status-approved border-status-approved/30" },
  scheduled: { label: "Scheduled", className: "bg-status-scheduled/15 text-status-scheduled border-status-scheduled/30" },
  published: { label: "Published", className: "bg-status-published/15 text-status-published border-status-published/30" },
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium border", config.className)}>
      {config.label}
    </Badge>
  );
}

const typeConfig: Record<ContentType, { label: string; icon: typeof FileText; className: string }> = {
  blog: { label: "Blog", icon: FileText, className: "text-primary" },
  linkedin: { label: "LinkedIn", icon: Linkedin, className: "text-status-scheduled" },
  twitter: { label: "Twitter", icon: Twitter, className: "text-foreground" },
  newsletter: { label: "Newsletter", icon: Mail, className: "text-accent" },
};

export function ContentTypeBadge({ type }: { type: ContentType }) {
  const config = typeConfig[type];
  const Icon = config.icon;
  return (
    <div className="flex items-center gap-1.5">
      <Icon className={cn("h-3.5 w-3.5", config.className)} />
      <span className="text-xs text-muted-foreground">{config.label}</span>
    </div>
  );
}
