export interface ColorItem {
  name: string;
  hex: string;
  intent: string;
}

export interface TypographyItem {
  role: string;
  size: string;
  weight: string;
  lineHeight: string;
  spacing: string;
}

export interface ComponentItem {
  name: string;
  properties: Record<string, string>;
}

export interface LayoutItem {
  token: string;
  value: string;
  intent: string;
}

export interface ElevationItem {
  level: string;
  shadow: string;
  use: string;
}

export interface AIPromptItem {
  title: string;
  prompt: string;
}

export interface DesignData {
  id: string;
  name: string;
  content: string;
}

export interface ResponsiveBreakpoint {
  name: string;
  width: string;
  changes: string;
}

export interface ParsedDesignData {
  atmosphere: {
    title: string;
    description: string;
    paragraphs: string[];
    keyCharacteristics: string[];
  };
  colors: {
    primary: ColorItem[];
    secondary: ColorItem[];
    surface: ColorItem[];
    semantic?: ColorItem[];
    gradients?: ColorItem[];
  };
  typography: {
    fontFamily: string;
    hierarchy: TypographyItem[];
  };
  components: ComponentItem[];
  layout: {
    spacing: LayoutItem[];
    borderRadius: LayoutItem[];
  };
  elevation: ElevationItem[];
  dosAndDonts: {
    do: string[];
    dont: string[];
  };
  responsive: {
    breakpoints: ResponsiveBreakpoint[];
  };
  prompts: AIPromptItem[];
}
