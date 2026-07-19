"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { generateMatchSummary } from "@/lib/profile";
import { cn } from "@/lib/utils";

export interface MatchSummaryDialogProps {
  profileId: string;
  name: string;
  className?: string;
}

export function MatchSummaryDialog({
  profileId,
  name,
  className,
}: MatchSummaryDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  const handleOpenChange = async (next: boolean) => {
    setOpen(next);
    if (next && !fetched) {
      setLoading(true);
      const result = await generateMatchSummary(profileId);
      setSummary(result);
      setFetched(true);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors cursor-pointer",
            className
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Why we match
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Compatibility with {name}
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Generating your compatibility summary...
            </p>
          </div>
        ) : summary ? (
          <p className="text-sm text-foreground leading-relaxed">{summary}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            We couldn't generate a summary right now. Please try again shortly.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
