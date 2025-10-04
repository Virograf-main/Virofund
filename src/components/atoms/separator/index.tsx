import * as React from "react";
import { Separator as ShadSeparator } from "@radix-ui/react-separator";

type SeparatorProps = React.ComponentPropsWithoutRef<typeof ShadSeparator>;

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, ...props }, ref) => {
    return <ShadSeparator ref={ref} className={className} {...props} />;
  }
);

Separator.displayName = "Separator";
