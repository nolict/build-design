"use server";

import { promises as fs } from "fs";
import path from "path";

export interface DesignData {
  id: string;
  name: string;
  content: string;
}

export async function getDesignById(designId: string): Promise<DesignData> {
  const contentDir = path.join(process.cwd(), "content", "designs", designId);
  const designMdPath = path.join(contentDir, "DESIGN.md");
  const metadataPath = path.join(process.cwd(), "content", "metadata.json");

  try {
    const [content, metadataJson] = await Promise.all([
      fs.readFile(designMdPath, "utf-8"),
      fs.readFile(metadataPath, "utf-8"),
    ]);

    const metadata = JSON.parse(metadataJson);
    const designInfo = metadata.designs.find((d: { id: string }) => d.id === designId);

    if (!designInfo) {
      throw new Error(`Design with id "${designId}" not found`);
    }

    return {
      id: designId,
      name: designInfo.name,
      content,
    };
  } catch (error) {
    throw new Error(`Failed to load design: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}