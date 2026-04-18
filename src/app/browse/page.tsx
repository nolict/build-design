import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowLeft, Terminal } from "lucide-react";
import BlurText from "@/components/ui/BlurText/BlurText";
import { BrowsePageClient } from "./browse-client";
import { getPublishedDesigns } from "@/lib/actions/design-actions";

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  // Ensure we are truly dynamic by accessing request headers/cookies
  await cookies();
  const designs = await getPublishedDesigns();

  return (
    <div className="bg-background relative flex min-h-screen flex-col overflow-hidden font-mono">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0a0c14] via-[#0f1220] to-[#0a0c14]" />

      <header className="border-primary/20 bg-background/60 relative z-10 border-b backdrop-blur-md">
        <div className="container-custom flex items-center gap-4 py-3">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="tracking-widest">BACK</span>
          </Link>
          <div className="flex-1" />
          <div className="text-primary flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            <span className="text-sm tracking-widest">BROWSE_MODE</span>
          </div>
        </div>
      </header>

      <main className="container-custom relative z-10 flex flex-col items-center gap-4 py-4 md:gap-6 md:py-8">
        <BlurText
          text="AVAILABLE DESIGNS"
          delay={100}
          animateBy="letters"
          direction="top"
          className="font-mono text-2xl font-bold tracking-wider text-white md:text-4xl"
        />

        <BrowsePageClient initialDesigns={designs} />
      </main>
    </div>
  );
}
