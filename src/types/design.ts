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

export interface DesignData {
  id: string;
  name: string;
  content: string;
}

export interface ParsedDesignData {
  colors: {
    primary: ColorItem[];
    secondary: ColorItem[];
    surface: ColorItem[];
  };
  typography: TypographyItem[];
  components: ComponentItem[];
}
