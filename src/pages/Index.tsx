import { AppLayout } from "@/components/AppLayout";
import { GenerateModal } from "@/components/GenerateModal";
import { StatsGrid } from "@/components/StatsGrid";
import { ContentCard } from "@/components/ContentCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { TrendingWidget } from "@/components/TrendingWidget";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockContent, mockStats } from "@/lib/mock-data";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const recentContent = mockContent.slice(0, 4);

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-display text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your content creation command center
            </p>
          </div>
          <GenerateModal />
        </div>

        {/* Stats */}
        <StatsGrid stats={mockStats} />

        {/* Quick Generate */}
        <Card className="p-5 border-border/60 shadow-card gradient-primary overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
              <h2 className="text-sm font-semibold text-primary-foreground">Quick Generate</h2>
            </div>
            <p className="text-primary-foreground/80 text-sm mb-3 max-w-md">
              Enter a topic and let the AI agent research, write, and create visuals — all in real-time.
            </p>
            <GenerateModal
              trigger={
                <Button variant="secondary" className="gap-2 font-medium">
                  <Sparkles className="h-3.5 w-3.5" />
                  New Generation
                </Button>
              }
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Content */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display text-foreground">Recent Content</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground gap-1 text-xs"
                onClick={() => navigate("/content")}
              >
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentContent.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Sidebar column */}
          <div className="space-y-6">
            {/* Trending from Web */}
            <TrendingWidget />

            {/* Activity Feed */}
            <div className="space-y-3">
              <h2 className="text-lg font-display text-foreground">Recent Activity</h2>
              <Card className="p-3 shadow-card border-border/60">
                <ActivityFeed />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
