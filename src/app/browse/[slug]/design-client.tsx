"use client";

import { useState } from "react";
import { Check, Copy, Eye, FileText } from "lucide-react";
import { PreviewTab } from "@/components/ui/DesignDetailModal/PreviewTab";
import { ContentTab } from "@/components/ui/DesignDetailModal/ContentTab";
import { parseDesignMarkdown } from "@/components/ui/DesignDetailModal/parseDesign";
import type { DesignRow } from "@/lib/actions/design-actions";

export function DesignClientPage({ design }: { design: DesignRow }) {
  const [activeTab, setActiveTab] = useState<"preview" | "design">("preview");
  const [copied, setCopied] = useState(false);
  const parsedData = parseDesignMarkdown(design.content);

  const cliCommand = `npx build-design add ${design.slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex w-full flex-col gap-6 overflow-hidden md:gap-8">
      {/* CLI Installation Section */}
      <section className="flex w-full flex-col gap-3">
        <h2 className="text-primary font-mono text-[10px] font-bold tracking-[0.2em] md:text-xs">INSTALLATION</h2>
        <div className="border-primary/20 bg-primary/5 flex w-full flex-col justify-between overflow-hidden rounded-md border backdrop-blur-sm">
          <div className="scrollbar-hide border-primary/10 overflow-x-auto border-b p-4">
            <code className="font-mono text-xs whitespace-nowrap text-white md:text-sm">
              <span className="text-primary">$</span> {cliCommand}
            </code>
          </div>
          <button
            onClick={handleCopy}
            className="hover:bg-primary/10 flex w-full items-center justify-center gap-2 py-3 text-white transition-colors"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-400 md:h-4 md:w-4" />
            ) : (
              <Copy className="text-primary h-3 w-3 md:h-4 md:w-4" />
            )}
            <span className="font-mono text-[9px] font-bold tracking-widest uppercase md:text-[10px]">
              {copied ? "COPIED" : "COPY"}
            </span>
          </button>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-4 border-b border-white/5 pb-2 md:gap-6">
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.2em] transition-all md:text-[10px] md:tracking-[0.3em] ${
              activeTab === "preview" 
                ? "text-primary scale-105" 
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Eye className="h-3 w-3" />
            PREVIEW
          </button>
          <button
            onClick={() => setActiveTab("design")}
            className={`flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.2em] transition-all md:text-[10px] md:tracking-[0.3em] ${
              activeTab === "design" 
                ? "text-primary scale-105" 
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <FileText className="h-3 w-3" />
            DESIGN
          </button>
        </div>

        {/* Content Rendering */}
        <div className="min-h-[300px] md:min-h-[400px]">
          {activeTab === "preview" ? (
            <PreviewTab data={parsedData} />
          ) : (
            <ContentTab content={design.content} />
          )}
        </div>
      </section>
    </div>
  );
}
