import { Nav } from "@/components/nav/Nav";
import { GrainOverlay } from "@/components/chrome/GrainOverlay";
import { StatusBar } from "@/components/chrome/StatusBar";
import { ScrollProgressBar } from "@/components/chrome/ScrollProgressBar";
import { CustomCursor } from "@/components/chrome/CustomCursor";
import { Preloader } from "@/components/chrome/Preloader";
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
      <div className="pb-8">
        <SmoothScrollProvider>
          <AskProvider>
            <RecedeProvider>
              <Preloader />
              <GrainOverlay />
              <ScrollProgressBar />
              <CustomCursor />
              <Nav />
              <main className="relative z-[1]">{children}</main>
              <StatusBar />
              <AskWidget />
            </RecedeProvider>
          </AskProvider>
        </SmoothScrollProvider>
      </div>
    </SafeMotionConfig>
  );
}
