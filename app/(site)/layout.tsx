import { AnchorNavigation } from "@/components/nav/AnchorNavigation";
import { Nav } from "@/components/nav/Nav";
import { GrainOverlay } from "@/components/chrome/GrainOverlay";
import { ScrollProgressBar } from "@/components/chrome/ScrollProgressBar";
import { AskProvider } from "@/components/ask-my-work/AskContext";
import { AskWidget } from "@/components/ask-my-work/AskWidget";
import { RecedeProvider } from "@/components/motion/RecedeContext";
import { SafeMotionConfig } from "@/components/providers/SafeMotionConfig";
import { SmoothScrollProvider } from "@/components/providers/SmoothScroll";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SafeMotionConfig>
      <div className="min-h-screen">
        <SmoothScrollProvider>
          <AskProvider>
            <RecedeProvider>
              <GrainOverlay />
              <ScrollProgressBar />
              <AnchorNavigation />
              <Nav />
              <main className="relative z-[1]">{children}</main>
              <AskWidget />
            </RecedeProvider>
          </AskProvider>
        </SmoothScrollProvider>
      </div>
    </SafeMotionConfig>
  );
}
