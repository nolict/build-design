"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import type { ComponentSpec, DesignBlock, DesignSection, ParsedDesignData } from "@/types/design";
import { ArrowUpRight, Boxes, ChevronRight, Layers, LayoutTemplate, Palette, Smartphone, Sparkles, Type } from "lucide-react";

interface PreviewTabProps {
  data: ParsedDesignData;
}

export function PreviewTab({ data }: PreviewTabProps) {
  const { overview, colorArchitecture, typography, layout, components, motion, interaction, responsive, iteration, additionalSections } = data;

  const sections = [
    { id: "overview", label: "Overview", icon: LayoutTemplate, visible: overview.paragraphs.length > 0 || overview.highlights.length > 0 },
    { id: "colors", label: "Colors", icon: Palette, visible: colorArchitecture.tokens.length > 0 || colorArchitecture.notes.length > 0 },
    { id: "typography", label: "Typography", icon: Type, visible: typography.styles.length > 0 || typography.notes.length > 0 },
    { id: "layout", label: "Layout", icon: Layers, visible: layout.spacing.length > 0 || layout.zIndex.length > 0 || layout.notes.length > 0 },
    { id: "components", label: "Components", icon: Boxes, visible: components.length > 0 },
    { id: "motion", label: "Motion", icon: Sparkles, visible: motion.shadows.length > 0 || motion.timings.length > 0 || motion.notes.length > 0 },
    { id: "responsive", label: "Responsive", icon: Smartphone, visible: responsive.breakpoints.length > 0 || responsive.adaptiveRules.length > 0 },
    { id: "guides", label: "Guides", icon: ArrowUpRight, visible: interaction.guidelines.length > 0 || iteration.guidelines.length > 0 || additionalSections.length > 0 },
  ].filter((section) => section.visible);

  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "overview");

  return (
    <div className="mt-4 flex min-h-[640px] w-full min-w-0 flex-col gap-6 xl:flex-row">
      <aside className="flex min-w-0 shrink-0 flex-col gap-3 xl:w-72">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="font-mono text-[10px] font-semibold tracking-[0.28em] text-primary">DESIGN SPEC</p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">{data.title}</h2>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Parser membaca heading, subsection, table, dan bullet untuk membentuk preview lintas library.
          </p>
        </div>

        <div className="no-scrollbar flex gap-1 overflow-x-auto pb-2 xl:flex-col xl:pb-0">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 font-mono text-[10px] font-bold tracking-[0.24em] whitespace-nowrap transition-all md:text-xs xl:w-full ${
                  activeSection === section.id
                    ? "border-primary bg-primary text-black"
                    : "border-white/10 bg-white/[0.03] text-white/55 hover:border-primary/30 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {section.label}
                <ChevronRight className={`ml-auto hidden h-3 w-3 xl:block ${activeSection === section.id ? "opacity-100" : "opacity-0"}`} />
              </button>
            );
          })}
        </div>
      </aside>

      <div className="min-w-0 flex-1 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(240,185,11,0.08),rgba(24,26,32,0.92)_22%,rgba(24,26,32,0.98))] p-4 md:p-6 2xl:p-8">
        {activeSection === "overview" && (
          <SectionShell eyebrow="01 // OVERVIEW" title={overview.title}>
            <div className="grid min-w-0 gap-8 2xl:grid-cols-[1.35fr_0.9fr]">
              <div className="space-y-4 text-sm leading-7 text-white/72 md:text-base">
                {overview.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {overview.highlights.map((item) => (
                  <HighlightCard key={item} label={item} />
                ))}
              </div>
            </div>
          </SectionShell>
        )}

        {activeSection === "colors" && (
          <SectionShell eyebrow="02 // COLOR ARCHITECTURE" title="Tokenized Palette">
            <div className="grid min-w-0 gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {colorArchitecture.tokens.map((token) => (
                <ColorTokenCard key={`${token.token}-${token.value}`} token={token} />
              ))}
            </div>
            <TextRail items={colorArchitecture.notes} />
          </SectionShell>
        )}

        {activeSection === "typography" && (
          <SectionShell eyebrow="03 // TYPOGRAPHY" title="Scale And Hierarchy">
            <div className="space-y-4">
              {typography.styles.map((style) => (
                <div key={`${style.style}-${style.size}`} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">{style.style}</p>
                      <p className="mt-1 text-sm text-white/55">{style.element || "Element unspecified"}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px] text-white/55">
                      <SpecBadge label={style.size || "size ?"} />
                      <SpecBadge label={style.weight || "weight ?"} />
                      <SpecBadge label={style.lineHeight || "line-height ?"} />
                      <SpecBadge label={style.letterSpacing || "tracking ?"} />
                    </div>
                  </div>
                  <p className="mt-5 text-white" style={{ fontSize: `clamp(1.1rem, 2vw, ${style.size || "1.5rem"})`, lineHeight: style.lineHeight || "1.3" }}>
                    The quick brown fox maps the visual rhythm of this design system.
                  </p>
                  {style.notes && <p className="mt-4 text-sm leading-6 text-white/55">{style.notes}</p>}
                </div>
              ))}
            </div>
            <TextRail items={typography.notes} />
          </SectionShell>
        )}

        {activeSection === "layout" && (
          <SectionShell eyebrow="04 // LAYOUT" title="Grid, Spacing, And Layering">
            <div className="grid min-w-0 gap-6 2xl:grid-cols-2">
              <SpecTable
                title="Spacing Tokens"
                columns={["Token", "Value", "Usage"]}
                rows={layout.spacing.map((item) => [item.name, item.value, item.context])}
              />
              <SpecTable
                title="Z-Index Layers"
                columns={["Layer", "Value", "Usage"]}
                rows={layout.zIndex.map((item) => [item.name, item.value, item.context])}
              />
            </div>
            <TextRail items={layout.notes} />
          </SectionShell>
        )}

        {activeSection === "components" && (
          <SectionShell eyebrow="05 // COMPONENTS" title="State Matrix">
            <div className="grid min-w-0 gap-5 2xl:grid-cols-2">
              {components.map((component) => (
                <ComponentCard key={component.name} component={component} />
              ))}
            </div>
          </SectionShell>
        )}

        {activeSection === "motion" && (
          <SectionShell eyebrow="06 // MOTION" title="Depth And Transition Mapping">
            <div className="grid min-w-0 gap-6 2xl:grid-cols-2">
              <SpecTable
                title="Shadow Mapping"
                columns={["Level", "Value", "Usage"]}
                rows={motion.shadows.map((item) => [item.name, item.value, item.context])}
              />
              <SpecTable
                title="Timing And Easing"
                columns={["Motion", "Value", "Usage"]}
                rows={motion.timings.map((item) => [item.name, item.value, item.context])}
              />
            </div>
            <TextRail items={motion.notes} />
          </SectionShell>
        )}

        {activeSection === "responsive" && (
          <SectionShell eyebrow="07 // RESPONSIVE" title="Breakpoint Strategy">
            <SpecTable
              title="Breakpoint Architecture"
              columns={["Breakpoint", "Width", "Adaptation", "Font Scaling"]}
              rows={responsive.breakpoints.map((item) => [item.name, item.width, item.adaptation, item.fontScaling])}
            />
            <TextRail items={responsive.adaptiveRules} />
          </SectionShell>
        )}

        {activeSection === "guides" && (
          <SectionShell eyebrow="08 // GUIDES" title="Interaction And Maintenance Rules">
            <div className="grid min-w-0 gap-6 2xl:grid-cols-2">
              <GuideList title="Interaction Guidelines" items={interaction.guidelines} />
              <GuideList title="Iteration Guide" items={iteration.guidelines} />
            </div>
            <div className="mt-8 space-y-6">
              {additionalSections.map((section) => (
                <div key={section.id} className="rounded-2xl border border-white/10 bg-black/15 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">{section.title}</p>
                  <div className="mt-4">
                    <GenericSectionBlocks section={section} />
                  </div>
                </div>
              ))}
            </div>
          </SectionShell>
        )}
      </div>
    </div>
  );
}

function SectionShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <p className="font-mono text-[10px] font-semibold tracking-[0.32em] text-primary">{eyebrow}</p>
      <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h3>
      <div className="mt-8 space-y-8">{children}</div>
    </div>
  );
}

function HighlightCard({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
      <div className="h-1.5 w-10 rounded-full bg-primary" />
      <p className="mt-4 text-sm leading-6 text-white">{label}</p>
    </div>
  );
}

function ColorTokenCard({ token }: { token: ParsedDesignData["colorArchitecture"]["tokens"][number] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="h-28 rounded-xl border border-white/10" style={{ backgroundColor: token.value || "#181A20" }} />
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">{token.token}</p>
          <p className="mt-2 text-sm font-medium text-white">{token.value}</p>
        </div>
      </div>
      {token.usage && <p className="mt-3 text-sm leading-6 text-white/65">{token.usage}</p>}
      {token.evidence && <p className="mt-2 font-mono text-[11px] leading-5 text-white/40">{token.evidence}</p>}
    </div>
  );
}

function SpecBadge({ label }: { label: string }) {
  return <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono">{label}</span>;
}

function SpecTable({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: string[][];
}) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">{title}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead className="bg-white/[0.03]">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join("-")} className="border-t border-white/8">
                {row.map((cell, index) => (
                  <td key={`${cell}-${index}`} className={`px-5 py-4 text-sm leading-6 ${index === 0 ? "font-medium text-white" : "text-white/60"}`}>
                    {cell || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TextRail({ items }: { items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item} className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/65">
          {item}
        </div>
      ))}
    </div>
  );
}

