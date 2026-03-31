import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockBrandSettings } from "@/lib/mock-data";
import { BrandSettings } from "@/lib/types";
import { Save, Sparkles, TestTube } from "lucide-react";
import { toast } from "sonner";

const BrandSettingsPage = () => {
  const [settings, setSettings] = useState<BrandSettings>(mockBrandSettings);

  const update = (key: keyof BrandSettings, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => toast.success("Brand settings saved");
  const handleTest = () => toast.info("Generating test paragraph with current settings...");

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-[1000px] mx-auto space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-display text-foreground">Brand Settings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Configure your brand voice to guide AI-generated content
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleTest} className="gap-1.5">
              <TestTube className="h-3.5 w-3.5" /> Test Voice
            </Button>
            <Button onClick={handleSave} className="gradient-primary text-primary-foreground gap-1.5">
              <Save className="h-3.5 w-3.5" /> Save Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="voice">
          <TabsList>
            <TabsTrigger value="voice">Brand Voice</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="space-y-4 mt-4">
            <Card className="p-5 border-border/60 shadow-card space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Company Name</Label>
                  <Input value={settings.companyName} onChange={(e) => update("companyName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Industry</Label>
                  <Input value={settings.industry} onChange={(e) => update("industry", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Tone of Voice</Label>
                <Textarea
                  value={settings.tone}
                  onChange={(e) => update("tone", e.target.value)}
                  rows={3}
                  placeholder="Describe the desired tone..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Target Audience</Label>
                <Textarea
                  value={settings.audience}
                  onChange={(e) => update("audience", e.target.value)}
                  rows={3}
                  placeholder="Who is the content for?"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Style Guidelines</Label>
                <Textarea
                  value={settings.styleGuidelines}
                  onChange={(e) => update("styleGuidelines", e.target.value)}
                  rows={4}
                  placeholder="Writing rules, formatting preferences..."
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4 mt-4">
            {(["blogTemplate", "linkedinTemplate", "twitterTemplate"] as const).map((key) => {
              const labels = {
                blogTemplate: "Blog Post Template",
                linkedinTemplate: "LinkedIn Post Template",
                twitterTemplate: "Twitter Thread Template",
              };
              return (
                <Card key={key} className="p-5 border-border/60 shadow-card space-y-2">
                  <Label className="text-sm font-medium">{labels[key]}</Label>
                  <Textarea
                    value={settings[key]}
                    onChange={(e) => update(key, e.target.value)}
                    rows={8}
                    className="font-mono text-xs"
                  />
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default BrandSettingsPage;
