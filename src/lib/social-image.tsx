import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const logoData = await readFile(join(process.cwd(), "public", "logo.png"), "base64");
const logoSrc = `data:image/png;base64,${logoData}`;

export const socialImageSize = { width: 1200, height: 630 };
export const homeSocialImageAlt = "Beranda SDIT Fajar Depok — Membentuk Generasi Qur'ani";
export const spmbSocialImageAlt = "SPMB Online SDIT Fajar — Pendaftaran Murid Baru";

const colors = {
  blue: "#1D4ED8",
  blueSoft: "#DAE2FD",
  orange: "#F97316",
  green: "#10B981",
  greenDark: "#047857",
  canvas: "#FAF8FF",
  dark: "#0F172A",
  muted: "#434655",
  white: "#FFFFFF",
} as const;

const baseStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  position: "relative" as const,
  overflow: "hidden",
  padding: "48px 58px",
  backgroundColor: colors.canvas,
  color: colors.dark,
  fontFamily: "Arial, sans-serif",
};

function BrandLogo({ size = 112 }: { size?: number }) {
  return (
    <div
      style={{
        display: "flex",
        width: `${size}px`,
        height: `${size}px`,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "28px",
        backgroundColor: colors.white,
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.14)",
      }}
    >
      <img
        src={logoSrc}
        width={size - 18}
        height={size - 18}
        alt="Logo SDIT Fajar"
        style={{ display: "flex", objectFit: "contain" }}
      />
    </div>
  );
}

function Sticker({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px 18px",
        borderRadius: "999px",
        backgroundColor: colors.white,
        boxShadow: "0 8px 22px rgba(15, 23, 42, 0.11)",
        color,
        fontSize: "19px",
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
}

export function createHomeSocialImage() {
  return new ImageResponse(
    (
      <div style={baseStyle}>
        <div
          style={{
            position: "absolute",
            display: "flex",
            width: "430px",
            height: "430px",
            right: "-155px",
            top: "-195px",
            borderRadius: "50%",
            backgroundColor: "#FFDBCA",
          }}
        />
        <div
          style={{
            position: "absolute",
            display: "flex",
            width: "360px",
            height: "360px",
            left: "-175px",
            bottom: "-220px",
            borderRadius: "50%",
            backgroundColor: colors.blueSoft,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", width: "680px", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <BrandLogo size={86} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "29px", fontWeight: 800, letterSpacing: "0.035em", color: colors.blue }}>
                SDIT FAJAR
              </span>
              <span style={{ marginTop: "4px", fontSize: "20px", fontWeight: 700, color: colors.muted }}>
                Kota Depok
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: "52px" }}>
            <span style={{ fontSize: "62px", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.04 }}>
              Membentuk Generasi
            </span>
            <span style={{ marginTop: "4px", fontSize: "74px", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, color: colors.blue }}>
              Qur&apos;ani
            </span>
            <span style={{ marginTop: "22px", fontSize: "25px", lineHeight: 1.35, color: colors.muted }}>
              Cerdas, mandiri, dan berakhlak mulia dalam suasana belajar yang menyenangkan.
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              width: "300px",
              height: "300px",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "54px",
              backgroundColor: colors.blue,
              boxShadow: "0 20px 0 #0037B0",
              transform: "rotate(5deg)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: "rotate(-5deg)" }}>
              <span style={{ fontSize: "94px", lineHeight: 1, color: colors.orange }}>✦</span>
              <span style={{ marginTop: "14px", color: colors.white, fontSize: "31px", fontWeight: 800, textAlign: "center", whiteSpace: "pre" }}>
                {"Belajar dengan\nGembira"}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", marginTop: "38px", gap: "12px" }}>
            <Sticker color={colors.greenDark}>Tahfidz</Sticker>
            <Sticker color={colors.orange}>Berkarakter</Sticker>
          </div>
        </div>
      </div>
    ),
    socialImageSize
  );
}

export function createSpmbSocialImage() {
  return new ImageResponse(
    (
      <div style={baseStyle}>
        <div
          style={{
            position: "absolute",
            display: "flex",
            width: "520px",
            height: "520px",
            right: "-200px",
            bottom: "-275px",
            borderRadius: "50%",
            backgroundColor: colors.blueSoft,
          }}
        />
        <div
          style={{
            position: "absolute",
            display: "flex",
            width: "180px",
            height: "180px",
            right: "92px",
            top: "-78px",
            borderRadius: "42px",
            backgroundColor: "#FFDBCA",
            transform: "rotate(19deg)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", width: "690px", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <BrandLogo size={82} />
            <span style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "0.035em", color: colors.blue }}>
              SDIT FAJAR
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginTop: "46px",
              padding: "12px 20px",
              borderRadius: "999px",
              backgroundColor: colors.orange,
              color: colors.dark,
              fontSize: "22px",
              fontWeight: 800,
              letterSpacing: "0.08em",
            }}
          >
            SPMB ONLINE
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: "24px" }}>
            <span style={{ fontSize: "69px", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.98 }}>
              Pendaftaran
            </span>
            <span style={{ marginTop: "9px", fontSize: "58px", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, color: colors.blue }}>
              Murid Baru
            </span>
            <span style={{ marginTop: "24px", fontSize: "25px", lineHeight: 1.35, color: colors.muted }}>
              Mulai perjalanan belajar terbaik putra-putri Anda bersama SDIT Fajar.
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              width: "312px",
              height: "312px",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              backgroundColor: colors.white,
              boxShadow: "0 0 0 20px #E2E7FF, 0 20px 42px rgba(29, 78, 216, 0.20)",
            }}
          >
            <BrandLogo size={218} />
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "49px",
              padding: "16px 25px",
              borderRadius: "22px",
              backgroundColor: colors.green,
              color: colors.white,
              boxShadow: "0 7px 0 #047857",
              fontSize: "25px",
              fontWeight: 800,
            }}
          >
            Daftar Sekarang →
          </div>
        </div>
      </div>
    ),
    socialImageSize
  );
}
