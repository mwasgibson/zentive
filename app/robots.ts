import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/cms";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteConfig = await getSiteConfig();
  return {
    rules: [
      // 1. General Search Engines (Ensure global reach)
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "DuckDuckBot", allow: "/" },
      { userAgent: "YandexBot", allow: "/" },
      { userAgent: "Baiduspider", allow: "/" }, // Critical for international traffic
      // 2. AI & LLM Crawlers (For training and discovery)
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" }, // Controls Gemini training
      { userAgent: "Applebot-Extended", allow: "/" }, // Controls Apple Intelligence
      { userAgent: "CCBot", allow: "/" }, // Common Crawl - the source for many LLMs
      { userAgent: "FacebookBot", allow: "/" }, // Meta AI
      // 3. Fallback
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${siteConfig.domain}/sitemap.xml`,
    host: siteConfig.domain,
  };
}
