import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { ContentCard } from "@/components/ContentCard";
import { GenerateModal } from "@/components/GenerateModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockContent } from "@/lib/mock-data";
import { ContentStatus, ContentType } from "@/lib/types";
import { Search, SlidersHorizontal } from "lucide-react";

const ContentList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ContentType | "all">("all");

  const filtered = mockContent.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (typeFilter !== "all" && item.contentType !== typeFilter) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-display text-foreground">Content</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {mockContent.length} items · {mockContent.filter((c) => c.status === "published").length} published
            </p>
          </div>
          <GenerateModal />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ContentStatus | "all")}>
            <SelectTrigger className="w-[150px] h-10">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v as ContentType | "all")}>
            <TabsList className="h-10">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="blog" className="text-xs">Blog</TabsTrigger>
              <TabsTrigger value="linkedin" className="text-xs">LinkedIn</TabsTrigger>
              <TabsTrigger value="twitter" className="text-xs">Twitter</TabsTrigger>
              <TabsTrigger value="newsletter" className="text-xs">Newsletter</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm">No content matches your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ContentList;
