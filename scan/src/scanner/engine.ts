import puppeteer, { type Page, type Browser } from 'puppeteer';
import { log } from '../utils/logger';
import { rgbToHex } from '../utils/colors';
import type { ViewportScan, FullDesignTokens } from '../types';

export class DesignScanner {
  private browser: Browser | null = null;

  async init() {
    this.browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/brave-browser',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-blink-features=AutomationControlled',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      ]
    });
  }

  private async checkAntiBot(page: Page) {
    const content = await page.content();
    if (content.includes('cloudflare') || content.includes('Just a moment') || content.includes('Access Denied')) {
      log('Warning', '🛡️ BOT CHALLENGE DETECTED: Cloudflare or similar wall encountered.');
      return true;
    }
    return false;
  }

  private async autoScroll(page: Page) {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight || totalHeight > 3000) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }

  private async scanViewport(page: Page, width: number, height: number): Promise<ViewportScan> {
    await page.setViewport({ width, height });
    await new Promise(r => setTimeout(r, 2000));

    const data = await page.evaluate((w) => {
      const getDetailedStyle = (el: Element | null) => {
        if (!el) return null;
        const s = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        
        return {
          tag: el.tagName,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          lineHeight: s.lineHeight,
          letterSpacing: s.letterSpacing,
          textTransform: s.textTransform,
          color: s.color,
          backgroundColor: s.backgroundColor,
          padding: s.padding,
          margin: s.margin,
          borderRadius: s.borderRadius,
          border: s.border,
          boxShadow: s.boxShadow,
          display: s.display,
          justifyContent: s.justifyContent,
          alignItems: s.alignItems,
          gap: s.gap,
          opacity: s.opacity,
          transition: s.transition,
          width: rect.width,
          height: rect.height,
          backgroundImage: s.backgroundImage
        };
      };

      const findUniqueVariants = (selector: string) => {
        const seen = new Set();
        const variants = [];
        const elements = Array.from(document.querySelectorAll(selector))
          .filter(el => {
            const r = el.getBoundingClientRect();
            return r.width > 10 && r.height > 10;
          });
        
        for (const el of elements) {
          const s = window.getComputedStyle(el);
          const signature = `${s.backgroundColor}-${s.color}-${s.borderRadius}`;
          if (!seen.has(signature)) {
            seen.add(signature);
            variants.push(getDetailedStyle(el));
          }
          if (variants.length >= 10) break;
        }
        return variants;
      };

      const findNav = () => {
        return document.querySelector('nav, header, [class*="nav"], [class*="header"], [role="navigation"]');
      };

      return {
        width: w,
        components: {
          body: getDetailedStyle(document.body),
          nav: getDetailedStyle(findNav()),
          hero: getDetailedStyle(document.querySelector('h1, [class*="hero"], [class*="banner"], section:first-of-type')),
          typography: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].map(tag => ({
            tag,
            style: getDetailedStyle(document.querySelector(tag))
          })).filter(i => i.style !== null) as any[],
          buttons: findUniqueVariants('button, [role="button"], a.btn, a.button, [class*="button"]') as any[],
          inputs: findUniqueVariants('input:not([type="hidden"]), select, textarea') as any[],
          cards: Array.from(document.querySelectorAll('*'))
            .filter(el => {
              const s = window.getComputedStyle(el as Element);
              const r = el.getBoundingClientRect();
              return (s.boxShadow !== 'none' || parseInt(s.borderWidth) > 0) && r.width > 150 && r.width < 1000 && el.children.length > 1;
            })
            .slice(0, 10)
            .map(el => getDetailedStyle(el as Element)) as any[],
          featured: Array.from(document.querySelectorAll('*'))
            .filter(el => {
              const s = window.getComputedStyle(el as Element);
              const r = el.getBoundingClientRect();
              return (s.backdropFilter !== 'none' || s.backgroundImage.includes('gradient')) && r.width > 50;
            })
            .slice(0, 15)
            .map(el => ({ tag: el.tagName, style: getDetailedStyle(el as Element) as any }))
        }
      };
    }, width);

    return data;
  }

  async extract(url: string): Promise<FullDesignTokens> {
    if (!this.browser) throw new Error('Scanner not initialized');
    
    log('Action', `Analyzing deep design DNA: ${url}`);
    const page = await this.browser.newPage();
    
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
    
    // Log anti-bot status
    const isBlocked = await this.checkAntiBot(page);
    if (isBlocked) {
      log('Action', 'Attempting to wait for challenge resolution...');
      await new Promise(r => setTimeout(r, 10000)); // Give it time to maybe pass
    }

    log('Action', 'Triggering auto-scroll to reveal lazy-loaded elements');
    await this.autoScroll(page);
    await new Promise(r => setTimeout(r, 2000));

    log('Action', 'Scanning multiple breakpoints');
    const viewports = [
      await this.scanViewport(page, 1440, 900),
      await this.scanViewport(page, 375, 812)
    ];

    log('Action', 'Extracting global style tokens');
    const globalData = await page.evaluate(() => {
      const allElements = Array.from(document.querySelectorAll('*')).slice(0, 2000);
      const uniqueColors = new Set<string>();
      const uniqueBgs = new Set<string>();
      const uniqueFonts = new Set<string>();

      allElements.forEach(el => {
        const s = window.getComputedStyle(el);
        if (s.color) uniqueColors.add(s.color);
        if (s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)') uniqueBgs.add(s.backgroundColor);
        const font = s.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
        if (font && font !== 'serif' && font !== 'sans-serif') uniqueFonts.add(font);
      });

      return {
        title: document.title,
        variables: {},
        allColors: Array.from(uniqueColors).slice(0, 40),
        allBgs: Array.from(uniqueBgs).slice(0, 40),
        allRadius: Array.from(new Set(allElements.map(el => getComputedStyle(el).borderRadius))).filter(r => r !== '0px').slice(0, 20),
        allShadows: Array.from(new Set(allElements.map(el => getComputedStyle(el).boxShadow))).filter(s => s !== 'none').slice(0, 20),
        detectedFonts: Array.from(uniqueFonts).slice(0, 5)
      };
    });

    await this.browser.close();

    const result = { viewports, globalData };
    return JSON.parse(rgbToHex(JSON.stringify(result)));
  }
}
