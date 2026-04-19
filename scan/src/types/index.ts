export interface ComponentStyle {
  tag: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  textTransform: string;
  color: string;
  backgroundColor: string;
  padding: string;
  margin: string;
  borderRadius: string;
  border: string;
  boxShadow: string;
  display: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  opacity?: string;
  transition?: string;
  width?: number;
  height?: number;
  backgroundImage?: string;
}

export interface ViewportScan {
  width: number;
  components: {
    nav: ComponentStyle | null;
    hero: ComponentStyle | null;
    buttons: ComponentStyle[];
    inputs: ComponentStyle[];
    cards: ComponentStyle[];
    featured: { tag: string; style: ComponentStyle }[];
    body?: ComponentStyle | null;
    typography: { tag: string; style: ComponentStyle }[];
  };
}

export interface GlobalDesignData {
  title: string;
  variables: Record<string, string>;
  allColors: string[];
  allBgs: string[];
  allRadius: string[];
  allShadows: string[];
}

export interface FullDesignTokens {
  viewports: ViewportScan[];
  globalData: GlobalDesignData;
}
