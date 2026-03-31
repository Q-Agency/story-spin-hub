import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockScrapedItems } from "@/lib/mock-data";
import { GenerateModal } from "@/components/GenerateModal";
import { TrendingUp, Sparkles, ArrowRight, ExternalLink, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export function TrendingWidget() {
  const navigate = useNavigate();
  const topItems = mockScrapedItems.slice(0, 4);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Trending Now
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground gap-1 text-xs"
          onClick={() => navigate("/discover")}
        >
          Discover more <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
      <Card className="p-0 shadow-card border-border/60 divide-y divide-border/40">
        {topItems.map((item) => (
          <div key={item.id} className="p-3 hover:bg-muted/30 transition-colors group">
            <div className="flex items-start gap-3">
              {item.imageUrl && (
                <img src={item.imageUrl} alt="" className="h-12 w-16 rounded object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                    {item.category}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <Zap className="h-2.5 w-2.5 text-primary" />
                    {item.relevanceScore}%
                  </span>
                </div>
                <h4 className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{item.summary}</p>
              </div>
              <GenerateModal
                trigger={
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0 text-muted-foreground hover:text-primary">
                    <Sparkles className="h-3 w-3" />
                  </Button>
                }
                prefillTopic={item.title}
              />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
