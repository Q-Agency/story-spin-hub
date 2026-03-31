import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mockScrapedItems } from "@/lib/mock-data";
import { ScrapedItem } from "@/lib/types";
import { GenerateModal } from "@/components/GenerateModal";
import {
  Globe,
  Search,
  TrendingUp,
  Calendar,
  FlaskConical,
  Newspaper,
  ExternalLink,
  Sparkles,
  Zap,
  CalendarDays,
  CalendarRange,
  List,
  LayoutGrid,
  CalendarPlus,
  X,
} from "lucide-react";
import { formatDistanceToNow, format, isWithinInterval, startOfDay, endOfDay, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const categoryIcons: Record<ScrapedItem["category"], React.ElementType> = {
  news: Newspaper,
  event: Calendar,
  trend: TrendingUp,
  research: FlaskConical,
};

const categoryColors: Record<ScrapedItem["category"], string> = {
  news: "bg-blue-500/10 text-blue-600 border-blue-200",
  event: "bg-amber-500/10 text-amber-600 border-amber-200",
  trend: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  research: "bg-purple-500/10 text-purple-600 border-purple-200",
};

const DiscoverPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ScrapedItem["category"] | "all">("all");

  const filtered = mockScrapedItems.filter((item) => {
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.summary.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-display text-foreground">Discover</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Curated news, events & trends from the web — fuel for your next piece
            </p>
          </div>
          <Button variant="outline" className="gap-2 text-sm">
            <Globe className="h-3.5 w-3.5" />
            Refresh Sources
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news, events, trends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <Tabs value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as ScrapedItem["category"] | "all")}>
            <TabsList className="h-10">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="news" className="text-xs gap-1"><Newspaper className="h-3 w-3" />News</TabsTrigger>
              <TabsTrigger value="event" className="text-xs gap-1"><Calendar className="h-3 w-3" />Events</TabsTrigger>
              <TabsTrigger value="trend" className="text-xs gap-1"><TrendingUp className="h-3 w-3" />Trends</TabsTrigger>
              <TabsTrigger value="research" className="text-xs gap-1"><FlaskConical className="h-3 w-3" />Research</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Featured highlight */}
        {filtered.length > 0 && categoryFilter === "all" && !searchQuery && (
          <Card className="overflow-hidden border-border/60 shadow-card">
            <div className="flex flex-col md:flex-row">
              {filtered[0].imageUrl && (
                <img src={filtered[0].imageUrl} alt="" className="h-48 md:h-auto md:w-72 object-cover" />
              )}
              <div className="p-5 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={categoryColors[filtered[0].category]}>
                    {filtered[0].category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Zap className="h-3 w-3 text-primary" />
                    {filtered[0].relevanceScore}% relevant
                  </span>
                </div>
                <h2 className="text-xl font-display text-foreground mb-2">{filtered[0].title}</h2>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{filtered[0].summary}</p>
                <div className="flex items-center gap-3">
                  <GenerateModal
                    trigger={
                      <Button size="sm" className="gradient-primary text-primary-foreground gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        Generate from this
                      </Button>
                    }
                    prefillTopic={filtered[0].title}
                  />
                  <a href={filtered[0].sourceUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
                      {filtered[0].sourceName} <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm">No items match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(categoryFilter === "all" && !searchQuery ? filtered.slice(1) : filtered).map((item, i) => {
              const CatIcon = categoryIcons[item.category];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Card className="p-4 border-border/60 shadow-card hover:shadow-card-hover transition-all duration-200 group h-full flex flex-col">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt="" className="h-32 w-full object-cover rounded-md mb-3" />
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={`text-[10px] ${categoryColors[item.category]}`}>
                        <CatIcon className="h-2.5 w-2.5 mr-1" />
                        {item.category}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {formatDistanceToNow(new Date(item.scrapedAt), { addSuffix: true })}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
                      {item.summary}
                    </p>
                    <div className="flex items-center gap-1 flex-wrap mb-3">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                      <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1">
                        {item.sourceName} <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                      <GenerateModal
                        trigger={
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary hover:text-primary">
                            <Sparkles className="h-3 w-3" />
                            Use
                          </Button>
                        }
                        prefillTopic={item.title}
                      />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default DiscoverPage;
