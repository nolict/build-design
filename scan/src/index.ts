import 'dotenv/config';
import { log } from './utils/logger';
import { DesignScanner } from './scanner/engine';
import { DesignArchitect } from './generator/architect';

async function main() {
  const targetUrl = process.argv[2];
  const apiKey = process.env.NVIDIA_API_KEY;

  if (!targetUrl) {
    log('Usage: bun run scan <url>');
    process.exit(1);
  }

  if (!apiKey) {
    log('NVIDIA_API_KEY not found in .env');
    process.exit(1);
  }

  try {
    const scanner = new DesignScanner();
    await scanner.init();
    
    const tokens = await scanner.extract(targetUrl);
    
    const architect = new DesignArchitect(apiKey);
    await architect.generate(tokens);

    log('Design System generation completed successfully');
  } catch (error: any) {
    log(`Critical Error: ${error.message}`);
    process.exit(1);
  }
}

main();
