import { mockStreamSteps } from "@/lib/mock-data";
import { Search, PenTool, Image, CheckCircle2, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const stepIcons: Record<string, typeof Brain> = {
  planning: Brain,
  researching: Search,
  writing: PenTool,
  generating_image: Image,
  reviewing: CheckCircle2,
  completed: CheckCircle2,
};

export function ActivityFeed() {
  const recentSteps = mockStreamSteps.slice(0, 6);

  return (
    <div className="space-y-0.5">
      {recentSteps.map((step, i) => {
        const Icon = stepIcons[step.type] || Brain;
        return (
          <div
            key={i}
            className={cn(
              "flex items-start gap-2.5 py-2 px-2 rounded-md text-sm",
              i === 0 && "bg-primary/5"
            )}
          >
            <Icon className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">{step.message}</span>
          </div>
        );
      })}
    </div>
  );
}
