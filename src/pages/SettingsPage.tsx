import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-[800px] mx-auto space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-display text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Platform configuration</p>
          </div>
          <Button onClick={() => toast.success("Settings saved")} className="gradient-primary text-primary-foreground gap-1.5">
            <Save className="h-3.5 w-3.5" /> Save
          </Button>
        </div>

        <Card className="p-5 border-border/60 shadow-card space-y-5">
          <h3 className="text-sm font-medium text-foreground">AI Models</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Primary Model (Writing)</Label>
              <Select defaultValue="sonnet">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sonnet">Claude 3.5 Sonnet</SelectItem>
                  <SelectItem value="opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="gpt4">GPT-4o</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Research Model (Fast)</Label>
              <Select defaultValue="haiku">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="haiku">Claude 3.5 Haiku</SelectItem>
                  <SelectItem value="flash">Gemini 2.0 Flash</SelectItem>
                  <SelectItem value="mini">GPT-4o Mini</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <h3 className="text-sm font-medium text-foreground">Image Generation</h3>
          <div className="space-y-2">
            <Label className="text-sm">Image Provider</Label>
            <Select defaultValue="dalle">
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dalle">DALL-E 3</SelectItem>
                <SelectItem value="flux">Flux Pro</SelectItem>
                <SelectItem value="imagen">Imagen 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <h3 className="text-sm font-medium text-foreground">Defaults</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Auto-generate hero images</p>
                <p className="text-xs text-muted-foreground">Generate a cover image with every blog post</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Include research notes</p>
                <p className="text-xs text-muted-foreground">Save research sub-agent findings with content</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Editor review before publishing</p>
                <p className="text-xs text-muted-foreground">Require editor sub-agent review for all content</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <Separator />

          <h3 className="text-sm font-medium text-foreground">API Keys</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-sm">Anthropic API Key</Label>
              <Input type="password" defaultValue="sk-ant-••••••••" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Tavily API Key (Research)</Label>
              <Input type="password" defaultValue="tvly-••••••••" />
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
