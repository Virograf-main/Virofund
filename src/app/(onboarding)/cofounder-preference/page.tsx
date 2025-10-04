import { Disclaimer } from "@/components/molecules";
import React from "react";

function CofounderPreferencePage() {
  return (
    <Disclaimer
      title="Co-Founder Preferences"
      text="This section is crucial to finding the right co-founder, as the information you provide here will significantly influence your matches. Be open and honest—there’s no need to impress anyone. The more accurately you represent yourself, the better your chances of finding a co-founder who truly aligns with your vision and working style."
      linkText="Next"
      linkUrl="/cofounder-profile"
    />
  );
}

export default CofounderPreferencePage;
