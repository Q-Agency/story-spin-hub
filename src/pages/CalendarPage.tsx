import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, ContentTypeBadge } from "@/components/StatusBadge";
import { mockSchedule } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, getDay } from "date-fns";

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1)); // March 2026

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start of month
  const startPad = getDay(monthStart);
  const padDays = Array.from({ length: startPad }, (_, i) => null);

  const getEventsForDay = (day: Date) =>
    mockSchedule.filter((s) => isSameDay(new Date(s.publishAt), day));

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5">
        <div>
          <h1 className="text-3xl font-display text-foreground">Calendar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Schedule and track content publishing
          </p>
        </div>

        <Card className="border-border/60 shadow-card overflow-hidden">
          {/* Month nav */}
          <div className="flex items-center justify-between p-4 border-b border-border/60">
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-display">{format(currentMonth, "MMMM yyyy")}</h2>
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border/60">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="p-2 text-center text-xs text-muted-foreground font-medium">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {padDays.map((_, i) => (
              <div key={`pad-${i}`} className="min-h-[100px] border-b border-r border-border/40 bg-surface-sunken" />
            ))}
            {days.map((day) => {
              const events = getEventsForDay(day);
              const isToday = isSameDay(day, new Date(2026, 2, 31));
              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[100px] border-b border-r border-border/40 p-1.5 ${
                    isToday ? "bg-primary/5" : ""
                  }`}
                >
                  <span className={`text-xs font-medium inline-flex h-6 w-6 items-center justify-center rounded-full ${
                    isToday ? "gradient-primary text-primary-foreground" : "text-muted-foreground"
                  }`}>
                    {format(day, "d")}
                  </span>
                  <div className="space-y-1 mt-0.5">
                    {events.map((e) => (
                      <div
                        key={e.id}
                        className="rounded px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary truncate cursor-pointer hover:bg-primary/20 transition-colors"
                        title={e.contentTitle}
                      >
                        {e.contentTitle}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Upcoming list */}
        <div className="space-y-3">
          <h2 className="text-lg font-display text-foreground">Upcoming</h2>
          <div className="space-y-2">
            {mockSchedule
              .filter((s) => s.status !== "published")
              .sort((a, b) => new Date(a.publishAt).getTime() - new Date(b.publishAt).getTime())
              .map((item) => (
                <Card key={item.id} className="p-3 border-border/60 shadow-card flex items-center justify-between">
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
