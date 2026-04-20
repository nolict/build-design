import type {
  ComponentSpec,
  ComponentState,
  DesignBlock,
  DesignSection,
  MarkdownKeyValue,
  MarkdownTable,
  NamedValueItem,
  ParsedDesignData,
} from "@/types/design";

function normalizeText(value: string): string {
  return value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value: string): string {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanHeading(value: string): string {
  return normalizeText(value.replace(/^\d+(\.\d+)?\s*/, ""));
}

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return cleanHeading(match?.[1] ?? "Design System Specification");
}

function extractSectionEntries(content: string, level: number): Array<{ title: string; body: string }> {
  const lines = content.split("\n");
  const entries: Array<{ title: string; body: string }> = [];
  const prefix = "#".repeat(level);
  let currentTitle = "";
  let buffer: string[] = [];

  for (const line of lines) {
    if (line.startsWith(`${prefix} `)) {
      if (currentTitle) {
        entries.push({ title: currentTitle, body: buffer.join("\n").trim() });
      }
      currentTitle = cleanHeading(line.slice(level + 1));
      buffer = [];
      continue;
    }

    if (currentTitle) {
      buffer.push(line);
    }
  }

  if (currentTitle) {
    entries.push({ title: currentTitle, body: buffer.join("\n").trim() });
  }

  return entries;
}

function isTableSeparator(line: string): boolean {
  return /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/.test(line);
}

function parseTable(lines: string[]): MarkdownTable | null {
  const tableLines = lines.filter((line) => line.includes("|"));
  if (tableLines.length < 2 || !isTableSeparator(tableLines[1])) {
    return null;
  }

  const headers = tableLines[0]
    .split("|")
    .map((part) => normalizeText(part))
    .filter(Boolean);

  const rows = tableLines.slice(2).map((line) => {
    const values = line
      .split("|")
      .map((part) => normalizeText(part));

    if (values[0] === "") {
      values.shift();
    }

    if (values[values.length - 1] === "") {
      values.pop();
    }

    return headers.reduce<Record<string, string>>((record, header, index) => {
      record[header] = values[index] ?? "";
      return record;
    }, {});
  });

  return { headers, rows };
}

function parseList(lines: string[]): DesignBlock | null {
  const items = lines
    .map((line) => line.trim())
    .map((line) => line.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, ""))
    .map((line) => normalizeText(line))
    .filter(Boolean);

  if (items.length === 0) {
    return null;
  }

  return {
    type: "list",
    list: {
      ordered: /^\s*\d+\.\s+/.test(lines[0] ?? ""),
      items,
    },
  };
}

function parseBlocks(content: string): DesignBlock[] {
  const lines = content.split("\n");
  const blocks: DesignBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const currentLine = lines[index]?.trim() ?? "";

    if (!currentLine) {
      index += 1;
      continue;
    }

    if (currentLine.startsWith("### ")) {
      index += 1;
      continue;
    }

    if (currentLine.includes("|") && index + 1 < lines.length && isTableSeparator(lines[index + 1] ?? "")) {
      const tableLines: string[] = [];
      while (index < lines.length && lines[index].includes("|")) {
        tableLines.push(lines[index]);
        index += 1;
      }
      const table = parseTable(tableLines);
      if (table) {
        blocks.push({ type: "table", table });
      }
      continue;
    }

    if (/^\s*[-*+]\s+/.test(lines[index]) || /^\s*\d+\.\s+/.test(lines[index])) {
      const listLines: string[] = [];
      while (
        index < lines.length &&
        ( /^\s*[-*+]\s+/.test(lines[index]) ||
          /^\s*\d+\.\s+/.test(lines[index]) ||
          /^\s{2,}[-*+]\s+/.test(lines[index]) )
      ) {
        listLines.push(lines[index]);
        index += 1;
      }
      const listBlock = parseList(listLines);
      if (listBlock) {
        blocks.push(listBlock);
      }
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].startsWith("### ") &&
      !(lines[index].includes("|") && index + 1 < lines.length && isTableSeparator(lines[index + 1] ?? "")) &&
      !/^\s*[-*+]\s+/.test(lines[index]) &&
      !/^\s*\d+\.\s+/.test(lines[index])
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    const text = normalizeText(paragraphLines.join(" "));
    if (text) {
      blocks.push({ type: "paragraph", text });
    }
  }

  return blocks;
}

