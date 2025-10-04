import { Separator } from "@/components/atoms";

export const Demarcation = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center gap-2">
      <Separator className="h-px flex-1 bg-gray-300" />
      <span className="text-xs text-gray-500">{text}</span>
      <Separator className="h-px flex-1 bg-gray-300" />
    </div>
  );
};
