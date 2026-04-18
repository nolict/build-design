"use client";

import Image from "next/image";
import { ExternalLink, Search, X } from "lucide-react";
import { useState } from "react";
import type { DesignRow } from "@/lib/actions/design-actions";

type DesignSummary = Pick<DesignRow, "id" | "name" | "slug" | "url" | "category" | "created_at">;

function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

function WebsiteItem({ 
  name, 
  url, 
  onClick 
}: { 
  name: string; 
  url: string; 
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group border-primary/10 bg-background/40 hover:bg-primary/10 flex w-full items-center gap-3 border-b p-3 text-left transition-all duration-200 hover:pl-4"
    >
      <div className="border-primary/30 bg-background/60 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded border">
        <Image
          src={getFaviconUrl(url)}
          alt={`${name} favicon`}
          width={20}
          height={20}
          className="h-5 w-5"
          loading="lazy"
          unoptimized
        />
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-between">
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-mono text-sm font-semibold text-white">
            {name}
          </span>
          <span className="text-muted-foreground truncate font-mono text-xs">
            {url}
          </span>
        </div>
        <ExternalLink className="text-primary/60 ml-2 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
    </button>
  );
}

export function WebsiteList({ 
  designs, 
  onSelect 
}: { 
  designs: DesignSummary[];
  onSelect: (design: { id: string; name: string }) => void;
}) {
  const [search, setSearch] = useState("");

  const filteredDesigns = designs.filter(
    (site) =>
      site.name.toLowerCase().includes(search.toLowerCase()) ||
      site.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="border-primary/30 bg-background/90 mx-4 w-full max-w-2xl overflow-hidden rounded-lg border shadow-2xl backdrop-blur-xl">
      {/* Terminal header */}
      <div className="border-primary/20 bg-primary/5 flex items-center gap-2 border-b px-4 py-3">
        <div className="flex gap-2">
          <div className="h-3.5 w-3.5 rounded-full bg-red-500/80" />
          <div className="h-3.5 w-3.5 rounded-full bg-yellow-500/80" />
          <div className="h-3.5 w-3.5 rounded-full bg-green-500/80" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-muted-foreground text-xs">build-design › browse</span>
        </div>
      </div>

      {/* Search input */}
      <div className="border-primary/20 border-b p-3">
        <div className="border-primary/30 bg-background/60 flex items-center gap-2 rounded border px-3 py-2.5">
          <Search className="text-primary h-4 w-4 shrink-0" />
          <input
            type="text"
            placeholder="Search designs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="placeholder:text-muted-foreground/50 min-w-0 flex-1 bg-transparent font-mono text-sm text-white focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-muted-foreground hover:text-primary shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Website list */}
      <div className="max-h-[60vh] overflow-y-auto">
        {filteredDesigns.length > 0 ? (
          filteredDesigns.map((site) => (
            <WebsiteItem
              key={site.id}
              name={site.name}
              url={site.url}
              onClick={() => onSelect({ id: site.id, name: site.name })}
            />
          ))
        ) : (
          <div className="text-muted-foreground p-8 text-center">
            <span className="font-mono text-sm">No results found</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-primary/20 bg-primary/5 flex items-center justify-between border-t px-4 py-2">
        <span className="text-muted-foreground text-[10px]">
          [{filteredDesigns.length}/{designs.length}] entries
        </span>
        <span className="text-primary text-[10px]">● online</span>
      </div>
    </div>
  );
}
