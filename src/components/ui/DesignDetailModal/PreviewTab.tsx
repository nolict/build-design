"use client";

import { useState } from "react";
import type { ParsedDesignData, ColorItem } from "@/types/design";
import { Terminal, CheckCircle2, XCircle, Smartphone, Layout, Palette, Type, Box, ChevronRight } from "lucide-react";

interface PreviewTabProps {
  data: ParsedDesignData;
}

export function PreviewTab({ data }: PreviewTabProps) {
  const { atmosphere, colors, typography, components, dosAndDonts, responsive } = data;
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "OVERVIEW", icon: <Layout className="h-3.5 w-3.5" /> },
    { id: "colors", label: "COLORS", icon: <Palette className="h-3.5 w-3.5" /> },
    { id: "typography", label: "TYPOGRAPHY", icon: <Type className="h-3.5 w-3.5" /> },
    { id: "components", label: "COMPONENTS", icon: <Box className="h-3.5 w-3.5" />, condition: components.length > 0 },
    { id: "guidelines", label: "GUIDELINES", icon: <CheckCircle2 className="h-3.5 w-3.5" />, condition: dosAndDonts.do.length > 0 || dosAndDonts.dont.length > 0 },
    { id: "responsive", label: "RESPONSIVE", icon: <Smartphone className="h-3.5 w-3.5" />, condition: responsive.breakpoints.length > 0 },
  ].filter(s => s.condition !== false);

  return (
    <div className="mt-4 flex min-h-[600px] w-full flex-col gap-8 lg:flex-row">
      {/* Sidebar Navigation - Sticky on Desktop, Scrollable on Mobile */}
      <aside className="flex shrink-0 flex-col gap-2 lg:w-64">
        <div className="mb-4 hidden items-center gap-2 px-2 opacity-40 lg:flex">
          <Terminal className="h-3 w-3" />
          <span className="font-mono text-[10px] font-bold tracking-widest">DNA_MODULES</span>
        </div>
        
        <div className="no-scrollbar flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:pb-0">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-3 rounded-md px-4 py-3 font-mono text-[10px] font-bold tracking-widest whitespace-nowrap transition-all md:text-xs lg:w-full ${
                activeSection === s.id 
                  ? "bg-primary text-black" 
                  : "bg-primary/5 text-muted-foreground hover:bg-primary/10 border-primary/10 border hover:text-white"
              }`}
            >
              <span className="shrink-0">{s.icon}</span>
              {s.label}
              <ChevronRight className={`ml-auto hidden h-3 w-3 lg:block ${activeSection === s.id ? "opacity-100" : "opacity-0"}`} />
            </button>
          ))}
        </div>
      </aside>

      {/* Content Area */}
      <div className="border-primary/10 bg-primary/5 flex-1 rounded-xl border p-6 backdrop-blur-sm md:p-10">
        {activeSection === "overview" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-10 duration-300">
            <div>
              <h3 className="text-primary mb-4 font-mono text-[10px] font-bold tracking-[0.3em]">00 // OVERVIEW</h3>
              <h2 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-6xl">
                {atmosphere.title || "Target"} <span className="opacity-20">Identity.</span>
              </h2>
              <div className="text-muted-foreground max-w-3xl space-y-4 leading-relaxed md:text-lg">
                {atmosphere.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>

            {atmosphere.keyCharacteristics.length > 0 && (
              <div className="border-primary/10 grid grid-cols-2 gap-4 border-t pt-6 md:grid-cols-4">
                {atmosphere.keyCharacteristics.map((char, i) => (
                  <div key={i} className="bg-primary/5 border-primary/5 flex flex-col gap-2 rounded border p-4">
                    <div className="bg-primary h-1 w-4" />
                    <span className="text-[10px] font-bold tracking-widest text-white">{char.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === "colors" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-12 duration-300">
            <div>
              <h3 className="text-primary mb-4 font-mono text-[10px] font-bold tracking-[0.3em]">01 // COLOR_SYSTEM</h3>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Palette Specimen.</h2>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {Object.entries(colors).map(([key, list]) => {
                if (!Array.isArray(list) || list.length === 0) return null;
                return (
                  <div key={key} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground text-[10px] font-bold tracking-widest whitespace-nowrap uppercase">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <div className="bg-primary/10 h-px flex-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                      {list.map((c, i) => <ColorCard key={i} color={c} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === "typography" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-12 duration-300">
            <div>
              <h3 className="text-primary mb-4 font-mono text-[10px] font-bold tracking-[0.3em]">02 // TYPE_FORMS</h3>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Typography Scale.</h2>
            </div>

            <div className="space-y-4">
              {typography.hierarchy.map((typo, i) => (
                <div key={i} className="bg-primary/5 border-primary/10 hover:border-primary/30 rounded-lg border p-6 transition-colors md:p-10">
                  <div className="mb-8 flex items-center justify-between font-mono text-[10px] opacity-40">
                    <span className="font-bold tracking-widest uppercase">{typo.role}</span>
                    <div className="flex gap-4">
                      <span>{typo.size}</span>
                      <span className="hidden md:inline">{typo.weight}</span>
                    </div>
                  </div>
                  <div 
                    style={{ 
                      fontSize: `clamp(1rem, 5vw, ${typo.size})`,
                      fontWeight: typo.weight,
                      lineHeight: typo.lineHeight,
                      fontFamily: typography.fontFamily || 'inherit',
                      letterSpacing: typo.spacing
                    }}
                    className="break-words text-white"
                  >
                    {typo.role.toLowerCase().includes("heading") 
                      ? "Visual Type Specimen" 
                      : "The quick brown fox jumps over the lazy dog to demonstrate typographic clarity."}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "components" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-12 duration-300">
            <div>
              <h3 className="text-primary mb-4 font-mono text-[10px] font-bold tracking-[0.3em]">03 // ATOMIC_DNA</h3>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Elements Preview.</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {components.map((comp, i) => (
                <div key={i} className="border-primary/10 flex flex-col gap-6 rounded-xl border bg-black/40 p-8">
                  <div className="flex items-start justify-between">
                    <span className="text-primary font-mono text-[10px] font-bold tracking-widest uppercase">{comp.name}</span>
                    <Box className="text-primary h-4 w-4 opacity-20" />
                  </div>
                  <div className="flex flex-1 items-center justify-center py-10">
                     <ComponentRenderer comp={comp} colors={colors} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "guidelines" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-12 duration-300">
            <div>
              <h3 className="text-primary mb-4 font-mono text-[10px] font-bold tracking-[0.3em]">04 // RULES</h3>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Guidelines.</h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> THE BEST PRACTICES
                </div>
                {dosAndDonts.do.map((item, i) => (
                  <div key={i} className="rounded border border-emerald-400/10 bg-emerald-400/5 p-4 text-xs text-white/70 md:text-sm">
                    {item}
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-rose-400">
                  <XCircle className="h-4 w-4" /> COMMON PITFALLS
                </div>
                {dosAndDonts.dont.map((item, i) => (
                  <div key={i} className="rounded border border-rose-400/10 bg-rose-400/5 p-4 text-xs text-white/70 md:text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "responsive" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-12 duration-300">
            <div>
              <h3 className="text-primary mb-4 font-mono text-[10px] font-bold tracking-[0.3em]">05 // ADAPTIVE</h3>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Breakpoints.</h2>
            </div>

            <div className="border-primary/10 overflow-hidden rounded-xl border">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-primary/10 border-primary/10 border-b">
                    <th className="px-6 py-4 font-bold tracking-widest uppercase opacity-60">Device</th>
                    <th className="px-6 py-4 font-bold tracking-widest uppercase opacity-60">Width</th>
                    <th className="px-6 py-4 font-bold tracking-widest uppercase opacity-60">Changes</th>
                  </tr>
                </thead>
                <tbody className="divide-primary/5 divide-y">
                  {responsive.breakpoints.map((bp, i) => (
                    <tr key={i} className="hover:bg-primary/5 transition-colors">
                      <td className="text-primary px-6 py-4 font-bold">{bp.name}</td>
                      <td className="px-6 py-4 text-white/60">{bp.width}</td>
                      <td className="px-6 py-4 text-white/60">{bp.changes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ColorCard({ color }: { color: ColorItem }) {
  const hex = color.hex.startsWith("#") ? color.hex : `#${color.hex}`;
  return (
    <div className="group space-y-3">
      <div 
        className="border-primary/10 aspect-square w-full rounded-lg border transition-transform group-hover:scale-105"
        style={{ backgroundColor: hex }}
      />
      <div>
        <div className="truncate font-mono text-[9px] font-bold text-white uppercase">{color.name}</div>
        <div className="text-muted-foreground font-mono text-[8px] uppercase">{hex}</div>
      </div>
    </div>
  );
}

