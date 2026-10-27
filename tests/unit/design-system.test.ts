import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("Design System Utilities", () => {
  it("cn() menggabungkan kelas dan menyelesaikan konflik Tailwind dengan benar", () => {
    // Basic joining
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");

    // Tailwind merge override
    expect(cn("px-4", "px-6")).toBe("px-6");
    expect(cn("bg-red-500", "bg-accent")).toBe("bg-accent");

    // Conditional classes
    const isFalse = false;
    const isTrue = true;
    expect(cn("base-class", isFalse && "ignored", isTrue && "active")).toBe(
      "base-class active"
    );

    // Array and object handling
    expect(cn(["h-11", "w-full"], { "opacity-50": isFalse, "shadow-border": true })).toBe(
      "h-11 w-full shadow-border"
    );
  });
});
