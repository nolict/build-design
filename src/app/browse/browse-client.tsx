"use client";

import { WebsiteList } from "./website-list";
import type { DesignRow } from "@/lib/actions/design-actions";

type DesignSummary = Pick<DesignRow, "id" | "name" | "slug" | "url" | "category" | "created_at">;

export function BrowsePageClient({ initialDesigns }: { initialDesigns: DesignSummary[] }) {
  return (
    <WebsiteList designs={initialDesigns} />
  );
}
