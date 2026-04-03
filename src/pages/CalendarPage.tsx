import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, ContentTypeBadge } from "@/components/StatusBadge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuLabel, ContextMenuSeparator } from "@/components/ui/context-menu";
import { mockSchedule, mockContent } from "@/lib/mock-data";
import { ScheduleItem } from "@/lib/types";
import { ChevronLeft, ChevronRight, ExternalLink, Clock, MapPin, GripVertical, Plus, FileText } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from "date-fns";
import { toast } from "sonner";

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([...mockSchedule]);
  const [dragOverDay, setDragOverDay] = useState<string | null>(null);
  const dragItemRef = useRef<string | null>(null);
  const navigate = useNavigate();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);
  const padDays = Array.from({ length: startPad }, (_, i) => null);

  const getEventsForDay = (day: Date) =>
    schedule.filter((s) => isSameDay(new Date(s.publishAt), day));

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  const handleEventClick = (item: ScheduleItem) => {
    navigate(`/content/${item.contentId}`);
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    dragItemRef.current = itemId;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", itemId);
  };

  const handleDragOver = (e: React.DragEvent, day: Date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverDay(day.toISOString());
  };

  const handleDragLeave = () => {
    setDragOverDay(null);
  };

  const handleDrop = (e: React.DragEvent, targetDay: Date) => {
    e.preventDefault();
    setDragOverDay(null);
    const itemId = dragItemRef.current;
    if (!itemId) return;

    setSchedule((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const oldDate = new Date(item.publishAt);
        const newDate = new Date(targetDay);
        newDate.setHours(oldDate.getHours(), oldDate.getMinutes(), oldDate.getSeconds());
        return { ...item, publishAt: newDate.toISOString() };
      })
    );

    const item = schedule.find((s) => s.id === itemId);
    if (item) {
      toast.success(`"${item.contentTitle}" moved to ${format(targetDay, "MMM d")}`);
    }
    dragItemRef.current = null;
  };

  // Content items not yet scheduled (available for quick-schedule)
  const unscheduledContent = mockContent.filter(
    (c) => c.status !== "published" && !schedule.some((s) => s.contentId === c.id)
  );

  const handleQuickSchedule = (contentItem: typeof mockContent[0], targetDay: Date) => {
    const newEntry: ScheduleItem = {
      id: `qs-${Date.now()}`,
      contentId: contentItem.id,
      contentTitle: contentItem.title,
      contentType: contentItem.contentType,
      publishAt: new Date(targetDay.getFullYear(), targetDay.getMonth(), targetDay.getDate(), 9, 0, 0).toISOString(),
      platform: contentItem.contentType === "linkedin" ? "LinkedIn" : contentItem.contentType === "twitter" ? "Twitter" : contentItem.contentType === "newsletter" ? "Newsletter" : "Blog",
      status: "scheduled",
    };
    setSchedule((prev) => [...prev, newEntry]);
    toast.success(`"${contentItem.title}" scheduled for ${format(targetDay, "MMM d")} at 09:00`);
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5">
        <div>
          <h1 className="text-3xl font-display text-foreground">Calendar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Schedule and track content publishing · <span className="text-primary/70">Right-click any day to quick-schedule</span>
          </p>
        </div>

        <div className="flex gap-6">
          {/* Calendar grid */}
          <Card className="border-border/60 shadow-card overflow-hidden flex-1">
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-display">{format(currentMonth, "MMMM yyyy")}</h2>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 border-b border-border/60">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="p-2 text-center text-xs text-muted-foreground font-medium">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {padDays.map((_, i) => (
                <div key={`pad-${i}`} className="min-h-[100px] border-b border-r border-border/40 bg-surface-sunken" />
              ))}
              {days.map((day) => {
                const events = getEventsForDay(day);
                const isToday = isSameDay(day, new Date(2026, 2, 31));
                const isSelected = selectedDay && isSameDay(day, selectedDay);
                return (
                  <ContextMenu key={day.toISOString()}>
                    <ContextMenuTrigger asChild>
                      <div
                        onClick={() => setSelectedDay(day)}
                        onDragOver={(e) => handleDragOver(e, day)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, day)}
                        className={`group/day min-h-[100px] border-b border-r border-border/40 p-1.5 cursor-pointer transition-colors hover:bg-accent/30 ${
                          isToday ? "bg-primary/5" : ""
                        } ${isSelected ? "ring-2 ring-primary ring-inset bg-primary/5" : ""} ${
                          dragOverDay === day.toISOString() ? "bg-primary/15 ring-2 ring-primary/50 ring-inset" : ""
                        }`}
                      >
                        <span className={`text-xs font-medium inline-flex h-6 w-6 items-center justify-center rounded-full ${
                          isToday ? "gradient-primary text-primary-foreground" : "text-muted-foreground"
                        }`}>
                          {format(day, "d")}
                        </span>
                        <div className="space-y-1 mt-0.5">
                          {events.length === 0 && (
                            <div className="flex items-center justify-center h-8 opacity-0 group-hover/day:opacity-100 transition-opacity">
                              <Plus className="h-3.5 w-3.5 text-primary/50" />
                            </div>
                          )}
                          {events.map((e) => (
                            <Popover key={e.id}>
                              <PopoverTrigger asChild>
                                <div
                                  draggable
                                  onDragStart={(ev) => { ev.stopPropagation(); handleDragStart(ev, e.id); }}
                                  className="rounded px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary truncate cursor-grab active:cursor-grabbing hover:bg-primary/20 transition-colors flex items-center gap-0.5"
                                  onClick={(ev) => ev.stopPropagation()}
                                >
                                  <GripVertical className="h-2.5 w-2.5 shrink-0 opacity-40" />
                                  {e.contentTitle}
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="w-72 p-0" align="start" side="right">
                                <div className="p-3 border-b border-border/40">
                                  <div className="flex items-center gap-2 mb-1">
                                    <ContentTypeBadge type={e.contentType} />
                                    <StatusBadge status={e.status} />
                                  </div>
                                  <h4 className="text-sm font-medium text-foreground mt-2">{e.contentTitle}</h4>
                                </div>
                                <div className="p-3 space-y-2">
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(e.publishAt), "MMM d, yyyy · HH:mm")}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    {e.platform}
                                  </div>
                                  <Button
                                    size="sm"
                                    className="w-full mt-2 gap-1.5 text-xs"
                                    onClick={() => handleEventClick(e)}
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    Open in Editor
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          ))}
                        </div>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-64">
                      <ContextMenuLabel className="flex items-center gap-2">
                        <Plus className="h-3 w-3" />
                        Quick Schedule to {format(day, "MMM d")}
                      </ContextMenuLabel>
                      <ContextMenuSeparator />
                      {unscheduledContent.length === 0 ? (
                        <ContextMenuItem disabled className="text-xs text-muted-foreground">
                          No unscheduled content available
                        </ContextMenuItem>
                      ) : (
                        unscheduledContent.map((c) => (
                          <ContextMenuItem
                            key={c.id}
                            onClick={() => handleQuickSchedule(c, day)}
                            className="flex items-center gap-2"
                          >
                            <FileText className="h-3 w-3 shrink-0 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <span className="text-xs truncate block">{c.title}</span>
                              <span className="text-[10px] text-muted-foreground capitalize">{c.contentType}</span>
                            </div>
                          </ContextMenuItem>
                        ))
                      )}
                      <ContextMenuSeparator />
                      <ContextMenuItem onClick={() => navigate("/content/new")} className="flex items-center gap-2">
                        <Plus className="h-3 w-3" />
                        <span className="text-xs">Create new content</span>
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                );
              })}
            </div>
          </Card>

          {/* Day detail sidebar */}
          <div className="hidden lg:block w-72 shrink-0 space-y-4">
            <Card className="border-border/60 shadow-card p-4">
              <h3 className="text-sm font-display text-foreground mb-3">
                {selectedDay ? format(selectedDay, "EEEE, MMMM d") : "Select a day"}
              </h3>
              {selectedDay && selectedDayEvents.length === 0 && (
                <p className="text-xs text-muted-foreground">No events scheduled for this day.</p>
              )}
              <div className="space-y-2">
                {selectedDayEvents.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg border border-border/40 hover:border-primary/40 hover:bg-accent/30 transition-all cursor-pointer"
                    onClick={() => handleEventClick(item)}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <ContentTypeBadge type={item.contentType} />
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-xs font-medium text-foreground line-clamp-2">{item.contentTitle}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{format(new Date(item.publishAt), "HH:mm")}</span>
                      <span>{item.platform}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Upcoming list */}
        <div className="space-y-3">
          <h2 className="text-lg font-display text-foreground">Upcoming</h2>
          <div className="space-y-2">
            {schedule
              .filter((s) => s.status !== "published")
              .sort((a, b) => new Date(a.publishAt).getTime() - new Date(b.publishAt).getTime())
              .map((item) => (
                <Card
                  key={item.id}
                  className="p-3 border-border/60 shadow-card flex items-center justify-between cursor-pointer hover:border-primary/40 hover:bg-accent/30 transition-all"
                  onClick={() => handleEventClick(item)}
                >
                  <div className="flex items-center gap-3">
                    <ContentTypeBadge type={item.contentType} />
                    <span className="text-sm font-medium text-foreground">{item.contentTitle}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(item.publishAt), "MMM d, HH:mm")} · {item.platform}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CalendarPage;
