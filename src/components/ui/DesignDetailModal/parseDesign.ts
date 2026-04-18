import type { 
  ParsedDesignData,
} from "@/types/design";

interface TableRow {
  [key: string]: string;
}

function parseTable(tableText: string): TableRow[] {
  const lines = tableText.trim().split("\n").filter((line) => line.includes("|"));
  if (lines.length < 2) return [];

  const headers = lines[0]
    .split("|")
    .map((h) => h.trim())
    .filter(Boolean);

  // Skip headers and separator line
  return lines.slice(2).map((line) => {
    const values = line.split("|").map((v) => v.trim()).filter((v, i) => i > 0 || v !== "");
    const row: TableRow = {};
    headers.forEach((header, i) => {
      row[header] = values[i] || "";
    });
    return row;
  });
}

export function parseDesignMarkdown(content: string): ParsedDesignData {
  const sections = content.split(/^##\s+/m).filter(Boolean);
  
  const data: ParsedDesignData = {
    atmosphere: { title: "", description: "", paragraphs: [] },
    colors: { primary: [], secondary: [], surface: [] },
    typography: { fontFamily: "", hierarchy: [] },
    components: [],
    layout: { spacing: [], borderRadius: [] },
    elevation: [],
    prompts: []
  };

  for (const section of sections) {
    const lines = section.split("\n");
    const title = lines[0].trim();
    const body = lines.slice(1).join("\n");

    // 1. Visual Theme & Atmosphere
    if (title.match(/Visual Theme|Atmosphere/i)) {
      const paragraphs = body.split("\n\n").map(p => p.trim()).filter(p => p && !p.startsWith("-"));
      data.atmosphere.paragraphs = paragraphs;
      // Heuristic: first paragraph is often a summary
      data.atmosphere.description = paragraphs[0] || "";
    }

    // 2. Color Palette & Roles
    if (title.match(/Color Palette|Colors/i)) {
      const primaryMatch = body.match(/### Primary[\s\S]*?(\|[\s\S]*?\|)/);
      const secondaryMatch = body.match(/### (?:Secondary|Accent)[\s\S]*?(\|[\s\S]*?\|)/);
      const surfaceMatch = body.match(/### (?:Surface|Background)[\s\S]*?(\|[\s\S]*?\|)/);

      if (primaryMatch) {
        data.colors.primary = parseTable(body.split("### Primary")[1].split("###")[0]).map(row => ({
          name: row.Name || row.name || "",
          hex: row.Hex || row.hex || "",
          intent: row.Intent || row.intent || ""
        }));
      }
      if (secondaryMatch) {
        data.colors.secondary = parseTable(body.split(/### (?:Secondary|Accent)/)[1].split("###")[0]).map(row => ({
          name: row.Name || row.name || "",
          hex: row.Hex || row.hex || "",
          intent: row.Intent || row.intent || ""
        }));
      }
      if (surfaceMatch) {
        data.colors.surface = parseTable(body.split(/### (?:Surface|Background)/)[1].split("###")[0]).map(row => ({
          name: row.Name || row.name || "",
          hex: row.Hex || row.hex || "",
          intent: row.Intent || row.intent || ""
        }));
      }
    }

    // 3. Typography Rules
    if (title.match(/Typography/i)) {
      const fontMatch = body.match(/Font Family:?\s*(?:\()?(.*?)(?:\))?$/m);
      if (fontMatch) data.typography.fontFamily = fontMatch[1];

      const tableMatch = body.match(/\|[\s\S]*?\|/);
      if (tableMatch) {
        data.typography.hierarchy = parseTable(body).map(row => ({
          role: row.Role || row.role || "",
          size: row.Size || row.size || "",
          weight: row.Weight || row.weight || "",
          lineHeight: row.LineHeight || row.lineheight || row["Line Height"] || "",
          spacing: row.Spacing || row.spacing || ""
        }));
      }
    }

    // 4. Component Architecture
    if (title.match(/Component Architecture/i)) {
      const componentMatches = body.matchAll(/### (\w+)\n([\s\S]*?)(?=###|\n##|$)/g);
      for (const match of componentMatches) {
        const name = match[1];
        const tableText = match[2];
        const rows = parseTable(tableText);
        if (rows.length > 0) {
          const properties: Record<string, string> = {};
          rows.forEach((row) => {
            const key = row.Property || row.property || "";
            const value = row.Value || row.value || "";
            if (key) properties[key] = value;
          });
          data.components.push({ name, properties });
        }
      }
    }

    // 5. Layout Principles
    if (title.match(/Layout Principles/i)) {
      const spacingMatch = body.match(/### Spacing[\s\S]*?(\|[\s\S]*?\|)/);
      const radiusMatch = body.match(/### Border Radius[\s\S]*?(\|[\s\S]*?\|)/);

      if (spacingMatch) {
        data.layout.spacing = parseTable(body.split("### Spacing")[1].split("###")[0]).map(row => ({
          token: row.Token || row.token || "",
          value: row.Value || row.value || "",
          intent: row.Intent || row.intent || ""
        }));
      }
      if (radiusMatch) {
        data.layout.borderRadius = parseTable(body.split("### Border Radius")[1].split("###")[0]).map(row => ({
          token: row.Token || row.token || "",
          value: row.Value || row.value || "",
          intent: row.Intent || row.intent || ""
        }));
      }
    }

    // 6. Depth & Elevation
    if (title.match(/Depth|Elevation/i)) {
      data.elevation = parseTable(body).map(row => ({
        level: row.Level || row.level || "",
        shadow: row.Shadow || row.shadow || "",
        use: row.Use || row.use || ""
      }));
    }

    // 9. Developer Handover / AI Prompts
    if (title.match(/Developer Handover|AI Prompts/i)) {
      const promptMatches = body.matchAll(/- (.*?)\n\s*```[\s\S]*?```/g);
      for (const match of promptMatches) {
        data.prompts.push({
          title: match[1],
          prompt: match[0].split("```")[1].trim()
        });
      }
    }
  }

  return data;
}
