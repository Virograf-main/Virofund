import { Separator } from "@/components/atoms";

export const Demarcation = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center gap-2">
      <Separator className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">{text}</span>
      <Separator className="h-px flex-1 bg-border" />
    </div>
  );
};
