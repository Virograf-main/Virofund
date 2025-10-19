import React from "react";

interface SectionContainerProps {
  title: string;
  children: React.ReactNode;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  title,
  children,
}) => {
  return (
    <section className="min-h-screen w-full ">
      {/* For desktop/laptop screens */}
      <div className="hidden md:block max-w-6xl mx-auto py-10 px-5">
        {/* Title stays inside the white container */}
        <h2 className="text-[20px] font-semibold text-gray-900 mb-5">
          {title}
        </h2>

        <div className="space-y-6">{children}</div>
      </div>

      {/* For mobile screens */}
      <div className="block md:hidden py-6 px-2 bg-white">
        {/* Title comes out of the section */}
        <h2 className="text-[18px] font-semibold text-gray-900 mb-3">
          {title}
        </h2>

        {/* White card container below */}
        <div className="bg-border rounded-2xl shadow-sm p-3">
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </section>
  );
};
