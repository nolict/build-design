"use client";

import { useState } from "react";
import type { ParsedDesignData, ColorItem } from "@/types/design";
import { Search, Layout, Type, Palette, Box, Terminal, CheckCircle2, XCircle, Smartphone } from "lucide-react";

interface PreviewTabProps {
  data: ParsedDesignData;
}

export function PreviewTab({ data }: PreviewTabProps) {
  const { atmosphere, colors, typography, components, dosAndDonts, responsive } = data;
  const [activeSection, setActiveSection] = useState("overview");

  // FIXED THEME: HIGH-END CLI (Deep Navy & Yellow)
  const theme = {
    bg: "#090A11",
    surface: "#11131C",
    accent: "#E9F284",
    text: "#FFFFFF",
    muted: "#7F8497",
    border: "#1E2028"
  };

  const sections = [
    { id: "overview", label: "Overview", icon: <Layout className="h-3 w-3" /> },
    { id: "colors", label: "Colors", icon: <Palette className="h-3 w-3" /> },
    { id: "typography", label: "Typography", icon: <Type className="h-3 w-3" /> },
    { id: "components", label: "Components", icon: <Box className="h-3 w-3" />, condition: components.length > 0 },
    { id: "guidelines", label: "Guidelines", icon: <CheckCircle2 className="h-3 w-3" />, condition: dosAndDonts.do.length > 0 || dosAndDonts.dont.length > 0 },
    { id: "responsive", label: "Responsive", icon: <Smartphone className="h-3 w-3" />, condition: responsive.breakpoints.length > 0 },
  ].filter(s => s.condition !== false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  return (
    <div 
      className="flex h-full flex-col font-sans" 
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      {/* GLOSSY CLI SUB-NAV */}
      <div 
        className="sticky top-0 z-30 flex items-center justify-between border-b px-4 py-4 backdrop-blur-xl md:px-8"
        style={{ borderColor: theme.border, backgroundColor: `${theme.bg}CC` }}
      >
        <div className="no-scrollbar flex items-center gap-8 overflow-x-auto">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.accent }} />
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-80">build-design</span>
          </div>
          <div className="flex gap-6">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] whitespace-nowrap uppercase transition-all ${
                  activeSection === s.id ? "text-white opacity-100" : "opacity-30 hover:opacity-60"
                }`}
                style={{ color: activeSection === s.id ? theme.accent : 'inherit' }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="hidden h-8 w-8 items-center justify-center rounded-lg border md:flex" style={{ borderColor: theme.border }}>
          <Search className="h-3 w-3 opacity-30" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-12 md:px-20 md:py-24">
        {/* SECTION 00: OVERVIEW */}
        <section id="section-overview" className="mb-40">
           <div className="mb-12 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[9px] font-bold tracking-widest uppercase" style={{ borderColor: theme.border, color: theme.accent }}>
              <Terminal className="h-3 w-3" />
              Structural Analysis v3.0
           </div>
           <h1 className="mb-10 max-w-4xl text-5xl font-extrabold tracking-tighter md:text-8xl">
             {data.atmosphere.title || "Target"} <span className="block opacity-20">Identity System.</span>
           </h1>
           <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div className="space-y-6 text-lg leading-relaxed md:text-xl" style={{ color: theme.muted }}>
                 {atmosphere.paragraphs.length > 0 ? (
                   atmosphere.paragraphs.map((p, i) => <p key={i}>{p}</p>)
                 ) : (
                   <p>A comprehensive architectural breakdown of the design system components and visual language.</p>
                 )}
                 {atmosphere.keyCharacteristics.length > 0 && (
                   <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {atmosphere.keyCharacteristics.map((char, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <div className="h-1 w-1 rounded-full" style={{ backgroundColor: theme.accent }} />
                           <span className="text-xs font-bold tracking-wide uppercase">{char}</span>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
              <div className="rounded-3xl border p-8" style={{ borderColor: theme.border, backgroundColor: theme.surface }}>
                 <div className="mb-6 flex justify-between">
                    <span className="font-mono text-[10px] uppercase opacity-40">Quick Stats</span>
                    <div className="flex gap-1">
                       {[1,2,3].map(i => <div key={i} className="h-1 w-4 rounded-full" style={{ backgroundColor: theme.accent, opacity: i*0.3 }} />)}
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between border-b pb-3" style={{ borderColor: theme.border }}>
                       <span className="text-xs opacity-60">Dominant Hue</span>
                       <span className="font-mono text-xs">{colors.primary[0]?.hex || "#N/A"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-3" style={{ borderColor: theme.border }}>
                       <span className="text-xs opacity-60">Typography Roles</span>
                       <span className="font-mono text-xs">{typography.hierarchy.length} Levels</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-xs opacity-60">Component DNA</span>
                       <span className="font-mono text-xs">{components.length} Items</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* SECTION 01: COLORS */}
        <section id="section-colors" className="mb-40">
          <div className="mb-16">
            <span className="font-mono text-[11px] font-bold tracking-[0.4em] uppercase" style={{ color: theme.accent }}>01 / COLOR_SYSTEM</span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">Palette Specimen.</h2>
          </div>

          <div className="grid grid-cols-1 gap-20">
             {colors.primary.length > 0 && (
               <div className="space-y-8">
                  <div className="flex items-center gap-4">
                     <h3 className="text-xs font-bold tracking-widest uppercase opacity-40">Brand & Primary</h3>
                     <div className="h-[1px] flex-1" style={{ backgroundColor: theme.border }} />
                  </div>
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                     {colors.primary.map((c, i) => <ColorCard key={i} color={c} theme={theme} />)}
                  </div>
               </div>
             )}
             
             {colors.secondary.length > 0 && (
               <div className="space-y-8">
                  <div className="flex items-center gap-4">
                     <h3 className="text-xs font-bold tracking-widest uppercase opacity-40">Secondary & Accent</h3>
                     <div className="h-[1px] flex-1" style={{ backgroundColor: theme.border }} />
                  </div>
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                     {colors.secondary.map((c, i) => <ColorCard key={i} color={c} theme={theme} />)}
                  </div>
               </div>
             )}

             {colors.surface.length > 0 && (
               <div className="space-y-8">
                  <div className="flex items-center gap-4">
                     <h3 className="text-xs font-bold tracking-widest uppercase opacity-40">Surface & Background</h3>
                     <div className="h-[1px] flex-1" style={{ backgroundColor: theme.border }} />
                  </div>
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                     {colors.surface.map((c, i) => <ColorCard key={i} color={c} theme={theme} />)}
                  </div>
               </div>
             )}

             {colors.semantic && colors.semantic.length > 0 && (
               <div className="space-y-8">
                  <div className="flex items-center gap-4">
                     <h3 className="text-xs font-bold tracking-widest uppercase opacity-40">Semantic Colors</h3>
                     <div className="h-[1px] flex-1" style={{ backgroundColor: theme.border }} />
                  </div>
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                     {colors.semantic.map((c, i) => <ColorCard key={i} color={c} theme={theme} />)}
                  </div>
               </div>
             )}
          </div>
        </section>

        {/* SECTION 02: TYPOGRAPHY */}
        <section id="section-typography" className="mb-40">
          <div className="mb-16">
            <span className="font-mono text-[11px] font-bold tracking-[0.4em] uppercase" style={{ color: theme.accent }}>02 / TYPE_FORMS</span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">Typography Scale.</h2>
          </div>

          <div className="space-y-px" style={{ backgroundColor: theme.border }}>
            {typography.hierarchy.map((typo, i) => (
              <div 
                key={i} 
                className="group flex flex-col gap-8 bg-[#090A11] py-16 transition-all hover:px-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 opacity-40">
                  <span className="font-mono text-[10px] font-bold tracking-widest uppercase">{typo.role}</span>
                  <div className="flex gap-6 font-mono text-[10px]">
                    <span className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-current" /> {typo.size}</span>
                    <span className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-current" /> {typo.weight}</span>
                    <span className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-current" /> {typo.lineHeight}</span>
                  </div>
                </div>
                <div 
                  className="max-w-5xl"
                  style={{ 
                    fontSize: typo.size.includes('px') ? typo.size : '16px',
                    fontWeight: typo.weight,
                    lineHeight: typo.lineHeight,
                    fontFamily: typography.fontFamily || 'inherit',
                    letterSpacing: typo.spacing
                  }}
                >
                  {typo.role.toLowerCase().includes("heading") 
                    ? "The quick brown fox jumps over the lazy dog" 
                    : "Building high-performance interfaces requires a meticulous approach to typography and spatial awareness. This specimen represents the core textual DNA of the target system."}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 03: COMPONENTS */}
        {components.length > 0 && (
          <section id="section-components" className="mb-40">
            <div className="mb-16">
              <span className="font-mono text-[11px] font-bold tracking-[0.4em] uppercase" style={{ color: theme.accent }}>03 / ATOMIC_DNA</span>
              <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">Component Specimen.</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-1 border-t" style={{ borderColor: theme.border }}>
               {components.map((comp, i) => (
                 <div 
                    key={i} 
                    className="flex flex-col items-center gap-12 border-b py-20 lg:flex-row"
                    style={{ borderColor: theme.border }}
                 >
                    <div className="w-full lg:w-1/3">
                       <div className="mb-2 font-mono text-[10px] font-bold tracking-widest uppercase" style={{ color: theme.accent }}>{comp.name}</div>
                       <h4 className="text-2xl font-bold">Element Analysis</h4>
                       <p className="mt-4 text-sm leading-relaxed opacity-40" style={{ color: theme.muted }}>
                          Visual token extraction for the {comp.name} component, mapping exact CSS values from the source environment.
                       </p>
                    </div>
                    
                    <div className="flex flex-1 items-center justify-center rounded-3xl border border-dashed py-16" style={{ borderColor: theme.border }}>
                       <div className="w-full max-w-sm px-8">
                          {(() => {
                            const resolveColor = (val?: string, fallback?: string) => {
                              if (!val) return fallback;
                              if (val.startsWith("#")) return val;
                              
                              // Search in palette
                              const allColors = [...colors.primary, ...colors.secondary, ...colors.surface, ...(colors.semantic || [])];
                              const found = allColors.find(c => 
                                c.name.toLowerCase().includes(val.toLowerCase()) || 
                                val.toLowerCase().includes(c.name.toLowerCase())
                              );
                              return found ? (found.hex.startsWith("#") ? found.hex : `#${found.hex}`) : fallback;
                            };

                            const compName = comp.name.toLowerCase();
                            
                            if (compName.startsWith("button")) {
                              const bgColor = resolveColor(
                                comp.properties["background-color"],
                                colors.primary[0]?.hex || theme.accent
                              ) || theme.accent;
                              return (
                                <button 
                                    style={{
                                       backgroundColor: bgColor,
                                       color: comp.properties["text-color"] || (isColorDark(bgColor) ? "#FFF" : "#000"),
                                       borderRadius: comp.properties["border-radius"] || "8px",
                                       padding: comp.properties["padding"] || "16px 32px",
                                       border: comp.properties["border"] || "none",
                                       width: "100%",
                                       fontWeight: comp.properties["font-weight"] || "700",
                                       fontSize: comp.properties["font-size"] || "16px"
                                    }}
                                >
                                   Action Specimen
                                </button>
                              );
                            }

                            if (compName.startsWith("input")) {
                              return (
                                <input 
                                    placeholder="Input placeholder DNA..."
                                    style={{
                                       backgroundColor: "transparent",
                                       color: theme.text,
                                       borderRadius: comp.properties["border-radius"] || "8px",
                                       padding: comp.properties["padding"] || "12px 24px",
                                       border: comp.properties["border"] || `1px solid ${theme.border}`,
                                       width: "100%",
                                       fontSize: comp.properties["font-size"] || "16px"
                                    }}
                                />
                              );
                            }

                            if (compName.startsWith("card")) {
                              const bgColor = resolveColor(
                                comp.properties["background-color"],
                                theme.surface
                              ) || theme.surface;
                              return (
                                <div 
                                    style={{
                                       backgroundColor: bgColor,
                                       borderRadius: comp.properties["border-radius"] || "24px",
                                       border: comp.properties["border"] || `1px solid ${theme.border}`,
                                       padding: comp.properties["padding"] || "32px"
                                    }}
                                >
                                   <div className="mb-4 h-3 w-1/2 rounded bg-current opacity-20" />
                                   <div className="space-y-2">
                                      <div className="h-2 w-full rounded bg-current opacity-10" />
                                      <div className="h-2 w-full rounded bg-current opacity-10" />
                                      <div className="h-2 w-3/4 rounded bg-current opacity-10" />
                                   </div>
                                </div>
                              );
                            }

                            return (
                               <div className="rounded-xl border border-dashed p-8 text-center opacity-20" style={{ borderColor: theme.border }}>
                                  {comp.name} Specimen
                               </div>
                            );
                          })()}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </section>
        )}

        {/* SECTION 04: GUIDELINES (Do's & Don'ts) */}
        {(dosAndDonts.do.length > 0 || dosAndDonts.dont.length > 0) && (
          <section id="section-guidelines" className="mb-40">
            <div className="mb-16">
              <span className="font-mono text-[11px] font-bold tracking-[0.4em] uppercase" style={{ color: theme.accent }}>04 / DEV_RULES</span>
              <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">Implementation Guide.</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
               <div className="space-y-6">
                  <div className="flex items-center gap-3 text-emerald-400">
                     <CheckCircle2 className="h-5 w-5" />
                     <h3 className="font-mono text-sm font-bold tracking-widest uppercase">The Best Practices</h3>
                  </div>
                  <div className="space-y-4">
                     {dosAndDonts.do.map((item, i) => (
                       <div key={i} className="rounded-2xl border bg-emerald-400/5 p-6" style={{ borderColor: 'rgba(52, 211, 153, 0.1)' }}>
                          <p className="text-sm leading-relaxed opacity-80">{item}</p>
                       </div>
                     ))}
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div className="flex items-center gap-3 text-rose-400">
                     <XCircle className="h-5 w-5" />
                     <h3 className="font-mono text-sm font-bold tracking-widest uppercase">Common Pitfalls</h3>
                  </div>
                  <div className="space-y-4">
                     {dosAndDonts.dont.map((item, i) => (
                       <div key={i} className="rounded-2xl border bg-rose-400/5 p-6" style={{ borderColor: 'rgba(251, 113, 133, 0.1)' }}>
                          <p className="text-sm leading-relaxed opacity-80">{item}</p>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </section>
        )}

        {/* SECTION 05: RESPONSIVE */}
        {responsive.breakpoints.length > 0 && (
          <section id="section-responsive" className="mb-40">
            <div className="mb-16">
              <span className="font-mono text-[11px] font-bold tracking-[0.4em] uppercase" style={{ color: theme.accent }}>05 / ADAPTIVE_FLOW</span>
              <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">Breakpoint Specs.</h2>
            </div>
            
            <div className="overflow-hidden rounded-3xl border" style={{ borderColor: theme.border }}>
               <table className="w-full text-left font-mono text-xs">
                  <thead>
                     <tr className="border-b" style={{ borderColor: theme.border, backgroundColor: theme.surface }}>
                        <th className="px-8 py-6 font-bold tracking-widest uppercase opacity-40">Device</th>
                        <th className="px-8 py-6 font-bold tracking-widest uppercase opacity-40">Width</th>
                        <th className="px-8 py-6 font-bold tracking-widest uppercase opacity-40">Key Modifications</th>
                     </tr>
                  </thead>
                  <tbody>
                     {responsive.breakpoints.map((bp, i) => (
                       <tr key={i} className="border-b last:border-0" style={{ borderColor: theme.border }}>
                          <td className="px-8 py-6 font-bold">{bp.name}</td>
                          <td className="px-8 py-6 opacity-60">{bp.width}</td>
                          <td className="px-8 py-6 opacity-60">{bp.changes}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

interface Theme {
  bg: string;
  surface: string;
  accent: string;
  text: string;
  muted: string;
  border: string;
}

function ColorCard({ color, theme }: { color: ColorItem; theme: Theme }) {
  const hex = color.hex.startsWith("#") ? color.hex : `#${color.hex}`;
  return (
    <div className="group">
       <div 
          className="relative aspect-square w-full overflow-hidden rounded-2xl border transition-all group-hover:scale-[1.02] group-hover:shadow-[0_0_30px_rgba(233,242,132,0.1)]" 
          style={{ backgroundColor: hex, borderColor: theme.border }} 
       >
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
             <div className="rounded-full bg-black/40 px-3 py-1 font-mono text-[8px] font-bold backdrop-blur-md">COPY HEX</div>
          </div>
       </div>
       <div className="mt-4">
          <div className="truncate font-mono text-[10px] font-bold tracking-tight uppercase">{color.name}</div>
          <div className="font-mono text-[9px] opacity-40">{hex}</div>
       </div>
    </div>
  );
}

function isColorDark(hex: string): boolean {
  if (!hex || hex.length < 6) return true;
  const c = hex.startsWith("#") ? hex.substring(1) : hex;
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 128;
}
