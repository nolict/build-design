"use client";

import type { ParsedDesignData } from "@/types/design";

interface PreviewTabProps {
  data: ReturnType<typeof import("./parseDesign").parseDesignMarkdown>;
}

export function PreviewTab({ data }: PreviewTabProps) {
  const { colors, typography, components } = data;

  // Get primary colors for the mockup
  const bgColor = colors.surface?.[0]?.hex || colors.primary?.[0]?.hex || "#14151A";
  const textColor = colors.secondary?.[2]?.hex || colors.primary?.[1]?.hex || "#FFFFFF";
  const accentColor = colors.primary?.[2]?.hex || "#FBCFE8";
  
  // Get button styles
  const buttonStyle = components.find(c => c.name.toLowerCase() === "button")?.properties;
  const cardStyle = components.find(c => c.name.toLowerCase() === "card")?.properties;
  const inputStyle = components.find(c => c.name.toLowerCase() === "input")?.properties;

  // Get heading font size
  const h1Typo = typography.find(t => t.role.toLowerCase().includes("heading 1") || t.role.toLowerCase().includes("heading1"));
  const bodyTypo = typography.find(t => t.role.toLowerCase().includes("body"));

  return (
    <div className="space-y-6">
      {/* Website Mockup - Real-time preview */}
      <section>
        <h3 className="mb-4 font-mono text-lg font-bold text-white">Live Preview</h3>
        
        {/* Browser Window Mockup */}
        <div className="overflow-hidden rounded-lg border border-primary/30 bg-[#1a1a1a] shadow-2xl">
          {/* Browser Toolbar */}
          <div className="flex items-center gap-2 border-b border-primary/20 bg-[#2a2a2a] px-3 py-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 rounded bg-[#1a1a1a] px-3 py-1">
              <span className="font-mono text-xs text-muted-foreground">bun.sh</span>
            </div>
          </div>
          
          {/* Website Content Preview */}
          <div 
            className="min-h-[300px] p-6"
            style={{ 
              backgroundColor: bgColor.startsWith('#') ? bgColor : `#${bgColor}`,
              color: textColor.startsWith('#') ? textColor : `#${textColor}`,
              fontFamily: "system-ui, -apple-system, sans-serif"
            }}
          >
            {/* Header/Nav */}
            <div className="mb-8 flex items-center justify-between">
              <div 
                className="font-bold"
                style={{ fontSize: h1Typo ? `${Math.min(parseFloat(h1Typo.size) * 0.3, 24)}px` : "24px" }}
              >
                bun
              </div>
              <div className="flex gap-4">
                {["Docs", "Blog", "Community", "GitHub"].map((item) => (
                  <span key={item} className="text-sm opacity-70">{item}</span>
                ))}
              </div>
            </div>
            
            {/* Hero Section */}
            <div className="mb-8 text-center">
              <h1 
                className="mb-4 font-bold"
                style={{ 
                  fontSize: h1Typo ? `${Math.min(parseFloat(h1Typo.size) * 0.4, 36)}px` : "36px",
                  fontWeight: h1Typo?.weight || "800"
                }}
              >
                The all-in-one
                <br />
                <span style={{ color: accentColor.startsWith('#') ? accentColor : `#${accentColor}` }}>JavaScript Runtime</span>
              </h1>
              <p 
                className="mx-auto max-w-lg"
                style={{ 
                  fontSize: bodyTypo?.size || "14px",
                  lineHeight: bodyTypo?.lineHeight || "20px"
                }}
              >
                Bun is a fast all-in-one JavaScript runtime. 
                Bundle, test, and run JSX, TypeScript, and Web apps.
              </p>
              
              {/* CTA Buttons */}
              <div className="mt-6 flex justify-center gap-4">
                <button
                  style={{
                    backgroundColor: buttonStyle?.["Background Color"]?.startsWith('#') ? buttonStyle["Background Color"] : `#${buttonStyle?.["Background Color"] || "090A11"}`,
                    color: buttonStyle?.["Color"]?.startsWith('#') ? buttonStyle["Color"] : `#${buttonStyle?.["Color"] || "7F8497"}`,
                    borderRadius: buttonStyle?.["Border Radius"] || "40px",
                    padding: buttonStyle?.["Padding"] || "8px 16px",
                    border: "none"
                  }}
                  className="font-semibold"
                >
                  Get Started
                </button>
                <button
                  style={{
                    backgroundColor: "transparent",
                    color: textColor.startsWith('#') ? textColor : `#${textColor}`,
                    border: `1px solid ${textColor.startsWith('#') ? textColor : `#${textColor}`}`,
                    borderRadius: "40px",
                    padding: "8px 16px"
                  }}
                >
                  View on GitHub
                </button>
              </div>
            </div>
            
            {/* Cards Preview */}
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                { title: "3x faster", desc: "Than Node.js" },
                { title: "Zero config", desc: "TypeScript out of the box" },
                { title: "All-in-one", desc: "Bundler, test runner, package manager" }
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: cardStyle?.["Background Color"]?.startsWith('#') ? cardStyle["Background Color"] : `#${cardStyle?.["Background Color"] || "282A36"}`,
                    color: cardStyle?.["Color"]?.startsWith('#') ? cardStyle["Color"] : `#${cardStyle?.["Color"] || "E5E7EB"}`,
                    borderRadius: cardStyle?.["Border Radius"] || "8px",
                    padding: cardStyle?.["Padding"] || "16px 24px",
                    border: cardStyle?.["Border"] || "1px solid #3B3F4B"
                  }}
                >
                  <div className="mb-2 font-semibold">{item.title}</div>
                  <div className="text-sm opacity-70">{item.desc}</div>
                </div>
              ))}
            </div>
            
            {/* Input Preview */}
            <div className="mt-6">
              <input
                type="text"
                placeholder="npm create bun@latest"
                readOnly
                style={{
                  backgroundColor: inputStyle?.["Background Color"]?.startsWith('#') ? inputStyle["Background Color"] : "transparent",
                  color: inputStyle?.["Color"]?.startsWith('#') ? inputStyle["Color"] : `#${inputStyle?.["Color"] || "FFFFFFEB"}`,
                  borderRadius: inputStyle?.["Border Radius"] || "6px",
                  padding: inputStyle?.["Padding"] || "8px 12px",
                  border: inputStyle?.["Border"] || "none",
                  width: "100%"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette - Still show for reference */}
      {colors.primary.length > 0 && (
        <section>
          <h3 className="mb-4 font-mono text-lg font-bold text-white">Color Palette</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {[...colors.primary, ...colors.secondary, ...colors.surface].map((color, i) => (
              <ColorSwatch key={i} color={color} />
            ))}
          </div>
        </section>
      )}

      {/* Typography */}
      {typography.length > 0 && (
        <section>
          <h3 className="mb-4 font-mono text-lg font-bold text-white">Typography</h3>
          <div className="space-y-2">
            {typography.slice(0, 7).map((typo, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded border border-primary/20 bg-primary/5 p-3"
              >
                <span className="text-white" style={{
                  fontSize: Math.min(parseFloat(typo.size) / 2, 24) || 14,
                  fontWeight: parseInt(typo.weight) || 400,
                }}>
                  {typo.role}
                </span>
                <div className="flex gap-4 font-mono text-xs text-muted-foreground">
                  <span>{typo.size}</span>
                  <span>{typo.weight}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ColorSwatch({ color }: { color: { name: string; hex: string; intent: string } }) {
  const hex = color.hex.startsWith("#") ? color.hex : `#${color.hex}`;
  const isLight = isLightColor(hex);

  return (
    <div className="overflow-hidden rounded border border-primary/20">
      <div className="h-12 w-full" style={{ backgroundColor: hex }} />
      <div className="bg-background p-2">
        <div className="font-mono text-xs font-semibold text-white">{color.name}</div>
        <div className="font-mono text-xs text-muted-foreground">{hex}</div>
      </div>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 128;
}