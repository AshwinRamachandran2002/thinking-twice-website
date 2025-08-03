import Navigation from "@/components/sections/navigation";
import HeroSection from "@/components/sections/hero";
import CustomerLogos from "@/components/sections/customer-logos";
import SignalAnalysisTable from "@/components/sections/signal-analysis-table";
import AiAgentsFeature from "@/components/sections/ai-agents-feature";
import GtmIntelligenceSection from "@/components/sections/gtm-intelligence";
import { ContactUs } from "@/components/sections/contact-us";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="flex min-h-screen flex-col items-center justify-between">
        <HeroSection />
      </main>
      <ContactUs />
      <Footer />
    </>
  );
}