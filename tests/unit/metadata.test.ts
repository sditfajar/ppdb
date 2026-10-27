import { describe, it, expect } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("Metadata & SEO Configuration (Fase 8)", () => {
  it("robots.ts mengizinkan root dan melarang admin/api/dev", () => {
    const robotsConfig = robots();
    expect(robotsConfig).toBeDefined();
    expect(robotsConfig.rules).toBeDefined();

    const rules = Array.isArray(robotsConfig.rules)
      ? robotsConfig.rules[0]
      : robotsConfig.rules;

    expect(rules.allow).toBe("/");

    const disallow = Array.isArray(rules.disallow) ? rules.disallow : [rules.disallow];
    expect(disallow).toContain("/admin");
    expect(disallow).toContain("/admin/");
    expect(disallow).toContain("/admin/*");
    expect(disallow).toContain("/api/");
    expect(disallow).toContain("/dev/");

    expect(robotsConfig.sitemap).toBeDefined();
    expect(typeof robotsConfig.sitemap).toBe("string");
    expect(robotsConfig.sitemap).toContain("/sitemap.xml");
  });

  it("sitemap.ts hanya mendaftarkan rute utama '/'", () => {
    const sitemapEntries = sitemap();
    expect(Array.isArray(sitemapEntries)).toBe(true);
    expect(sitemapEntries.length).toBe(1);

    const rootEntry = sitemapEntries[0];
    expect(rootEntry.url).toMatch(/\/$/);
    expect(rootEntry.priority).toBe(1.0);
    expect(rootEntry.changeFrequency).toBe("daily");
    expect(rootEntry.lastModified).toBeInstanceOf(Date);
  });
});
