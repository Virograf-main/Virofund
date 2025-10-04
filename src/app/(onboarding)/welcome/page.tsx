import { Disclaimer } from "@/components/molecules";
export default function OnboardingHome() {
  return (
    <Disclaimer
      title="Welcome to Virofund"
      text="We’ll like to know you better in order to give you the best results!"
      linkText="Let's Go"
      linkUrl="/about-you"
    />
  );
}
