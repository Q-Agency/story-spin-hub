import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Globe, Linkedin, Twitter, Mail, Webhook, CheckCircle2, Plus } from "lucide-react";

const integrations = [
  {
    name: "WordPress",
    description: "Publish blog posts directly to your WordPress site",
    icon: Globe,
    connected: true,
    status: "Active",
  },
  {
    name: "LinkedIn",
    description: "Share posts to your company LinkedIn page",
    icon: Linkedin,
    connected: true,
    status: "Active",
  },
  {
    name: "Twitter / X",
    description: "Post threads and individual tweets",
    icon: Twitter,
    connected: false,
    status: "Not connected",
  },
  {
    name: "Newsletter (Mailchimp)",
    description: "Send newsletters via Mailchimp campaigns",
    icon: Mail,
    connected: false,
    status: "Not connected",
  },
  {
    name: "n8n Webhooks",
    description: "Trigger custom automation workflows via webhooks",
    icon: Webhook,
    connected: true,
    status: "3 workflows active",
  },
];

const IntegrationsPage = () => {
  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-[1000px] mx-auto space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-display text-foreground">Integrations</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Connect publishing platforms and automation tools
            </p>
          </div>
          <Button variant="outline" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Custom
          </Button>
        </div>

        <div className="space-y-3">
          {integrations.map((int) => (
            <Card key={int.name} className="p-4 border-border/60 shadow-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <int.icon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{int.name}</span>
                    {int.connected && (
                      <Badge variant="outline" className="text-[10px] bg-status-approved/10 text-status-approved border-status-approved/30">
                        <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" /> Connected
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{int.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{int.status}</span>
                <Switch checked={int.connected} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default IntegrationsPage;
