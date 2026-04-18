"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, Eye, FileText } from "lucide-react";
import { getDesignById, type DesignData } from "@/lib/actions/getDesign";
import { parseDesignMarkdown } from "./parseDesign";
import { PreviewTab } from "./PreviewTab";
import { ContentTab } from "./ContentTab";

interface DesignDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  designId: string;
  websiteName?: string;
}

export function DesignDetailModal({
  isOpen,
  onClose,
  designId,
  websiteName = "Design",
}: DesignDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "content">("preview");
  const [designData, setDesignData] = useState<DesignData | null>(null);
  const [parsedData, setParsedData] = useState<ReturnType<typeof parseDesignMarkdown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && designId) {
      setLoading(true);
      setError(null);
      getDesignById(designId)
        .then((data) => {
          setDesignData(data);
          setParsedData(parseDesignMarkdown(data.content));
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [isOpen, designId]);

  const handleCopy = async () => {
    if (designData?.content) {
      await navigator.clipboard.writeText(designData.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-primary/30 bg-background/95 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-primary/20 bg-primary/5 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="h-3.5 w-3.5 rounded-full bg-red-500/80" />
              <div className="h-3.5 w-3.5 rounded-full bg-yellow-500/80" />
              <div className="h-3.5 w-3.5 rounded-full bg-green-500/80" />
            </div>
            <span className="font-mono text-sm text-white">
              {websiteName} › {designId}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-primary rounded p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-primary/20">
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 font-mono text-sm transition-colors ${
              activeTab === "preview"
                ? "border-b-2 border-primary bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Eye className="h-4 w-4" />
            PREVIEW
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 font-mono text-sm transition-colors ${
              activeTab === "content"
                ? "border-b-2 border-primary bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <FileText className="h-4 w-4" />
            CONTENT
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex h-40 items-center justify-center">
              <div className="font-mono text-sm text-muted-foreground">Loading design data...</div>
            </div>
          )}
          
          {error && (
            <div className="flex h-40 items-center justify-center">
              <div className="font-mono text-sm text-red-400">Error: {error}</div>
            </div>
          )}
          
          {!loading && !error && (
            <>
              {activeTab === "preview" && parsedData && (
                <PreviewTab data={parsedData} />
              )}
              {activeTab === "content" && designData && (
                <ContentTab content={designData.content} />
              )}
            </>
          )}
        </div>

        {/* Footer with Copy */}
        <div className="flex items-center justify-between border-t border-primary/20 bg-primary/5 px-4 py-3">
          <span className="text-muted-foreground font-mono text-xs">
            {loading ? "Loading..." : `${designData?.name || designId} loaded`}
          </span>
          <button
            onClick={handleCopy}
            disabled={!designData || loading}
            className="flex items-center gap-2 rounded bg-primary px-4 py-2 font-mono text-sm text-black transition-all hover:bg-primary/80 disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                COPIED
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                COPY
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}