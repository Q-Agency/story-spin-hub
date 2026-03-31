import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, ContentTypeBadge } from "@/components/StatusBadge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mockSchedule } from "@/lib/mock-data";
import { ScheduleItem } from "@/lib/types";
import { ChevronLeft, ChevronRight, ExternalLink, Clock, MapPin } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from "date-fns";

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const navigate = useNavigate();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);
  const padDays = Array.from({ length: startPad }, (_, i) => null);

  const getEventsForDay = (day: Date) =>
    mockSchedule.filter((s) => isSameDay(new Date(s.publishAt), day));

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  const handleEventClick = (item: ScheduleItem) => {
    navigate(`/content/${item.contentId}`);
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5">
        <div>
          <h1 className="text-3xl font-display text-foreground">Calendar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Schedule and track content publishing
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
                  <div
                    key={day.toISOString()}
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-[100px] border-b border-r border-border/40 p-1.5 cursor-pointer transition-colors hover:bg-accent/30 ${
                      isToday ? "bg-primary/5" : ""
                    } ${isSelected ? "ring-2 ring-primary ring-inset bg-primary/5" : ""}`}
                  >
                    <span className={`text-xs font-medium inline-flex h-6 w-6 items-center justify-center rounded-full ${
                      isToday ? "gradient-primary text-primary-foreground" : "text-muted-foreground"
                    }`}>
                      {format(day, "d")}
                    </span>
                    <div className="space-y-1 mt-0.5">
                      {events.map((e) => (
                        <Popover key={e.id}>
                          <PopoverTrigger asChild>
                            <div
                              className="rounded px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary truncate cursor-pointer hover:bg-primary/20 transition-colors"
                              onClick={(ev) => ev.stopPropagation()}
                            >
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
            {mockSchedule
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
