import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge, ContentTypeBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockContent } from "@/lib/mock-data";
import { ContentStatus } from "@/lib/types";
import {
  ArrowLeft,
  Save,
  Send,
  CalendarDays,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Clock,
  CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { cn } from "@/lib/utils";

const statusFlow: ContentStatus[] = ["draft", "review", "approved", "scheduled", "published"];

const ContentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = mockContent.find((c) => c.id === id);

  const [body, setBody] = useState(item?.body || "");
  const [activeTab, setActiveTab] = useState("editor");
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(
    item?.scheduledFor ? new Date(item.scheduledFor) : undefined
  );
  const [scheduleTime, setScheduleTime] = useState(
    item?.scheduledFor ? format(new Date(item.scheduledFor), "HH:mm") : "09:00"
  );
  const [schedulePlatform, setSchedulePlatform] = useState(
    item?.contentType === "linkedin" ? "LinkedIn" : item?.contentType === "twitter" ? "Twitter" : "Blog"
  );

  if (!item) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-muted-foreground">
          Content not found.
          <Button variant="ghost" onClick={() => navigate("/content")} className="ml-2">
            Back to list
          </Button>
        </div>
      </AppLayout>
    );
  }

  const currentIdx = statusFlow.indexOf(item.status);
  const nextStatus = currentIdx < statusFlow.length - 1 ? statusFlow[currentIdx + 1] : null;

  const handleSave = () => toast.success("Draft saved");
  const handleAdvance = () => toast.success(`Moved to ${nextStatus}`);
  const handleRegenerate = () => toast.info("Regeneration started...");
  const handleSchedule = () => {
    if (!scheduleDate) {
      toast.error("Please select a date first");
      return;
    }
    const [h, m] = scheduleTime.split(":").map(Number);
    const dt = new Date(scheduleDate);
    dt.setHours(h, m, 0);
    toast.success(`Scheduled for ${format(dt, "MMM d, yyyy")} at ${scheduleTime} on ${schedulePlatform}`);
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-5">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/content")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-display text-foreground">{item.title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <ContentTypeBadge type={item.contentType} />
                <StatusBadge status={item.status} />
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Updated {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRegenerate} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Regenerate
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5">
              <Save className="h-3.5 w-3.5" /> Save
            </Button>
            {nextStatus && (
              <Button size="sm" onClick={handleAdvance} className="gradient-primary text-primary-foreground gap-1.5">
                <Send className="h-3.5 w-3.5" />
                Move to {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
              </Button>
            )}
          </div>
        </div>

        {/* Status pipeline */}
        <div className="flex items-center gap-1">
          {statusFlow.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                i <= currentIdx
                  ? "gradient-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </div>
              {i < statusFlow.length - 1 && (
                <div className={`w-6 h-px ${i < currentIdx ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main editor */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="editor">
                <Card className="p-0 border-border/60 shadow-card">
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="min-h-[500px] border-0 resize-none font-mono text-sm leading-relaxed p-5 focus-visible:ring-0"
                    placeholder="Start writing..."
                  />
                </Card>
              </TabsContent>
              <TabsContent value="preview">
                <Card className="p-6 border-border/60 shadow-card min-h-[500px] prose prose-sm max-w-none">
                  {body.split("\n").map((line, i) => {
                    if (line.startsWith("# ")) return <h1 key={i} className="text-2xl font-display mb-3">{line.slice(2)}</h1>;
                    if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-display mt-6 mb-2">{line.slice(3)}</h2>;
                    if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-display mt-4 mb-1.5">{line.slice(4)}</h3>;
                    if (line.trim() === "") return <br key={i} />;
                    return <p key={i} className="text-sm text-foreground/80 mb-2">{line}</p>;
                  })}
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            {/* Meta */}
            <Card className="p-4 border-border/60 shadow-card space-y-3">
              <h3 className="text-sm font-medium text-foreground">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Words</span>
                  <span className="text-foreground">{item.wordCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">{format(new Date(item.createdAt), "MMM d, yyyy")}</span>
                </div>
                {item.scheduledFor && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled</span>
                    <span className="text-foreground flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {format(new Date(item.scheduledFor), "MMM d, HH:mm")}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                ))}
              </div>
            </Card>

            {/* Schedule */}
            <Card className="p-4 border-border/60 shadow-card space-y-3">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" /> Schedule Publishing
              </h3>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "w-full justify-start text-left text-xs font-normal",
                        !scheduleDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={scheduleDate}
                      onSelect={setScheduleDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Time</label>
                <Select value={scheduleTime} onValueChange={setScheduleTime}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, h) =>
                      ["00", "30"].map((m) => {
                        const val = `${String(h).padStart(2, "0")}:${m}`;
                        return <SelectItem key={val} value={val} className="text-xs">{val}</SelectItem>;
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Platform</label>
                <Select value={schedulePlatform} onValueChange={setSchedulePlatform}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Blog" className="text-xs">Blog</SelectItem>
                    <SelectItem value="LinkedIn" className="text-xs">LinkedIn</SelectItem>
                    <SelectItem value="Twitter" className="text-xs">Twitter / X</SelectItem>
                    <SelectItem value="Newsletter" className="text-xs">Newsletter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                size="sm"
                className="w-full gap-1.5 text-xs gradient-primary text-primary-foreground"
                onClick={handleSchedule}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                {scheduleDate ? "Update Schedule" : "Schedule Content"}
              </Button>
            </Card>
            {item.imageUrl && (
              <Card className="p-4 border-border/60 shadow-card space-y-2">
                <h3 className="text-sm font-medium text-foreground">Hero Image</h3>
                <img src={item.imageUrl} alt="" className="w-full rounded-md object-cover aspect-video" />
                <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                  <RefreshCw className="h-3 w-3" /> Regenerate Image
                </Button>
              </Card>
            )}

            {/* Research Notes */}
            {item.researchNotes && item.researchNotes.length > 0 && (
              <Card className="p-4 border-border/60 shadow-card space-y-2">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> Research Notes
                </h3>
                {item.researchNotes.map((note) => (
                  <div key={note.id} className="space-y-1.5">
                    <p className="text-xs text-foreground/80">{note.findings}</p>
                    <div className="flex flex-wrap gap-1">
                      {note.sources.map((s) => (
                        <span key={s} className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <ExternalLink className="h-2.5 w-2.5" /> {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ContentEditor;
