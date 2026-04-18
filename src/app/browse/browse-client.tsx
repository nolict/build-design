"use client";

import { useState } from "react";
import { WebsiteList } from "./website-list";
import { DesignDetailModal } from "@/components/ui/DesignDetailModal";
import type { DesignRow } from "@/lib/actions/design-actions";

type DesignSummary = Pick<DesignRow, "id" | "name" | "slug" | "url" | "category" | "created_at">;

export function BrowsePageClient({ initialDesigns }: { initialDesigns: DesignSummary[] }) {
  const [selectedDesign, setSelectedDesign] = useState<{
    id: string;
    name: string;
  } | null>(null);

  return (
    <>
      <WebsiteList 
        designs={initialDesigns} 
        onSelect={(design) => setSelectedDesign(design)} 
      />

      <DesignDetailModal
        isOpen={!!selectedDesign}
        onClose={() => setSelectedDesign(null)}
        designId={selectedDesign?.id || ""}
        websiteName={selectedDesign?.name}
      />
    </>
  );
}