function ComponentRenderer({ comp, colors }: { comp: any, colors: any }) {
  const resolveColor = (val?: string, fallback?: string) => {
    if (!val) return fallback;
    if (val.startsWith("#")) return val;
    const all = Object.values(colors).flat() as ColorItem[];
    const found = all.find(c => c.name.toLowerCase().includes(val.toLowerCase()));
    return found ? (found.hex.startsWith("#") ? found.hex : `#${found.hex}`) : fallback;
  };

  const name = comp.name.toLowerCase();
  
  if (name.includes("button")) {
    const bg = resolveColor(comp.properties["background-color"], "#E9F284");
    return (
      <button 
        style={{
          backgroundColor: bg,
          color: comp.properties["text-color"] || (isColorDark(bg!) ? "#FFF" : "#000"),
          borderRadius: comp.properties["border-radius"] || "4px",
          padding: "12px 24px",
          fontWeight: "700",
          fontSize: "14px"
        }}
        className="w-full max-w-[200px] transition-opacity hover:opacity-90"
      >
        BUTTON
      </button>
    );
  }

  if (name.includes("input")) {
    return (
      <input 
        placeholder="INPUT DNA..."
        className="border-primary/20 w-full max-w-[240px] rounded border bg-transparent px-4 py-3 font-mono text-xs text-white"
        style={{ borderRadius: comp.properties["border-radius"] }}
      />
    );
  }

  return <div className="text-primary/20 font-mono text-[10px] tracking-widest">DNA_SPECIMEN_PENDING</div>;
}

function isColorDark(hex: string): boolean {
  if (!hex || hex.length < 6) return true;
  const c = hex.startsWith("#") ? hex.substring(1) : hex;
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) < 128;
}
