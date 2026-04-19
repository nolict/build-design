import OpenAI from 'openai';
import fs from 'fs';
import { log } from '../utils/logger';
import type { FullDesignTokens } from '../types';

export class DesignArchitect {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      baseURL: 'https://integrate.api.nvidia.com/v1',
      apiKey: apiKey
    });
  }

  async generate(data: FullDesignTokens): Promise<void> {
    log('Status', 'Architect is synthesizing architectural design DNA');
    log('Status', 'Mapping visual hierarchy and semantic roles');

    const prompt = `
      You are a World-Class Design Systems Architect. Your mission is to conduct a DEEP AUDIT of a website's visual DNA and generate a professional DESIGN.md.
      The goal is to match the structural depth and technical precision of the "Binance/Linear/Apple" design systems perfectly.

      RAW SCAN DATA: ${JSON.stringify(data)}

      STRICT AUDIT RULES:
      1. TONALITY: Highly technical, editorial, and analytical. Use terms like "Chrono-Spatial Layout", "Optical Restraint", "Chromatic Depth", "Visual Cadence".
      2. ZERO "NOT DEFINED": If data is sparse, use your design expertise to INFER the most likely intent based on available tokens.
      3. COMPONENT ANALYSIS: Build a detailed technical TABLE for EACH component group. Map EXACT CSS values.
      4. TYPOGRAPHY: Extract a full hierarchy table from the raw 'typography' tokens.
      5. COLOR PALETTE: Categorize into Primary, Secondary, Surface, Semantic. Format: "- **Name** (Hex): Technical intent".
      6. AGENT PROMPTS: Examples MUST include specific technical tokens (e.g., "Create a button with #F472B6 background, 9999px radius, and JetBrains Mono text").

      REQUIRED DOCUMENT STRUCTURE:
      # Design System Documentation

      ## 1. Visual Theme & Atmosphere
      - 4 dense, technical paragraphs.
      - End with a "**Key Characteristics:**" bulleted list.

      ## 2. Color Palette & Roles
      - Categorized sub-sections (### Primary, ### Secondary & Accent, ### Surface & Background, ### Semantic & Accent, ### Gradient System).

      ## 3. Typography Rules
      - ### Font Family, ### Hierarchy (Table), ### Principles.

      ## 4. Component Stylings
      - Detailed sub-sections (### Buttons, ### Cards, ### Navigation, ### Inputs).
      - MANDATORY: Technical Table for each.

      ## 5. Layout Principles
      - ### Spacing System (Table), ### Grid & Container, ### Whitespace Philosophy, ### Border Radius Scale (Table).

      ## 6. Depth & Elevation
      - ### Elevation Levels (Table: Level | Shadow | Use). Simplify complex shadow strings into readable CSS.

      ## 7. Do's and Don'ts
      - ### Do and ### Don't (10 rules each).

      ## 8. Responsive Behavior
      - ### Breakpoints (Table: Name | Width | Key Changes). Use human-readable names (Mobile, Tablet, Desktop) instead of XS/XL.
      - ### Collapsing Strategy.

      ## 9. Agent Prompt Guide
      - ### Quick Color Reference (Bullet list).
      - ### Example Component Prompts (5 strings in quotes, MUST use specific tokens found).
      - ### Iteration Guide (10 rules).

      MANDATORY: Mimic the Binance example's professional gravitas perfectly. This is a high-value architectural document.
    `;

    try {
      log('Status', 'Architect is drafting the final technical specification');
      
      const completion = await this.client.chat.completions.create({
        model: 'meta/llama-3.1-405b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 8192,
      });

      const content = completion.choices[0]?.message?.content;
      
      if (content) {
        fs.writeFileSync('DESIGN.md', content);
        log('Status', 'Technical design system saved to DESIGN.md');
      }
    } catch (err: any) {
      log('Error', `Architect Synthesis Error: ${err.message}`);
    }
  }
}
