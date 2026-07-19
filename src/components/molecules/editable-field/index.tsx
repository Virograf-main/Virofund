"use client";

import * as React from "react";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableFieldProps {
  label: string;
  /** true when the current value differs from what's saved on the server */
  dirty: boolean;
  /** true while this specific field's save request is in flight */
  saving: boolean;
  /** true briefly right after a successful save, to flash a confirmation */
  justSaved?: boolean;
  onSave: () => void;
  onCancel: () => void;
  className?: string;
  children: React.ReactNode;
}

/**
 * Wraps a single form field so it can be edited and saved independently of
 * every other field on the page. Renders the label + a small inline
 * save/discard control that only appears once this field's value has
 * actually changed, so users can update one thing at a time without
 * needing to fill in or resubmit the rest of the form.
 */
export const EditableField = ({
  label,
  dirty,
  saving,
  justSaved = false,
  onSave,
  onCancel,
  className,
  children,
}: EditableFieldProps) => {
  return (
    <div className={cn("flex flex-col gap-1 my-2 flex-1 w-full", className)}>
      <div className="flex items-center justify-between gap-2 min-h-[20px]">
        <label className="font-semibold text-sm">{label}</label>

        {dirty && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              aria-label={`Save ${label}`}
              className="p-1 rounded-md text-primary hover:bg-primary/10 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              aria-label={`Discard changes to ${label}`}
              className="p-1 rounded-md text-destructive hover:bg-destructive/10 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {!dirty && justSaved && (
          <span className="flex items-center gap-1 text-xs text-primary">
            <Check className="w-3.5 h-3.5" />
            Saved
          </span>
        )}
      </div>
      {children}
    </div>
  );
};