function ComponentCard({ component }: { component: ComponentSpec }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">{component.name}</p>
          {component.summary && <p className="mt-3 text-sm leading-6 text-white/65">{component.summary}</p>}
        </div>
      </div>

      <ComponentPreview component={component} />

      {component.metadata.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {component.metadata.map((item) => (
            <SpecBadge key={`${component.name}-${item.key}`} label={`${item.key}: ${item.value}`} />
          ))}
        </div>
      )}

      {component.states.length > 0 && (
        <div className="mt-6 grid gap-3 border-t border-white/10 pt-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">Raw State Tokens</p>
          {component.states.map((state) => (
            <div key={`${component.name}-${state.name}`} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">{state.name}</p>
              <p className="mt-2 text-sm leading-6 text-white/70">{state.value}</p>
            </div>
          ))}
        </div>
      )}

      {component.notes.length > 0 && (
        <div className="mt-6">
          <TextRail items={component.notes} />
        </div>
      )}
    </div>
  );
}

function ComponentPreview({ component }: { component: ComponentSpec }) {
  const name = component.name.toLowerCase();

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(240,185,11,0.12),rgba(255,255,255,0.03)_42%,rgba(0,0,0,0.18))] p-5">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">Visual States Preview</p>
      {name.includes("button") && <ButtonSpecimen component={component} />}
      {(name.includes("input") || name.includes("field")) && <InputSpecimen component={component} />}
      {name.includes("tab") && <TabSpecimen component={component} />}
      {(name.includes("card") || name.includes("crypto") || name.includes("price")) && <CardSpecimen component={component} />}
      {(name.includes("nav") || name.includes("link")) && <NavSpecimen component={component} />}
      {!/button|input|field|tab|card|crypto|price|nav|link/.test(name) && <GenericSpecimen component={component} />}
    </div>
  );
}

function ButtonSpecimen({ component }: { component: ComponentSpec }) {
  const variants = stateVariants(component);

  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {variants.map((variant) => (
        <StateFrame key={variant.name} name={variant.name}>
          <button
            className="transition-transform"
            style={{
              ...buttonVisualStyle(variant.style),
              filter: variant.style.filter,
              outline: variant.style.outline,
              outlineOffset: variant.style.outlineOffset,
              transform: variant.style.transform,
            }}
          >
            {variant.name === "Default" ? component.name.replace(/button/i, "").trim() || "Button" : variant.name}
          </button>
        </StateFrame>
      ))}
    </div>
  );
}

function InputSpecimen({ component }: { component: ComponentSpec }) {
  const variants = stateVariants(component);

  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {variants.map((variant) => (
        <StateFrame key={variant.name} name={variant.name}>
          <input
            className="w-full outline-none"
            placeholder={`${variant.name} input`}
            style={{
              minHeight: "48px",
              backgroundColor: variant.style.backgroundColor || "transparent",
              color: variant.style.color,
              border: variant.style.border,
              borderRadius: variant.style.borderRadius,
              boxShadow: variant.style.boxShadow,
              outline: variant.style.outline,
              outlineOffset: variant.style.outlineOffset,
              padding: variant.style.padding,
              fontSize: variant.style.fontSize,
            }}
          />
        </StateFrame>
      ))}
    </div>
  );
}

