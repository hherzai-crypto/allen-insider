import { chromium, Browser, Page } from 'playwright';

let browser: Browser | null = null;

/**
 * Get or create a shared browser instance
 * Reusing browser instance is more efficient than creating new ones
 */
export async function getBrowser(): Promise<Browser> {
  if (!browser || !browser.isConnected()) {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    });
  }
  return browser;
}

/**
 * Close the shared browser instance
 */
export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

/**
 * Create a new page with common settings
 */
export async function createPage(): Promise<Page> {
  const browserInstance = await getBrowser();
  const page = await browserInstance.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 }
  });

  // Set default timeout
  page.setDefaultTimeout(30000);

  // Add stealth scripts to avoid bot detection
  await page.addInitScript(() => {
    // Override the navigator.webdriver property
    Object.defineProperty(navigator, 'webdriver', { get: () => false });

    // Mock plugins
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5]
    });

    // Mock languages
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en']
    });

    // Override chrome detection
    (window as any).chrome = {
      runtime: {}
    };

    // Mock permissions
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters: any) =>
      parameters.name === 'notifications'
        ? Promise.resolve({ state: 'prompt' } as PermissionStatus)
        : originalQuery(parameters);
  });

  return page;
}

/**
 * Scrape a page with Playwright
 * Handles navigation, waiting, and error handling
 */
export async function scrapeWithPlaywright<T>(
  url: string,
  selector: string,
  extractData: (page: Page) => Promise<T>,
  options: {
    waitForSelector?: string;
    timeout?: number;
  } = {}
): Promise<T> {
  const page = await createPage();

  try {
    // Navigate to URL
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: options.timeout || 30000
    });

    // Wait for specific selector if provided
    if (options.waitForSelector) {
      await page.waitForSelector(options.waitForSelector, {
        timeout: options.timeout || 30000,
        state: 'visible'
      });
    } else {
      // Wait a bit for dynamic content to load
      await page.waitForTimeout(2000);
    }

    // Extract data
    const data = await extractData(page);

    return data;
  } finally {
    await page.close();
  }
}
