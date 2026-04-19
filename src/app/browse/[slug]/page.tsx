import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Terminal } from "lucide-react";
import BlurText from "@/components/ui/BlurText/BlurText";
import { getDesignBySlug } from "@/lib/actions/design-actions";
import { DesignClientPage } from "./design-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DesignDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  const design = await getDesignBySlug(slug).catch(() => null);

  if (!design) {
    notFound();
  }

  return (
    <div className="bg-background relative flex min-h-screen flex-col font-mono">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0a0c14] via-[#0f1220] to-[#0a0c14]" />

      <header className="border-primary/20 bg-background/60 relative z-10 border-b backdrop-blur-md">
        <div className="container-custom flex items-center gap-4 py-3">
          <Link
            href="/browse"
            className="text-muted-foreground hover:text-primary flex items-center gap-2 text-[10px] transition-colors md:text-sm"
          >
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
            <span className="tracking-widest">BACK</span>
          </Link>
          <div className="flex-1" />
          <div className="text-primary flex items-center gap-2">
            <Terminal className="h-3 w-3 md:h-4 md:w-4" />
            <span className="text-[10px] tracking-widest md:text-sm">DNA_v4</span>
          </div>
        </div>
      </header>

      <main className="container-custom relative z-10 flex w-full flex-col items-start overflow-x-hidden pt-10 pb-20 md:pb-32">
        <div className="flex w-full flex-col">
          {/* CATEGORY TAG - REDUCED SPACING (MT-8/MT-12) */}
          <div className="mt-8 mb-8 flex items-center gap-4 md:mt-12 md:mb-10">
            <div className="border-primary/30 bg-primary/5 hover:bg-primary/10 inline-flex items-center gap-3 rounded-full border px-4 py-2 backdrop-blur-md transition-all">
              <div className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full shadow-[0_0_8px_rgba(233,242,132,0.8)]" />
              <span className="text-primary font-mono text-[9px] font-bold tracking-[0.2em] uppercase md:text-[10px]">
                {design.category || "General"}
              </span>
            </div>
            <div className="from-primary/20 h-px flex-1 bg-gradient-to-r to-transparent" />
          </div>
          
          <div className="mb-4 flex w-full justify-start">
            <BlurText
              text={design.name.toUpperCase()}
              delay={100}
              animateBy="letters"
              direction="top"
              className="text-left font-mono text-3xl font-normal tracking-tighter text-white md:text-6xl"
              style={{ justifyContent: 'flex-start' } as React.CSSProperties}
            />
          </div>
          <p className="text-muted-foreground max-w-2xl font-mono text-xs leading-relaxed md:text-sm">
            Detailed technical specification and visual DNA for {design.name}. 
            Use the CLI command below to integrate this design into your project.
          </p>
        </div>

        <div className="w-full pt-10 md:pt-16">
          <DesignClientPage design={design} />
        </div>
      </main>
    </div>
  );
}
