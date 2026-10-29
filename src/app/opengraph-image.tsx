import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "PPDB Online — SDIT Fajar";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#064e3b",
          backgroundImage: "linear-gradient(135deg, #064e3b 0%, #047857 60%, #059669 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            F
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#a7f3d0",
              }}
            >
              SDIT Fajar • Depok
            </span>
          </div>
        </div>

        {/* Center Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              padding: "8px 20px",
              borderRadius: "9999px",
              fontSize: "18px",
              fontWeight: 500,
              color: "#ecfdf5",
            }}
          >
            Sistem Penerimaan Murid Baru (SPMB)
          </div>
          <h1
            style={{
              fontSize: "58px",
              fontWeight: 800,
              lineHeight: 1.15,
              margin: 0,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Formulir Pendaftaran Siswa Baru SDIT Fajar
          </h1>
          <p
            style={{
              fontSize: "24px",
              lineHeight: 1.4,
              color: "#d1fae5",
              margin: 0,
            }}
          >
            Pendaftaran online yang mudah, aman, dan transparan untuk calon peserta didik.
          </p>
        </div>

        {/* Footer Badge / Features */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "24px", fontSize: "18px", color: "#a7f3d0" }}>
            <span>• Terverifikasi Panitia</span>
            <span>• Pengunggahan Aman</span>
            <span>• Kuota Gelombang Aktif</span>
          </div>
          <div style={{ fontSize: "18px", fontWeight: 600, color: "#ffffff" }}>
            ppdb.sditfajar.sch.id
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