function TabSpecimen({ component }: { component: ComponentSpec }) {
  const variants = stateVariants(component);

  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {variants.map((variant) => (
        <StateFrame key={variant.name} name={variant.name}>
          <div className="flex justify-center gap-5 border-b border-white/10">
            {["Pro", "Desktop", "New Listing"].map((item, index) => (
              <button
                key={`${variant.name}-${item}`}
                className="pb-2 font-semibold"
                style={{
                  color: variant.name === "Active" || index === 0 ? variant.style.color || "#F0B90B" : "#929AA5",
                  borderBottom: variant.name === "Active" || index === 0 ? `2px solid ${variant.style.color || "#F0B90B"}` : "2px solid transparent",
                  fontSize: variant.style.fontSize,
                  fontWeight: variant.style.fontWeight,
                  transform: variant.style.transform,
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </StateFrame>
      ))}
    </div>
  );
}

function CardSpecimen({ component }: { component: ComponentSpec }) {
  const variants = stateVariants(component);

  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {variants.map((variant) => (
        <StateFrame key={variant.name} name={variant.name}>
          <div
            className="w-full transition-colors"
            style={{
              backgroundColor: variant.style.backgroundColor || "#29313D",
              border: variant.style.border,
              borderRadius: variant.style.borderRadius || "4px",
              filter: variant.style.filter,
              padding: "16px",
              transform: variant.style.transform,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-black">B</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">BNB</p>
                <p className="text-xs text-white/45">Binance Coin</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">$624.12</p>
                <p className="text-xs font-semibold text-[#F6465D]">-1.62%</p>
              </div>
            </div>
          </div>
        </StateFrame>
      ))}
    </div>
  );
}

function NavSpecimen({ component }: { component: ComponentSpec }) {
  const variants = stateVariants(component);

  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {variants.map((variant) => (
        <StateFrame key={variant.name} name={variant.name}>
          <nav className="flex flex-wrap items-center justify-center gap-5">
            {["Buy Crypto", "Markets", "Trade"].map((item, index) => (
              <a
                key={`${variant.name}-${item}`}
                href="#"
                onClick={(event) => event.preventDefault()}
                style={{
                  color: variant.name !== "Default" || index === 1 ? variant.style.color || "#F0B90B" : "#EAECEF",
                  fontSize: variant.style.fontSize,
                  fontWeight: variant.name === "Active" || index === 1 ? 600 : variant.style.fontWeight,
                  outline: variant.style.outline,
                  outlineOffset: variant.style.outlineOffset,
                }}
              >
                {item}
              </a>
            ))}
          </nav>
        </StateFrame>
      ))}
    </div>
  );
}

function GenericSpecimen({ component }: { component: ComponentSpec }) {
  const variants = stateVariants(component);

  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {variants.map((variant) => (
        <StateFrame key={variant.name} name={variant.name}>
          <div
            className="flex min-h-24 w-full items-center justify-center text-center font-mono text-[10px] uppercase tracking-[0.24em]"
            style={{
              backgroundColor: variant.style.backgroundColor || "#29313D",
              color: variant.style.color,
              border: variant.style.border,
              borderRadius: variant.style.borderRadius,
              padding: variant.style.padding,
              transform: variant.style.transform,
            }}
          >
            {component.name}
          </div>
        </StateFrame>
      ))}
    </div>
  );
}

function StateFrame({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.24em] text-primary">{name}</p>
      <div className="flex min-h-20 items-center justify-center">{children}</div>
    </div>
  );
}

function buttonVisualStyle(style: CSSProperties): CSSProperties {
  return {
    minHeight: "44px",
    backgroundColor: style.backgroundColor || "#FCD535",
    color: style.color || "#202630",
    border: style.border || "none",
    borderRadius: style.borderRadius || "8px",
    padding: style.padding || "0 32px",
    fontSize: style.fontSize || "16px",
    fontWeight: style.fontWeight || 500,
  };
}

function stateVariants(component: ComponentSpec): Array<{ name: string; style: CSSProperties }> {
  const fallbackStates = component.states.length > 0 ? component.states : [{ name: "Default", value: "" }];
  const defaultStyle = componentStyle(component, "Default");

  return fallbackStates.map((state) => ({
    name: state.name,
    style: {
      ...defaultStyle,
      ...componentStyle(component, state.name),
      ...stateEffectStyle(state.value),
    },
  }));
}

function componentStyle(component: ComponentSpec, stateName = "Default"): CSSProperties {
  const backgroundKeys = ["bg", "background", "background-color"];
  const colorKeys = ["color", "text-color"];
  const radiusKeys = ["radius", "border-radius"];
  const sizeKeys = ["font-size", "size"];
  const weightKeys = ["font-weight", "weight"];
  const defaultBg = extractStyleValue(component, "default", backgroundKeys);
  const defaultColor = extractStyleValue(component, "default", colorKeys);
  const stateBg = extractStyleValue(component, stateName, backgroundKeys);
  const stateColor = extractStyleValue(component, stateName, colorKeys);
  const border = extractStyleValue(component, stateName, ["border"]) || extractStyleValue(component, "default", ["border"]);
  const radius = extractStyleValue(component, stateName, radiusKeys) || extractStyleValue(component, "default", radiusKeys);
  const padding = extractStyleValue(component, stateName, ["padding"]) || extractStyleValue(component, "default", ["padding"]);
  const fontSize = extractStyleValue(component, stateName, sizeKeys) || extractStyleValue(component, "default", sizeKeys);
  const fontWeight = extractStyleValue(component, stateName, weightKeys) || extractStyleValue(component, "default", weightKeys);
  const outline = extractStyleValue(component, stateName, ["outline"]);
  const outlineOffset = extractStyleValue(component, stateName, ["outline-offset"]);
  const boxShadow = extractStyleValue(component, stateName, ["box-shadow"]);

  return {
    backgroundColor: stateBg || defaultBg || "#FCD535",
    border: border || "1px solid #2B3139",
    borderRadius: radius || "8px",
    boxShadow,
    color: stateColor || defaultColor || "#EAECEF",
    fontSize: fontSize || "14px",
    fontWeight: fontWeight || "600",
    outline,
    outlineOffset,
    padding: padding || "0 24px",
  };
}

function stateEffectStyle(value: string): CSSProperties {
  const style: CSSProperties = {};
  const brightness = value.match(/brightness\s*:\s*([0-9.]+)/i)?.[1];
  const transform = value.match(/transform\s*:\s*([^,;]+)/i)?.[1]?.trim();

  if (brightness) {
    style.filter = `brightness(${brightness})`;
  }

  if (transform) {
    style.transform = transform;
  }

  return style;
}

function extractStyleValue(component: ComponentSpec, stateName: string, aliases: string[]): string {
  const state = component.states.find((item) => item.name.toLowerCase() === stateName.toLowerCase());
  if (!state) {
    return "";
  }

  for (const alias of aliases) {
    const escapedAlias = alias
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\\-/g, "[-\\s]");
    const match = state.value.match(new RegExp(`(?:^|[,;]|\\bor\\s+)\\s*${escapedAlias}\\s*:\\s*([^,;]+)`, "i"));
    if (match?.[1]) {
      return normalizeCssValue(alias, match[1]);
    }
  }

  return "";
}

function normalizeCssValue(property: string, value: string): string {
  const trimmed = value.trim();
  const hex = trimmed.match(/#[0-9a-fA-F]{3,8}/)?.[0];

  if (/^(bg|background|background-color|color|text-color)$/i.test(property) && hex) {
    return hex;
  }

  if (/^(radius|border-radius)$/i.test(property)) {
    return trimmed.match(/[0-9.]+(?:px|rem|em|%)/)?.[0] ?? trimmed;
  }

  if (/^(font-weight|weight)$/i.test(property)) {
    return trimmed.match(/\d{3}|bold|semibold|medium|regular/i)?.[0] ?? trimmed;
  }

  return trimmed.replace(/\s*\(.*?\)\s*/g, "").trim();
}

function GuideList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">{title}</p>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/70">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericSectionBlocks({ section }: { section: DesignSection }) {
  return (
    <div className="space-y-4">
      {section.blocks.map((block, index) => (
        <BlockRenderer key={`${section.id}-${block.type}-${index}`} block={block} />
      ))}
      {section.subsections.map((subsection) => (
        <div key={subsection.id} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">{subsection.title}</p>
          <div className="mt-4 space-y-3">
            {subsection.blocks.map((block, index) => (
              <BlockRenderer key={`${subsection.id}-${block.type}-${index}`} block={block} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function BlockRenderer({ block }: { block: DesignBlock }) {
  if (block.type === "paragraph") {
    return <p className="text-sm leading-6 text-white/65">{block.text}</p>;
  }

  if (block.type === "list") {
    return (
      <div className="space-y-2">
        {block.list.items.map((item) => (
          <div key={item} className="rounded-lg border border-white/8 px-3 py-2 text-sm leading-6 text-white/70">
            {item}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/8">
      <table className="w-full min-w-[420px] text-left">
        <thead className="bg-white/[0.03]">
          <tr>
            {block.table.headers.map((header) => (
              <th key={header} className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map((row) => (
            <tr key={Object.values(row).join("-")} className="border-t border-white/8">
              {block.table.headers.map((header) => (
                <td key={`${header}-${row[header]}`} className="px-3 py-2 text-sm leading-6 text-white/65">
                  {row[header] || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
