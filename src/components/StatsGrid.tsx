import { DashboardStats } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { FileText, Send, CalendarDays, PenTool, TrendingUp, Sparkles } from "lucide-react";

interface StatsGridProps {
  stats: DashboardStats;
}

const statCards = [
  { key: "totalContent", label: "Total Content", icon: FileText, format: (v: number) => v.toString() },
  { key: "published", label: "Published", icon: Send, format: (v: number) => v.toString() },
  { key: "scheduled", label: "Scheduled", icon: CalendarDays, format: (v: number) => v.toString() },
  { key: "drafts", label: "Drafts", icon: PenTool, format: (v: number) => v.toString() },
  { key: "generatedThisWeek", label: "This Week", icon: Sparkles, format: (v: number) => v.toString() },
  { key: "publishRate", label: "Publish Rate", icon: TrendingUp, format: (v: number) => `${v}%` },
] as const;

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {statCards.map(({ key, label, icon: Icon, format }) => (
        <Card key={key} className="p-3.5 shadow-card border-border/60">
          <div className="flex items-center gap-2 mb-1.5">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</span>
          </div>
          <p className="text-xl font-display text-foreground">
            {format(stats[key])}
          </p>
        </Card>
      ))}
    </div>
  );
}
