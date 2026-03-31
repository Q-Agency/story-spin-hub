import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContentType, StreamStep } from "@/lib/types";
import { mockStreamSteps } from "@/lib/mock-data";
import { Sparkles, Search, PenTool, Image, CheckCircle2, Loader2, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const stepIcons = {
  planning: Brain,
  researching: Search,
  writing: PenTool,
  generating_image: Image,
  reviewing: CheckCircle2,
  completed: CheckCircle2,
};

interface GenerateModalProps {
  trigger?: React.ReactNode;
  prefillTopic?: string;
}

export function GenerateModal({ trigger, prefillTopic }: GenerateModalProps) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState(prefillTopic || "");
  const [contentType, setContentType] = useState<ContentType>("blog");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [steps, setSteps] = useState<StreamStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);

  const reset = useCallback(() => {
    setTopic(prefillTopic || "");
    setContentType("blog");
    setAdditionalNotes("");
    setIsGenerating(false);
    setSteps([]);
    setCurrentStepIdx(-1);
  }, [prefillTopic]);

  useEffect(() => {
    if (!open) {
      setTimeout(reset, 200);
    }
  }, [open, reset]);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setSteps([]);
    setCurrentStepIdx(0);
  };

  useEffect(() => {
    if (!isGenerating || currentStepIdx < 0 || currentStepIdx >= mockStreamSteps.length) return;

    const step = mockStreamSteps[currentStepIdx];
    const timer = setTimeout(() => {
      const newStep: StreamStep = {
        id: `step-${currentStepIdx}`,
        type: step.type,
        message: step.message,
        timestamp: new Date().toISOString(),
      };
      setSteps((prev) => [...prev, newStep]);

      if (currentStepIdx < mockStreamSteps.length - 1) {
        setCurrentStepIdx((prev) => prev + 1);
      } else {
        setIsGenerating(false);
      }
    }, step.delay);

    return () => clearTimeout(timer);
  }, [isGenerating, currentStepIdx]);

  const isComplete = steps.length > 0 && steps[steps.length - 1]?.type === "completed";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gradient-primary text-primary-foreground font-medium gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Content
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-display text-xl">
            {isGenerating || steps.length > 0 ? "Generating Content" : "New Generation"}
          </DialogTitle>
        </DialogHeader>

        {!isGenerating && steps.length === 0 && (
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-sm font-medium">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g. The future of AI-powered content creation"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Content Type</Label>
              <Select value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog Post</SelectItem>
                  <SelectItem value="linkedin">LinkedIn Post</SelectItem>
                  <SelectItem value="twitter">Twitter Thread</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">Additional Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Specific angle, keywords to include, target audience..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={3}
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={!topic.trim()}
              className="w-full gradient-primary text-primary-foreground font-medium h-11 gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Start Generation
            </Button>
          </div>
        )}

        {(isGenerating || steps.length > 0) && (
          <div className="p-6 pt-3">
            <div className="rounded-lg bg-surface-sunken p-4 mb-4">
              <p className="text-xs text-muted-foreground">Topic</p>
              <p className="text-sm font-medium text-foreground">{topic}</p>
            </div>

            <div className="space-y-0.5 max-h-[320px] overflow-y-auto">
              <AnimatePresence>
                {steps.map((step, i) => {
                  const Icon = stepIcons[step.type];
                  const isLast = i === steps.length - 1;
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "flex items-start gap-3 py-2.5 px-3 rounded-md",
                        isLast && isGenerating && "bg-primary/5"
                      )}
                    >
                      <div className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                        step.type === "completed" ? "bg-status-published/15 text-status-published" : "bg-primary/10 text-primary"
                      )}>
                        {isLast && isGenerating ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Icon className="h-3 w-3" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm",
                          isLast && isGenerating ? "text-foreground font-medium" : "text-muted-foreground"
                        )}>
                          {step.message}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {isGenerating && (
                <div className="flex items-center gap-3 py-2.5 px-3">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-shimmer" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-shimmer" style={{ animationDelay: "300ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-shimmer" style={{ animationDelay: "600ms" }} />
                  </div>
                </div>
              )}
            </div>

            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex gap-2"
              >
                <Button onClick={() => setOpen(false)} className="flex-1 gradient-primary text-primary-foreground">
                  View Content
                </Button>
                <Button variant="outline" onClick={reset}>
                  Generate Another
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
