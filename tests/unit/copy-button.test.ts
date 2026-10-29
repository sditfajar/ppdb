import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  normalizeAccountNoForCopy,
  copyToClipboard,
} from "@/components/ui/CopyButton";

describe("Fitur Salin Nomor Rekening (CopyButton)", () => {
  const originalWindow = globalThis.window;
  const originalDocument = (globalThis as unknown as { document: unknown }).document;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    (globalThis as unknown as { window: unknown }).window = originalWindow;
    (globalThis as unknown as { document: unknown }).document = originalDocument;
  });

  describe("normalizeAccountNoForCopy", () => {
    it("menghapus semua tanda strip (-) dari nomor rekening", () => {
      const formatted = "712-345-6789";
      expect(normalizeAccountNoForCopy(formatted)).toBe("7123456789");
    });

    it("menghapus spasi dari nomor rekening", () => {
      const formatted = "712 345 6789";
      expect(normalizeAccountNoForCopy(formatted)).toBe("7123456789");
    });

    it("menghapus kombinasi strip dan spasi", () => {
      const formatted = "712 - 345 - 6789";
      expect(normalizeAccountNoForCopy(formatted)).toBe("7123456789");
    });

    it("tidak mengubah nomor yang sudah bersih tanpa pemisah", () => {
      const clean = "7123456789";
      expect(normalizeAccountNoForCopy(clean)).toBe("7123456789");
    });

    it("mengembalikan teks asli jika cleanNumeric diatur ke false", () => {
      const formatted = "712-345-6789";
      expect(normalizeAccountNoForCopy(formatted, false)).toBe("712-345-6789");
    });
  });

  describe("copyToClipboard", () => {
    it("mengembalikan false jika di lingkungan non-browser (window undefined)", async () => {
      (globalThis as unknown as { window: unknown }).window = undefined;
      const result = await copyToClipboard("7123456789");
      expect(result).toBe(false);
    });

    it("memanggil navigator.clipboard.writeText jika tersedia di browser", async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      (globalThis as unknown as { window: unknown }).window = {
        navigator: {
          clipboard: { writeText: writeTextMock },
        },
      };

      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: writeTextMock },
        configurable: true,
      });

      const result = await copyToClipboard("7123456789");
      expect(writeTextMock).toHaveBeenCalledWith("7123456789");
      expect(result).toBe(true);
    });

    it("menggunakan fallback textarea dan execCommand jika navigator.clipboard gagal", async () => {
      (globalThis as unknown as { window: unknown }).window = {};
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: vi.fn().mockRejectedValue(new Error("Permission denied")),
        },
        configurable: true,
      });

      const execCommandMock = vi.fn().mockReturnValue(true);
      const dummyTextArea = {
        style: {},
        value: "",
        setAttribute: vi.fn(),
        focus: vi.fn(),
        select: vi.fn(),
      };

      (globalThis as unknown as { document: unknown }).document = {
        createElement: vi.fn().mockReturnValue(dummyTextArea),
        body: {
          appendChild: vi.fn(),
          removeChild: vi.fn(),
        },
        execCommand: execCommandMock,
      };

      const result = await copyToClipboard("7123456789");
      expect(execCommandMock).toHaveBeenCalledWith("copy");
      expect(result).toBe(true);
    });
  });
});
