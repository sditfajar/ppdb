import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { RegistrationRow } from "@/lib/csv";

export interface GeneratePdfOptions {
  academicYear?: string;
  filterSummary?: string;
}

function formatStatus(status: RegistrationRow["status"]): string {
  switch (status) {
    case "verified":
      return "Terverifikasi";
    case "rejected":
      return "Ditolak";
    case "pending":
    default:
      return "Menunggu";
  }
}

function formatDateOnly(isoStringOrDate: string): string {
  if (!isoStringOrDate) return "-";
  return isoStringOrDate.split("T")[0] || isoStringOrDate;
}

/**
 * Memotong teks jika melebihi panjang maksimum agar tidak menabrak kolom sebelah.
 */
function truncateText(text: string, maxLength: number): string {
  if (!text) return "-";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

/**
 * Menghasilkan dokumen PDF rekap pendaftar dalam format A4 Landscape siap cetak/arsip.
 */
export async function generateRegistrationsPdf(
  registrations: RegistrationRow[],
  options: GeneratePdfOptions = {}
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Ukuran A4 Landscape: 841.89 x 595.28 pt
  const pageWidth = 841.89;
  const pageHeight = 595.28;
  const marginX = 40;
  const marginBottom = 45;

  const columns = [
    { header: "No", width: 28 },
    { header: "No. Registrasi", width: 90 },
    { header: "Nama Lengkap Siswa", width: 155 },
    { header: "L/P", width: 32 },
    { header: "Gel.", width: 38 },
    { header: "Status", width: 85 },
    { header: "No. WhatsApp", width: 95 },
    { header: "Nama Orang Tua", width: 145 },
    { header: "Tgl Daftar", width: 75 },
  ];

  const todayStr = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  const yearStr = options.academicYear || registrations[0]?.academic_year || "2026/2027";
  const filterSummary = options.filterSummary ? ` (${options.filterSummary})` : "";

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let currentY = pageHeight - 40;

  // Fungsi helper untuk menggambar header dokumen
  const drawDocumentHeader = (page: typeof currentPage, isFirstPage: boolean) => {
    let y = pageHeight - 35;

    if (isFirstPage) {
      // Judul Utama
      page.drawText("SDIT FAJAR • REKAPITULASI PENDAFTARAN PPDB ONLINE", {
        x: marginX,
        y,
        size: 13,
        font: fontBold,
        color: rgb(0.02, 0.31, 0.23), // Emerald gelap
      });

      y -= 16;
      page.drawText(
        `Tahun Ajaran: ${yearStr}${filterSummary}  |  Dicetak: ${todayStr} WIB  |  Total: ${registrations.length} Siswa`,
        {
          x: marginX,
          y,
          size: 8.5,
          font: fontRegular,
          color: rgb(0.35, 0.4, 0.45),
        }
      );

      y -= 12;
      // Garis pemisah atas
      page.drawLine({
        start: { x: marginX, y },
        end: { x: pageWidth - marginX, y },
        thickness: 0.75,
        color: rgb(0.8, 0.83, 0.86),
      });

      y -= 14;
    } else {
      page.drawText("SDIT FAJAR • REKAPITULASI PENDAFTARAN (Lanjutan)", {
        x: marginX,
        y,
        size: 9.5,
        font: fontBold,
        color: rgb(0.02, 0.31, 0.23),
      });
      y -= 16;
    }

    // Header Tabel
    const tableHeaderHeight = 20;
    page.drawRectangle({
      x: marginX,
      y: y - 4,
      width: pageWidth - marginX * 2,
      height: tableHeaderHeight,
      color: rgb(0.94, 0.96, 0.95), // Emerald light tint
      borderColor: rgb(0.75, 0.82, 0.78),
      borderWidth: 0.5,
    });

    let colX = marginX + 4;
    columns.forEach((col) => {
      page.drawText(col.header, {
        x: colX,
        y: y + 2,
        size: 8,
        font: fontBold,
        color: rgb(0.06, 0.25, 0.18),
      });
      colX += col.width;
    });

    return y - 18;
  };

  currentY = drawDocumentHeader(currentPage, true);

  // Render Baris Data
  if (registrations.length === 0) {
    currentPage.drawText("Tidak ada data pendaftar yang sesuai dengan filter yang dipilih.", {
      x: marginX + 10,
      y: currentY - 10,
      size: 9,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    });
  } else {
    registrations.forEach((row, index) => {
      // Cek apakah halaman berikutnya dibutuhkan
      if (currentY <= marginBottom) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = drawDocumentHeader(currentPage, false);
      }

      const rowHeight = 16;
      const isEven = index % 2 === 1;

      if (isEven) {
        currentPage.drawRectangle({
          x: marginX,
          y: currentY - 3,
          width: pageWidth - marginX * 2,
          height: rowHeight,
          color: rgb(0.98, 0.98, 0.99),
        });
      }

      // Garis pemisah baris halus
      currentPage.drawLine({
        start: { x: marginX, y: currentY - 4 },
        end: { x: pageWidth - marginX, y: currentY - 4 },
        thickness: 0.25,
        color: rgb(0.9, 0.92, 0.94),
      });

      const parentInfo = row.father_name
        ? `${row.father_name}${row.mother_name ? ` / ${row.mother_name}` : ""}`
        : row.mother_name || "-";

      const values = [
        String(index + 1),
        row.reg_number || "-",
        truncateText(row.student_name, 26),
        row.gender === "L" ? "L" : "P",
        `Gel ${row.wave}`,
        formatStatus(row.status),
        row.contact_phone || "-",
        truncateText(parentInfo, 24),
        formatDateOnly(row.created_at),
      ];

      let colX = marginX + 4;
      values.forEach((val, i) => {
        let textColor = rgb(0.15, 0.17, 0.2);
        let textFont = fontRegular;

        // Beri warna khusus pada status
        if (i === 5) {
          if (row.status === "verified") {
            textColor = rgb(0.05, 0.45, 0.25); // Hijau
            textFont = fontBold;
          } else if (row.status === "rejected") {
            textColor = rgb(0.75, 0.15, 0.15); // Merah
            textFont = fontBold;
          } else {
            textColor = rgb(0.65, 0.4, 0.05); // Kuning/Oranye
          }
        }

        currentPage.drawText(val, {
          x: colX,
          y: currentY,
          size: 7.5,
          font: textFont,
          color: textColor,
        });

        colX += columns[i]?.width || 50;
      });

      currentY -= rowHeight;
    });
  }

  // Tulis nomor halaman di footer setiap halaman
  const totalPages = pdfDoc.getPageCount();
  pdfDoc.getPages().forEach((page, pageIndex) => {
    const pageNumText = `Halaman ${pageIndex + 1} dari ${totalPages}  |  PPDB SDIT Fajar`;
    page.drawText(pageNumText, {
      x: pageWidth - marginX - fontRegular.widthOfTextAtSize(pageNumText, 7.5),
      y: 18,
      size: 7.5,
      font: fontRegular,
      color: rgb(0.5, 0.55, 0.6),
    });
  });

  return await pdfDoc.save();
}
