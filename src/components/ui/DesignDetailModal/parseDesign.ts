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
  const dataLines = lines.slice(2);
  return dataLines.map((line) => {
    // Split by | and remove empty strings from ends
    const values = line.split("|")
      .map((v) => v.trim());
    
    // If the line started and ended with |, shift/pop to remove empty strings
    if (values[0] === "") values.shift();
    if (values[values.length - 1] === "") values.pop();

    const row: TableRow = {};
    headers.forEach((header, i) => {
      row[header] = values[i] || "";
    });
    return row;
  });
}

function parseListColors(text: string): { name: string, hex: string, intent: string }[] {
  const colors: { name: string, hex: string, intent: string }[] = [];
  const lines = text.split("\n");
  
  for (const line of lines) {
    // Match patterns like: * **Primary Color** (#000000): Description
    // or * Primary Color (#000000)
    const match = line.match(/\*\s+\*?\*(.*?)\*?\*\s+\((#?[a-fA-F0-9]{3,8})\)(?::\s*(.*))?/);
    if (match) {
      colors.push({
        name: match[1].trim(),
        hex: match[2].trim(),
        intent: (match[3] || "").trim()
      });
    } else {
      // Try a simpler match: * Color Name: #hex
      const simpleMatch = line.match(/\*\s+(.*?):\s+(#?[a-fA-F0-9]{3,8})/);
      if (simpleMatch) {
        colors.push({
          name: simpleMatch[1].trim(),
          hex: simpleMatch[2].trim(),
          intent: ""
        });
      }
    }
  }
  return colors;
}

export function parseDesignMarkdown(content: string): ParsedDesignData {
  const sections = content.split(/^##\s+/m).filter(Boolean);
  
  const data: ParsedDesignData = {
    atmosphere: { title: "", description: "", paragraphs: [], keyCharacteristics: [] },
    colors: { primary: [], secondary: [], surface: [], semantic: [], gradients: [] },
    typography: { fontFamily: "", hierarchy: [] },
    components: [],
    layout: { spacing: [], borderRadius: [] },
    elevation: [],
    dosAndDonts: { do: [], dont: [] },
    responsive: { breakpoints: [] },
    prompts: []
  };

  for (const section of sections) {
    const lines = section.split("\n");
    const rawTitle = lines[0].trim();
    // Remove numbers from title like "1. Visual Theme" -> "Visual Theme"
    const title = rawTitle.replace(/^\d+\.\s*/, "");
    const body = lines.slice(1).join("\n");

    // 1. Visual Theme & Atmosphere
    if (title.match(/Visual Theme|Atmosphere/i)) {
      const paragraphs = body.split("\n\n").map(p => p.trim()).filter(p => p && !p.startsWith("*") && !p.startsWith("-"));
      data.atmosphere.paragraphs = paragraphs;
      data.atmosphere.description = paragraphs[0] || "";
      
      const charMatches = body.match(/\* (.*)/g);
      if (charMatches) {
        data.atmosphere.keyCharacteristics = charMatches.map(m => m.replace(/^\* /, "").trim());
      }
    }

    // 2. Color Palette & Roles
    if (title.match(/Color Palette|Colors/i)) {
      const subSections = body.split(/^###\s+/m).filter(Boolean);
      for (const sub of subSections) {
        const subLines = sub.split("\n");
        const subTitle = subLines[0].trim().toLowerCase();
        const subBody = subLines.slice(1).join("\n");
        
        let extractedColors = [];
        if (subBody.includes("|")) {
          const tableRows = parseTable(subBody);
          extractedColors = tableRows.map(row => ({
            name: row.Name || row.name || row.Color || row.color || "",
            hex: row.Hex || row.hex || row.Value || row.value || "",
            intent: row.Intent || row.intent || row.Notes || row.notes || row.Use || row.use || ""
          }));
        } else {
          extractedColors = parseListColors(subBody);
        }

        if (subTitle.includes("primary")) data.colors.primary = extractedColors;
        else if (subTitle.includes("secondary") || subTitle.includes("accent")) data.colors.secondary.push(...extractedColors);
        else if (subTitle.includes("surface") || subTitle.includes("background")) data.colors.surface.push(...extractedColors);
        else if (subTitle.includes("semantic") || subTitle.includes("success") || subTitle.includes("error")) data.colors.semantic?.push(...extractedColors);
        else if (subTitle.includes("gradient")) data.colors.gradients?.push(...extractedColors);
      }
    }

    // 3. Typography Rules
    if (title.match(/Typography/i)) {
      const fontMatch = body.match(/Primary Font:?\s*\*?\*?(.*?)\*?\*?$/m);
      if (fontMatch) data.typography.fontFamily = fontMatch[1].trim();

      if (body.includes("|")) {
        data.typography.hierarchy = parseTable(body).map(row => ({
          role: row.Role || row.role || row.Level || row.level || "",
          size: row.Size || row.size || row["Font Size"] || row["font-size"] || "",
          weight: row.Weight || row.weight || row["Font Weight"] || row["font-weight"] || "",
          lineHeight: row.LineHeight || row.lineheight || row["Line Height"] || row["line-height"] || "",
          spacing: row.Spacing || row.spacing || row["Letter Spacing"] || row["letter-spacing"] || ""
        }));
      }
    }

    // 4. Component Stylings / Architecture
    if (title.match(/Component (Stylings|Architecture)/i)) {
      const componentMatches = body.split(/^###\s+/m).filter(Boolean);
      for (const compSub of componentMatches) {
        const compLines = compSub.split("\n");
        const name = compLines[0].trim();
        const tableText = compLines.slice(1).join("\n");
        const rows = parseTable(tableText);
        if (rows.length > 0) {
          const properties: Record<string, string> = {};
          rows.forEach((row) => {
            let key = (row.Property || row.property || "").toLowerCase().trim();
            // Map common names to standard CSS keys
            if (key === "background") key = "background-color";
            if (key === "color") key = "text-color";
            
            const standardKey = key.replace(/\s+/g, "-");
            const value = row.Value || row.value || "";
            if (standardKey) properties[standardKey] = value;
          });
          data.components.push({ name, properties });
        }
      }
    }

    // 5. Layout Principles
    if (title.match(/Layout Principles/i)) {
      const subSections = body.split(/^###\s+/m).filter(Boolean);
      for (const sub of subSections) {
        const subLines = sub.split("\n");
        const subTitle = subLines[0].trim().toLowerCase();
        const subBody = subLines.slice(1).join("\n");

        if (subTitle.includes("spacing") && subBody.includes("|")) {
          data.layout.spacing = parseTable(subBody).map(row => ({
            token: row.Token || row.token || row.Level || row.level || "",
            value: row.Value || row.value || "",
            intent: row.Use || row.use || row.Intent || row.intent || ""
          }));
        }
        if (subTitle.includes("radius") && subBody.includes("|")) {
          data.layout.borderRadius = parseTable(subBody).map(row => ({
            token: row.Token || row.token || row.Level || row.level || "",
            value: row.Value || row.value || row.Context || row.context || "",
            intent: ""
          }));
        }
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

    // 7. Do's and Don'ts
    if (title.match(/Do's and Don'ts/i)) {
      const subSections = body.split(/^###\s+/m).filter(Boolean);
      for (const sub of subSections) {
        const subLines = sub.split("\n");
        const subTitle = subLines[0].trim().toLowerCase();
        const subBody = subLines.slice(1).join("\n");
        const items = subBody.match(/\* (.*)/g)?.map(m => m.replace(/^\* /, "").trim()) || [];
        
        if (subTitle.startsWith("do")) data.dosAndDonts.do = items;
        else if (subTitle.startsWith("don't") || subTitle.startsWith("dont")) data.dosAndDonts.dont = items;
      }
    }

    // 8. Responsive Behavior
    if (title.match(/Responsive Behavior/i)) {
      if (body.includes("|")) {
        data.responsive.breakpoints = parseTable(body).map(row => ({
          name: row.Name || row.name || row.Breakpoint || row.breakpoint || "",
          width: row.Width || row.width || row.Value || row.value || "",
          changes: row["Key Changes"] || row.changes || ""
        }));
      }
    }

    // 9. Agent Prompt Guide / Developer Handover
    if (title.match(/Prompt Guide|Developer Handover/i)) {
      const promptMatches = body.matchAll(/- "(.*?)"/g);
      for (const match of promptMatches) {
        data.prompts.push({
          title: "Prompt",
          prompt: match[1]
        });
      }
      
      // Also catch the new structure
      const listMatches = body.matchAll(/\* "(.*?)"/g);
      for (const match of listMatches) {
        data.prompts.push({
          title: "Prompt",
          prompt: match[1]
        });
      }
    }
  }

  return data;
}
