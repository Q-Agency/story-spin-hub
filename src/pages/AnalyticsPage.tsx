import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { mockContent, mockStats } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const weeklyData = [
  { day: "Mon", blog: 2, linkedin: 1, twitter: 3 },
  { day: "Tue", blog: 1, linkedin: 2, twitter: 1 },
  { day: "Wed", blog: 3, linkedin: 1, twitter: 2 },
  { day: "Thu", blog: 1, linkedin: 3, twitter: 1 },
  { day: "Fri", blog: 2, linkedin: 2, twitter: 4 },
  { day: "Sat", blog: 0, linkedin: 0, twitter: 1 },
  { day: "Sun", blog: 1, linkedin: 0, twitter: 0 },
];

const statusData = [
  { name: "Draft", value: mockStats.drafts, color: "hsl(220, 14%, 70%)" },
  { name: "Scheduled", value: mockStats.scheduled, color: "hsl(220, 80%, 55%)" },
  { name: "Published", value: mockStats.published, color: "hsl(160, 50%, 40%)" },
];

const trendData = [
  { week: "W1", generated: 8, published: 5 },
  { week: "W2", generated: 11, published: 7 },
  { week: "W3", generated: 9, published: 8 },
  { week: "W4", generated: 12, published: 9 },
];

const AnalyticsPage = () => {
  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-display text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Content performance and generation insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-5 border-border/60 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-4">Weekly Generation by Type</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip />
                <Bar dataKey="blog" fill="hsl(24, 100%, 50%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="linkedin" fill="hsl(220, 80%, 55%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="twitter" fill="hsl(160, 50%, 40%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5 border-border/60 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-4">Content Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name} ({s.value})
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 border-border/60 shadow-card lg:col-span-2">
            <h3 className="text-sm font-medium text-foreground mb-4">Monthly Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip />
                <Line type="monotone" dataKey="generated" stroke="hsl(24, 100%, 50%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="published" stroke="hsl(160, 50%, 40%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;
