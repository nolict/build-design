import type { ColorItem, TypographyItem, ComponentItem, ParsedDesignData } from "@/types/design";

interface TableRow {
  [key: string]: string;
}

function parseTable(tableText: string): TableRow[] {
  const lines = tableText.trim().split("\n").filter((line) => line.includes("|"));
  const headers = lines[0]
    .split("|")
    .map((h) => h.trim())
    .filter(Boolean);

  return lines.slice(2).map((line) => {
    const values = line.split("|").map((v) => v.trim()).filter(Boolean);
    const row: TableRow = {};
    headers.forEach((header, i) => {
      row[header] = values[i] || "";
    });
    return row;
  });
}

export function parseDesignMarkdown(content: string): ParsedDesignData {
  const sections = content.split(/^##\s+/m).filter(Boolean);
  
  const colors: ParsedDesignData["colors"] = {
    primary: [],
    secondary: [],
    surface: [],
  };
  
  let typography: TypographyItem[] = [];
  let components: ComponentItem[] = [];

  for (const section of sections) {
    const lines = section.split("\n");
    const title = lines[0].trim();
    const body = lines.slice(1).join("\n");

    if (title.includes("Color Palette")) {
      const primaryMatch = body.match(/### Primary[\s\S]*?\|[\s\S]*?\|[\s\S]*?\|/);
      const secondaryMatch = body.match(/### Secondary[\s\S]*?\|[\s\S]*?\|[\s\S]*?\|/);
      const surfaceMatch = body.match(/### Surface[\s\S]*?\|[\s\S]*?\|[\s\S]*?\|/);

      if (primaryMatch) {
        const rows = parseTable(primaryMatch[0]);
        colors.primary = rows.map((row) => ({
          name: row.Name || row.name || "",
          hex: row.Hex || row.hex || "",
          intent: row.Intent || row.intent || "",
        }));
      }

      if (secondaryMatch) {
        const rows = parseTable(secondaryMatch[0]);
        colors.secondary = rows.map((row) => ({
          name: row.Name || row.name || "",
          hex: row.Hex || row.hex || "",
          intent: row.Intent || row.intent || "",
        }));
      }

      if (surfaceMatch) {
        const rows = parseTable(surfaceMatch[0]);
        colors.surface = rows.map((row) => ({
          name: row.Name || row.name || "",
          hex: row.Hex || row.hex || "",
          intent: row.Intent || row.intent || "",
        }));
      }
    }

    if (title.includes("Typography")) {
      const tableMatch = body.match(/\|[\s\S]*?\|[\s\S]*?\|[\s\S]*?\|[\s\S]*?\|[\s\S]*?\|/);
      if (tableMatch) {
        const rows = parseTable(tableMatch[0]);
        typography = rows.map((row) => ({
          role: row.Role || row.role || "",
          size: row.Size || row.size || "",
          weight: row.Weight || row.weight || "",
          lineHeight: row.LineHeight || row.lineHeight || "",
          spacing: row.Spacing || row.spacing || "",
        }));
      }
    }

    if (title.includes("Component Architecture")) {
      const componentMatches = body.matchAll(/### (\w+)\n([\s\S]*?)(?=###|\n##)/g);
      for (const match of componentMatches) {
        const name = match[1];
        const tableText = match[2];
        const tableMatch = tableText.match(/\|[\s\S]*?\|[\s\S]*?\|/);
        if (tableMatch) {
          const rows = parseTable(tableMatch[0]);
          const properties: Record<string, string> = {};
          rows.forEach((row) => {
            const key = row.Property || row.property || "";
            const value = row.Value || row.value || "";
            if (key) properties[key] = value;
          });
          components.push({ name, properties });
        }
      }
    }
  }

  return { colors, typography, components };
}