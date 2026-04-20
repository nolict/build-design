export interface DesignData {
  id: string;
  name: string;
  content: string;
}

export interface MarkdownTable {
  headers: string[];
  rows: Record<string, string>[];
}

export interface MarkdownList {
  ordered: boolean;
  items: string[];
}

export interface MarkdownKeyValue {
  key: string;
  value: string;
}

export interface DesignTextBlock {
  type: "paragraph";
  text: string;
}

export interface DesignListBlock {
  type: "list";
  list: MarkdownList;
}

export interface DesignTableBlock {
  type: "table";
  table: MarkdownTable;
}

export type DesignBlock = DesignTextBlock | DesignListBlock | DesignTableBlock;

export interface DesignSection {
  id: string;
  title: string;
  level: number;
  order: number;
  blocks: DesignBlock[];
  subsections: DesignSection[];
}

export interface ColorToken {
  token: string;
  value: string;
  usage: string;
  evidence: string;
}

export interface TypographyStyle {
  style: string;
  element: string;
  size: string;
  weight: string;
  lineHeight: string;
  letterSpacing: string;
  color: string;
  notes: string;
}

export interface NamedValueItem {
  name: string;
  value: string;
  context: string;
}

export interface ComponentState {
  name: string;
  value: string;
}

export interface ComponentSpec {
  name: string;
  summary: string;
  metadata: MarkdownKeyValue[];
  states: ComponentState[];
  notes: string[];
}

export interface ResponsiveBreakpoint {
  name: string;
  width: string;
  adaptation: string;
  fontScaling: string;
}

export interface ParsedDesignData {
  title: string;
  sections: DesignSection[];
  overview: {
    title: string;
    paragraphs: string[];
    highlights: string[];
  };
  colorArchitecture: {
    tokens: ColorToken[];
    notes: string[];
  };
  typography: {
    notes: string[];
    styles: TypographyStyle[];
  };
  layout: {
    spacing: NamedValueItem[];
    zIndex: NamedValueItem[];
    notes: string[];
  };
  components: ComponentSpec[];
  motion: {
    shadows: NamedValueItem[];
    timings: NamedValueItem[];
    notes: string[];
  };
  interaction: {
    guidelines: string[];
  };
  responsive: {
    breakpoints: ResponsiveBreakpoint[];
    adaptiveRules: string[];
  };
  iteration: {
    guidelines: string[];
  };
  additionalSections: DesignSection[];
}
