import * as React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  children: React.ReactNode;
}

export const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ children, title, ...props }, ref) => {
    return (
      <section ref={ref} className="my-6 " {...props}>
        <h1 className="text-[18px] md:text-[32px] font-[600] text-center md:text-left pb-2">
          {title}
        </h1>
        <div>{children}</div>
      </section>
    );
  }
);

Section.displayName = "Section";
