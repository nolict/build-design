"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import BlurText from "@/components/ui/BlurText/BlurText";

export default function Home() {
  return (
    <div className="bg-background relative flex min-h-screen flex-col items-center overflow-hidden font-mono">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0a0c14] via-[#0f1220] to-[#0a0c14]" />

      <main className="container-custom relative z-10 flex flex-col items-center gap-8 pt-24 pb-16 text-center md:pt-48 md:pb-20">
        <section className="flex flex-col items-center gap-6">
          <div className="border-primary/20 text-primary bg-primary/5 animate-in fade-in slide-in-from-top-4 flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] tracking-widest uppercase backdrop-blur-sm duration-1000">
            <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
            System_v0.1_Initialized
          </div>
          
          <div className="flex flex-col items-center">
            <BlurText
              text="BUILD"
              delay={100}
              animateBy="letters"
              direction="top"
              className="font-mono text-5xl leading-none font-bold tracking-tighter text-white uppercase md:text-9xl"
            />
            <BlurText
              text="DESIGN_"
              delay={100}
              animateBy="letters"
              direction="bottom"
              className="text-primary font-mono text-5xl leading-none font-bold tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(233,242,132,0.3)] md:text-9xl"
            />
          </div>
          
          <BlurText
            text="Extracting visual DNA from premium web interfaces for your local development workflow."
            delay={50}
            animateBy="words"
            direction="top"
            className="text-muted-foreground/80 mt-4 max-w-md font-mono text-xs leading-relaxed tracking-[0.3em] uppercase md:text-base"
          />
        </section>

        <div className="relative">
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary bg-background/20 h-12 rounded-none px-8 backdrop-blur-md transition-all duration-200 hover:text-black md:px-10">
            <Link href="/browse">
              <span className="typing-text pr-2 text-sm tracking-widest md:text-base">
                {">"} EXEC BROWSE
              </span>
            </Link>
          </Button>
        </div>
      </main>
      
      <div className="fixed bottom-8 left-8 z-10 hidden md:block">
        <div className="text-muted-foreground/30 flex flex-col gap-2 font-mono text-[9px] tracking-[0.3em] uppercase">
          <span>status: operational</span>
          <span>env: nextjs_v15</span>
          <span>core: design_dna_01</span>
        </div>
      </div>

      <div className="fixed top-1/2 -right-4 z-10 hidden -translate-y-1/2 rotate-90 md:block">
        <span className="text-muted-foreground/20 font-mono text-[9px] tracking-[1em] uppercase">
          Standard_Protocol_v.1
        </span>
      </div>
    </div>
  );
}