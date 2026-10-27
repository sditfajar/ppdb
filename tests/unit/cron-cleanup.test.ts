import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock getServerEnv
vi.mock("@/lib/config", () => ({
  getServerEnv: vi.fn(() => ({
    CRON_SECRET: "test-secret-12345",
  })),
}));

// Mock supabase admin client
const mockRemove = vi.fn().mockResolvedValue({ data: null, error: null });
const mockList = vi.fn();
const mockIn = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(() => ({
    storage: {
      from: vi.fn(() => ({
        list: mockList,
        remove: mockRemove,
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        in: mockIn,
      })),
    })),
  })),
}));

import { GET } from "@/app/api/cron/cleanup-orphans/route";

describe("Cron /api/cron/cleanup-orphans", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mengembalikan status 401 Unauthorized jika header Authorization tidak ada", async () => {
    const req = new NextRequest("http://localhost:3000/api/cron/cleanup-orphans", {
      headers: {},
    });

    const res = await GET(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("mengembalikan status 401 Unauthorized jika Bearer token salah", async () => {
    const req = new NextRequest("http://localhost:3000/api/cron/cleanup-orphans", {
      headers: {
        authorization: "Bearer wrong-secret",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("mengembalikan status 200 dan menghapus file yatim > 24 jam dengan otorisasi valid", async () => {
    const now = Date.now();
    const twentyFiveHoursAgo = new Date(now - 25 * 60 * 60 * 1000).toISOString();
    const oneHourAgo = new Date(now - 1 * 60 * 60 * 1000).toISOString();

    // Mock root folder listing proofs
    mockList.mockImplementation((path: string) => {
      if (path === "proofs") {
        return Promise.resolve({
          data: [{ name: "2026", id: null, metadata: null }],
          error: null,
        });
      }
      if (path === "proofs/2026") {
        return Promise.resolve({
          data: [
            // File 1: Yatim (> 24 jam, tidak dirujuk di DB)
            { name: "orphan.jpg", id: "uuid-1", created_at: twentyFiveHoursAgo },
            // File 2: Berkas baru (< 24 jam)
            { name: "fresh.jpg", id: "uuid-2", created_at: oneHourAgo },
            // File 3: Berkas lama (> 24 jam, TAPI dirujuk di DB)
            { name: "active.jpg", id: "uuid-3", created_at: twentyFiveHoursAgo },
          ],
          error: null,
        });
      }
      return Promise.resolve({ data: [], error: null });
    });

    // Mock DB select registrations in candidatePaths
    mockIn.mockResolvedValue({
      data: [{ payment_proof_path: "proofs/2026/active.jpg" }],
      error: null,
    });

    const req = new NextRequest("http://localhost:3000/api/cron/cleanup-orphans", {
      headers: {
        authorization: "Bearer test-secret-12345",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    // fresh.jpg tidak masuk candidate karena < 24 jam
    expect(body.scanned).toBe(2);
    // orphan.jpg adalah satu-satunya file yatim
    expect(body.orphansFound).toBe(1);
    expect(body.deleted).toBe(1);

    // Pastikan storage.remove hanya dipanggil dengan orphan.jpg
    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(mockRemove).toHaveBeenCalledWith(["proofs/2026/orphan.jpg"]);
  });
});
