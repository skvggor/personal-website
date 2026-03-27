import { exec, spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { promisify } from "node:util";

const execAsync = promisify(exec);

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

const SIZES = {
  screenshot: { width: 1280, height: 1024 },
  "og-image": { width: 1200, height: 630 },
};

function waitForServer(url: string, maxAttempts = 60): Promise<void> {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = async () => {
      attempts++;
      try {
        const response = await fetch(url);
        if (response.ok) {
          resolve();
          return;
        }
      } catch {
        // Server not ready yet
      }

      if (attempts >= maxAttempts) {
        reject(new Error(`Server not ready after ${maxAttempts} attempts`));
        return;
      }

      setTimeout(check, 1000);
    };

    check();
  });
}

async function compressImage(inputPath: string): Promise<void> {
  const outputPath = inputPath.replace(".png", "-compressed.png");

  await execAsync(
    `pngquant --force --quality=65-80 --output "${outputPath}" "${inputPath}"`,
  );
  await execAsync(`optipng -o7 "${outputPath}"`);
  await execAsync(`mv "${outputPath}" "${inputPath}"`);

  console.log(`Compressed: ${inputPath}`);
}

async function captureScreenshots(): Promise<void> {
  const puppeteer = await import("puppeteer");

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();

    await page.goto(BASE_URL, { waitUntil: "networkidle0", timeout: 60000 });
    await sleep(3000);

    for (const [name, size] of Object.entries(SIZES)) {
      await page.setViewport(size);
      await sleep(500);

      await page.goto(BASE_URL, { waitUntil: "networkidle0" });
      await sleep(3000);

      await page.addStyleTag({
        content: `
          [data-nextjs-dialog-overlay],
          [data-nextjs-toast],
          [data-nextjs-toast-trigger],
          nextjs-portal {
            display: none !important;
          }
        `,
      });

      const path = `/app/public/${name}.png`;

      await page.screenshot({ path });

      console.log(`Captured: ${path} (${size.width}x${size.height})`);

      await compressImage(path);
    }
  } finally {
    await browser.close();
  }
}

async function main(): Promise<void> {
  console.log("Starting Next.js development server...");

  const serverProcess = spawn("npm", ["run", "dev"], {
    cwd: "/app",
    shell: true,
    env: { ...process.env, PORT: PORT.toString() },
    stdio: "inherit",
  });

  try {
    console.log(`Waiting for server at ${BASE_URL}...`);
    await waitForServer(BASE_URL);
    console.log("Server is ready!");

    console.log("Capturing screenshots...");
    await captureScreenshots();

    await execAsync(
      "chmod 644 /app/public/screenshot.png /app/public/og-image.png",
    );

    console.log("Done!");
  } finally {
    console.log("Shutting down server...");
    serverProcess.kill("SIGTERM");

    await new Promise<void>((resolve) => {
      serverProcess.on("exit", () => resolve());
      setTimeout(() => {
        serverProcess.kill("SIGKILL");
        resolve();
      }, 5000);
    });
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