function buildSection(title: string, body: string, order: number): DesignSection {
  const subsectionEntries = extractSectionEntries(body, 3);
  const sectionBody = subsectionEntries.length > 0
    ? body.split(/^###\s+/m)[0]?.trim() ?? ""
    : body;

  return {
    id: slugify(title),
    title,
    level: 2,
    order,
    blocks: parseBlocks(sectionBody),
    subsections: subsectionEntries.map((entry, index) => ({
      id: `${slugify(title)}-${slugify(entry.title)}`,
      title: entry.title,
      level: 3,
      order: index,
      blocks: parseBlocks(entry.body),
      subsections: [],
    })),
  };
}

function getParagraphs(section: DesignSection | undefined): string[] {
  if (!section) {
    return [];
  }

  return section.blocks
    .filter((block): block is Extract<DesignBlock, { type: "paragraph" }> => block.type === "paragraph")
    .map((block) => block.text);
}

function getListItems(section: DesignSection | undefined): string[] {
  if (!section) {
    return [];
  }

  return section.blocks
    .filter((block): block is Extract<DesignBlock, { type: "list" }> => block.type === "list")
    .flatMap((block) => block.list.items);
}

function getSectionText(section: DesignSection | undefined): string[] {
  if (!section) {
    return [];
  }

  const blockText = section.blocks.flatMap((block) => {
    if (block.type === "paragraph") {
      return [block.text];
    }

    if (block.type === "list") {
      return block.list.items;
    }

    return [];
  });

  return [
    ...blockText,
    ...section.subsections.flatMap((subsection) => getSectionText(subsection)),
  ];
}

function findFirstTable(section: DesignSection | undefined): MarkdownTable | null {
  if (!section) {
    return null;
  }

  return (
    section.blocks.find((block): block is Extract<DesignBlock, { type: "table" }> => block.type === "table")?.table ??
    section.subsections.find((subsection) => findFirstTable(subsection) !== null)?.blocks.find((block): block is Extract<DesignBlock, { type: "table" }> => block.type === "table")?.table ??
    null
  );
}

function collectTables(section: DesignSection | undefined): MarkdownTable[] {
  if (!section) {
    return [];
  }

  return [
    ...section.blocks
      .filter((block): block is Extract<DesignBlock, { type: "table" }> => block.type === "table")
      .map((block) => block.table),
    ...section.subsections.flatMap((subsection) => collectTables(subsection)),
  ];
}

function rowValue(row: Record<string, string>, keys: string[]): string {
  const normalizedMap = Object.entries(row).reduce<Record<string, string>>((accumulator, [key, value]) => {
    accumulator[slugify(key)] = value;
    return accumulator;
  }, {});

  for (const key of keys) {
    const hit = normalizedMap[slugify(key)];
    if (hit) {
      return hit;
    }
  }

  return "";
}

function parseNamedValueRows(table: MarkdownTable | null, nameKeys: string[], valueKeys: string[], contextKeys: string[]): NamedValueItem[] {
  if (!table) {
    return [];
  }

  return table.rows.map((row) => ({
    name: rowValue(row, nameKeys),
    value: rowValue(row, valueKeys),
    context: rowValue(row, contextKeys),
  })).filter((item) => item.name || item.value || item.context);
}

function parseColorTokens(section: DesignSection | undefined): ParsedDesignData["colorArchitecture"]["tokens"] {
  const tables = collectTables(section);
  if (tables.length === 0) {
    return [];
  }

  return tables.flatMap((table) => table.rows.map((row) => ({
    token: rowValue(row, ["Token Name", "Token", "Name", "Color"]),
    value: rowValue(row, ["Hex Code", "Hex", "Value"]),
    usage: rowValue(row, ["Usage Context", "Role", "Usage", "Use"]),
    evidence: rowValue(row, ["Scan Reference", "Scan Evidence", "Evidence", "Notes"]),
  }))).filter((item) => item.token || item.value || item.usage || item.evidence);
}

function parseTypographyStyles(section: DesignSection | undefined): ParsedDesignData["typography"]["styles"] {
  const table = findFirstTable(section);
  if (!table) {
    return [];
  }

  return table.rows.map((row) => ({
    style: rowValue(row, ["Style Name", "Style", "Role"]),
    element: rowValue(row, ["Element Tag", "Element", "Tag"]),
    size: rowValue(row, ["Size", "Font Size"]),
    weight: rowValue(row, ["Weight", "Font Weight"]),
    lineHeight: rowValue(row, ["Line Height (Leading)", "Line Height", "Leading"]),
    letterSpacing: rowValue(row, ["Letter Spacing (Tracking)", "Letter Spacing", "Tracking"]),
    color: rowValue(row, ["Color Reference", "Color Token", "Color"]),
    notes: rowValue(row, ["Notes", "Usage"]),
  })).filter((item) => Object.values(item).some(Boolean));
}

function parseKeyValueLine(value: string): MarkdownKeyValue | null {
  const pair = normalizeText(value).match(/^([^:]+):\s*(.+)$/);
  if (!pair) {
    return null;
  }

  return {
    key: pair[1].trim(),
    value: pair[2].trim(),
  };
}

function parseComponentStates(pairs: MarkdownKeyValue[]): ComponentState[] {
  return pairs
    .filter((pair) => /^(default|hover|active|focus|transition|content)$/i.test(pair.key))
    .map((pair) => ({
      name: pair.key,
      value: pair.value,
    }));
}

function parseComponents(section: DesignSection | undefined): ComponentSpec[] {
  if (!section) {
    return [];
  }

  return section.subsections.map((subsection) => {
    const table = findFirstTable(subsection);
    const metadata = subsection.blocks
      .filter((block): block is Extract<DesignBlock, { type: "list" }> => block.type === "list")
      .flatMap((block) => block.list.items)
      .map((item) => parseKeyValueLine(item))
      .filter((item): item is MarkdownKeyValue => item !== null);

    const paragraphs = getParagraphs(subsection);
    const tableStates = table?.rows.map((row) => {
      const name = rowValue(row, ["State", "Element", "Name"]);
      const value = Object.entries(row)
        .filter(([key]) => !/^(state|element|name)$/i.test(key))
        .map(([key, itemValue]) => `${key}: ${itemValue}`)
        .join(", ");

      return { name, value };
    }).filter((state) => state.name && state.value) ?? [];

    const states = tableStates.length > 0 ? tableStates : parseComponentStates(metadata);
    const componentMetadata = metadata.filter((pair) => !/^(default|hover|active|focus|transition|content)$/i.test(pair.key));
    const notes = [
      ...paragraphs.slice(1),
      ...subsection.blocks
        .filter((block): block is Extract<DesignBlock, { type: "list" }> => block.type === "list")
        .flatMap((block) => block.list.items)
        .filter((item) => parseKeyValueLine(item) === null),
    ];

    return {
      name: subsection.title.replace(/^State Matrix:\s*/i, "").trim(),
      summary: paragraphs[0] ?? "",
      metadata: componentMetadata,
      states,
      notes,
    };
  }).filter((component) => component.name);
}

function findSectionByMatcher(sections: DesignSection[], matcher: RegExp): DesignSection | undefined {
  return sections.find((section) => matcher.test(section.title));
}

export function parseDesignMarkdown(content: string): ParsedDesignData {
  const title = extractTitle(content);
  const sectionEntries = extractSectionEntries(content, 2);
  const sections = sectionEntries.map((entry, index) => buildSection(entry.title, entry.body, index));

  const overviewSection = findSectionByMatcher(sections, /visual theme|theme|atmosphere/i);
  const colorSection = findSectionByMatcher(sections, /color/i);
  const typographySection = findSectionByMatcher(sections, /typography/i);
  const layoutSection = findSectionByMatcher(sections, /layout|spacing/i);
  const componentSection = findSectionByMatcher(sections, /component/i);
  const motionSection = findSectionByMatcher(sections, /depth|motion|elevation/i);
  const interactionSection = findSectionByMatcher(sections, /interaction|guideline/i);
  const responsiveSection = findSectionByMatcher(sections, /responsive/i);
  const iterationSection = findSectionByMatcher(sections, /iteration|handover|maintenance/i);

  const spacingSection = layoutSection?.subsections.find((subsection) => /spacing/i.test(subsection.title));
  const zIndexSection = layoutSection?.subsections.find((subsection) => /z-index/i.test(subsection.title));
  const breakpointSection = responsiveSection?.subsections.find((subsection) => /breakpoint/i.test(subsection.title));
  const adaptiveSection = responsiveSection?.subsections.find((subsection) => /adaptive/i.test(subsection.title));
  const shadowSection = motionSection?.subsections.find((subsection) => /shadow/i.test(subsection.title));
  const timingSection = motionSection?.subsections.find((subsection) => /timing|easing/i.test(subsection.title));

  return {
    title,
    sections,
    overview: {
      title: overviewSection?.title ?? title,
      paragraphs: getParagraphs(overviewSection),
      highlights: getListItems(overviewSection),
    },
    colorArchitecture: {
      tokens: parseColorTokens(colorSection),
      notes: getParagraphs(colorSection),
    },
    typography: {
      notes: getParagraphs(typographySection),
      styles: parseTypographyStyles(typographySection),
    },
    layout: {
      spacing: parseNamedValueRows(findFirstTable(spacingSection ?? layoutSection), ["Token", "Name", "Level"], ["Value", "Value (px)", "Width"], ["Usage", "Use", "Intent", "Scan Evidence"]),
      zIndex: parseNamedValueRows(findFirstTable(zIndexSection), ["Layer", "Name"], ["Value", "Level"], ["Usage", "Use"]),
      notes: getSectionText(layoutSection),
    },
    components: parseComponents(componentSection),
    motion: {
      shadows: parseNamedValueRows(findFirstTable(shadowSection ?? motionSection), ["Elevation", "Level", "Name"], ["Value", "Shadow"], ["Use", "Usage", "Context"]),
      timings: parseNamedValueRows(findFirstTable(timingSection), ["Transition", "Motion", "Name"], ["Value", "Timing", "Easing"], ["Use", "Usage", "Context"]),
      notes: getSectionText(motionSection),
    },
    interaction: {
      guidelines: getListItems(interactionSection),
    },
    responsive: {
      breakpoints: (findFirstTable(breakpointSection ?? responsiveSection)?.rows ?? []).map((row) => ({
        name: rowValue(row, ["Breakpoint", "Name", "Device"]),
        width: rowValue(row, ["Width (px)", "Width", "Range"]),
        adaptation: rowValue(row, ["Layout Adaptation", "Adaptation", "Changes"]),
        fontScaling: rowValue(row, ["Font Scaling", "Font", "Typography"]),
      })).filter((item) => Object.values(item).some(Boolean)),
      adaptiveRules: [
        ...getListItems(adaptiveSection),
        ...getParagraphs(adaptiveSection),
      ],
    },
    iteration: {
      guidelines: getListItems(iterationSection),
    },
    additionalSections: sections.filter((section) => ![
      overviewSection?.id,
      colorSection?.id,
      typographySection?.id,
      layoutSection?.id,
      componentSection?.id,
      motionSection?.id,
      interactionSection?.id,
      responsiveSection?.id,
      iterationSection?.id,
    ].includes(section.id)),
  };
}
