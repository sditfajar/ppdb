import ExcelJS from "exceljs";
import { RegistrationRow, sanitizeCsvCell, CSV_HEADERS } from "@/lib/csv";
import { formatEducationLevel } from "@/lib/format";

function formatStatus(status: RegistrationRow["status"]): string {
  switch (status) {
    case "verified":
      return "Terverifikasi";
    case "rejected":
      return "Ditolak";
    case "pending":
    default:
      return "Menunggu Verifikasi";
  }
}

function formatDateOnly(isoStringOrDate: string): string {
  if (!isoStringOrDate) return "-";
  return isoStringOrDate.split("T")[0] || isoStringOrDate;
}

/**
 * Menghasilkan Buffer berkas Excel (.xlsx) resmi dengan styling dan proteksi formula injection.
 */
export async function generateRegistrationsExcel(
  registrations: RegistrationRow[]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "SDIT Fajar";
  workbook.lastModifiedBy = "Admin PPDB SDIT Fajar";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet("Data Pendaftar", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  // Konfigurasi kolom
  worksheet.columns = CSV_HEADERS.map((header) => ({
    header,
    key: header,
    width: Math.max(header.length + 4, 15),
  }));

  // Style Header Row
  const headerRow = worksheet.getRow(1);
  headerRow.height = 26;
  headerRow.eachCell((cell) => {
    cell.font = {
      name: "Arial",
      size: 10,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF047857" }, // Emerald 700
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: false,
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FF064E3B" } },
      left: { style: "thin", color: { argb: "FF064E3B" } },
      bottom: { style: "medium", color: { argb: "FF064E3B" } },
      right: { style: "thin", color: { argb: "FF064E3B" } },
    };
  });

  // Isi data pendaftar
  registrations.forEach((row, index) => {
    const rawValues = [
      row.reg_number,
      formatDateOnly(row.created_at),
      formatStatus(row.status),
      `Gelombang ${row.wave}`,
      row.academic_year,
      row.student_name,
      row.student_nickname,
      row.gender === "L" ? "Laki-laki" : "Perempuan",
      row.birth_place,
      formatDateOnly(row.birth_date),
      row.siblings_count,
      row.birth_order,
      row.student_address,
      row.contact_phone,
      row.hobby,
      row.achievements || "-",
      row.medical_conditions || "-",
      row.father_name,
      formatEducationLevel(row.father_education),
      row.father_job,
      row.mother_name,
      formatEducationLevel(row.mother_education),
      row.mother_job,
      row.parent_address,
      row.rejection_reason || "-",
      row.admin_note || "-",
    ];

    // Lindungi dari formula injection dan bersihkan nilai
    const sanitizedValues = rawValues.map((val) => sanitizeCsvCell(val));
    const dataRow = worksheet.addRow(sanitizedValues);
    dataRow.height = 20;

    const isEven = index % 2 === 1;
    dataRow.eachCell((cell, colNumber) => {
      cell.font = { name: "Arial", size: 9 };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 1 || colNumber === 3 || colNumber === 4 ? "center" : "left",
      };
      if (isEven) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF9FAFB" }, // Subtle gray
        };
      }
      cell.border = {
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
    });
  });

  // Sesuaikan lebar kolom otomatis sesuai isi
  worksheet.columns.forEach((col) => {
    let maxLength = col.header ? String(col.header).length : 10;
    col.eachCell?.({ includeEmpty: false }, (cell) => {
      const cellLength = cell.value ? String(cell.value).length : 0;
      if (cellLength > maxLength) {
        maxLength = cellLength;
      }
    });
    col.width = Math.min(Math.max(maxLength + 3, 12), 40);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
