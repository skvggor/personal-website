import { readFile } from "node:fs/promises";
import { join } from "node:path";

export interface AnnouncementBarConfig {
  enabled: boolean;
  text: string;
  link: string;
  target?: string;
  bgColor?: string;
  textColor?: string;
}

function parseFrontmatter(content: string): AnnouncementBarConfig {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    return {
      enabled: false,
      text: "",
      link: "",
    };
  }

  const frontmatter = frontmatterMatch[1];
  const config: Record<string, string | boolean> = {};

  for (const line of frontmatter.split("\n")) {
    const match = line.match(/^([^:]+):\s*(.+)$/);

    if (match) {
      const [, key, value] = match;
      const trimmedValue = value.trim().replace(/^["'](.*)["']$/, "$1");

      if (key.trim() === "enabled") {
        config[key.trim()] = trimmedValue === "true";
      } else {
        config[key.trim()] = trimmedValue;
      }
    }
  }

  return {
    enabled: (config.enabled as boolean) ?? false,
    text: (config.text as string) ?? "",
    link: (config.link as string) ?? "",
    target: (config.target as string) ?? "_blank",
    bgColor: (config.bgColor as string) ?? "#209ae7",
    textColor: (config.textColor as string) ?? "#ffffff",
  };
}

export async function getAnnouncementBarConfig(): Promise<AnnouncementBarConfig> {
  try {
    const filePath = join(process.cwd(), "content", "announcement-bar.md");
    const content = await readFile(filePath, "utf-8");

    return parseFrontmatter(content);
  } catch {
    return {
      enabled: false,
      text: "",
      link: "",
    };
  }
}
