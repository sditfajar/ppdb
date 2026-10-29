import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const logoData = await readFile(join(process.cwd(), "public", "logo.png"), "base64");
const logoSrc = `data:image/png;base64,${logoData}`;

export const socialImageAlt = "SPMB — SDIT Fajar";
export const socialImageSize = { width: 1200, height: 630 };

export function createSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "56px 72px",
          backgroundColor: "#ecfdf5",
          backgroundImage:
            "radial-gradient(circle at 90% 12%, #bbf7d0 0, transparent 28%), linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
          color: "#14532d",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "660px" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "10px 18px",
              borderRadius: "999px",
              backgroundColor: "#166534",
              color: "#ffffff",
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            SDIT FAJAR
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: "30px" }}>
            <span style={{ fontSize: "72px", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em" }}>
              SPMB
            </span>
            <span style={{ marginTop: "16px", fontSize: "32px", fontWeight: 700, lineHeight: 1.2 }}>
              Sistem Penerimaan Murid Baru
            </span>
            <span style={{ marginTop: "22px", fontSize: "23px", lineHeight: 1.4, color: "#166534" }}>
              Pendaftaran siswa baru online yang cepat, transparan, dan aman.
            </span>
          </div>
          <span style={{ marginTop: "46px", fontSize: "19px", fontWeight: 700, color: "#15803d" }}>
            www.sditfajar.sch.id
          </span>
        </div>
        <div
          style={{
            display: "flex",
            width: "330px",
            height: "330px",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            boxShadow: "0 22px 50px rgba(20, 83, 45, 0.18)",
          }}
        >
          <img
            src={logoSrc}
            style={{ display: "flex", width: "270px", height: "270px" }}
            alt="Logo SDIT Fajar"
          />
        </div>
      </div>
    ),
    socialImageSize
  );
}
