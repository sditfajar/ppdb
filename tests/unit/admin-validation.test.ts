import { describe, it, expect } from "vitest";
import {
  adminLoginSchema,
  rejectRegistrationSchema,
  adminNoteSchema,
} from "@/lib/validation/admin";

describe("adminLoginSchema", () => {
  it("menerima email dan password valid", () => {
    const result = adminLoginSchema.safeParse({
      email: "admin@sditfajar.sch.id",
      password: "secretpassword123",
    });
    expect(result.success).toBe(true);
  });

  it("menolak email kosong atau format salah", () => {
    const emptyEmail = adminLoginSchema.safeParse({
      email: "",
      password: "123",
    });
    expect(emptyEmail.success).toBe(false);

    const invalidEmail = adminLoginSchema.safeParse({
      email: "bukan-email",
      password: "123",
    });
    expect(invalidEmail.success).toBe(false);
  });

  it("menolak password kosong", () => {
    const emptyPass = adminLoginSchema.safeParse({
      email: "admin@sditfajar.sch.id",
      password: "",
    });
    expect(emptyPass.success).toBe(false);
  });
});

describe("rejectRegistrationSchema", () => {
  it("menerima alasan penolakan >= 5 karakter", () => {
    const result = rejectRegistrationSchema.safeParse({
      reason: "Bukti transfer tidak terbaca",
    });
    expect(result.success).toBe(true);
  });

  it("menolak alasan penolakan < 5 karakter", () => {
    const shortReason = rejectRegistrationSchema.safeParse({
      reason: "Foto",
    });
    expect(shortReason.success).toBe(false);
  });

  it("menolak alasan yang hanya berisi spasi atau kosong", () => {
    const spaces = rejectRegistrationSchema.safeParse({
      reason: "    ",
    });
    expect(spaces.success).toBe(false);
  });
});

describe("adminNoteSchema", () => {
  it("menerima catatan yang wajar", () => {
    const result = adminNoteSchema.safeParse({
      note: "Sudah konfirmasi via WhatsApp, wali murid akan datang besok.",
    });
    expect(result.success).toBe(true);
  });

  it("menolak catatan melebihi batas 1000 karakter", () => {
    const tooLong = adminNoteSchema.safeParse({
      note: "a".repeat(1001),
    });
    expect(tooLong.success).toBe(false);
  });
});
