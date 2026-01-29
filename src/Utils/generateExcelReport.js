const ExcelJS = require("exceljs");
const { DateTime } = require("luxon");

// Format time for display
function formatTime(dateTime) {
  if (!dateTime) return "-";
  const dt = DateTime.fromJSDate(new Date(dateTime));
  return dt.toFormat("h:mm a");
}

// Format date for display
function formatDate(dateTime) {
  if (!dateTime) return "-";
  const dt = DateTime.fromJSDate(new Date(dateTime));
  return dt.toFormat("MMM dd, yyyy");
}

// Calculate attendance percentage
function calculateAttendancePercentage(attendanceRecords, totalDays) {
  if (totalDays === 0) return 0;
  const daysAttended = attendanceRecords.filter(
    (record) => record.status === "Present" || record.status === "Partial"
  ).length;
  return Math.round((daysAttended / totalDays) * 100);
}

// Generate Excel report for event attendance
async function generateEventAttendanceExcel(reportData) {
  const { event, attendanceRecords, registrations, mealAttendance } =
    reportData;

  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "CertiGo Certificate Generator";
  workbook.created = new Date();

  // ==================== SHEET 1: ATTENDANCE DETAILS ====================
  const attendanceSheet = workbook.addWorksheet("Attendance Details", {
    properties: { tabColor: { argb: "FF0D9488" } },
  });

  // Set column widths
  attendanceSheet.columns = [
    { width: 5 }, // No.
    { width: 30 }, // Name
    { width: 25 }, // Email
    { width: 25 }, // Position
    { width: 30 }, // School/Unit
    { width: 10 }, // Day
    { width: 15 }, // Date
    { width: 12 }, // AM In
    { width: 12 }, // AM Out
    { width: 12 }, // PM In
    { width: 12 }, // PM Out
    { width: 12 }, // Status
    { width: 30 }, // Notes
  ];

  // Add title
  attendanceSheet.mergeCells("A1:M1");
  const titleCell = attendanceSheet.getCell("A1");
  titleCell.value = `ATTENDANCE REPORT - ${event.name}`;
  titleCell.font = { size: 16, bold: true, color: { argb: "FF0D9488" } };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  attendanceSheet.getRow(1).height = 30;

  // Add event details
  attendanceSheet.mergeCells("A2:M2");
  const detailsCell = attendanceSheet.getCell("A2");
  detailsCell.value = `Date: ${formatDate(event.date)} | Location: ${
    event.location
  } | Venue: ${event.venue || "N/A"}`;
  detailsCell.font = { size: 11, italic: true };
  detailsCell.alignment = { horizontal: "center", vertical: "middle" };
  attendanceSheet.getRow(2).height = 20;

  // Add blank row
  attendanceSheet.addRow([]);

  // Add headers
  const headerRow = attendanceSheet.addRow([
    "No.",
    "Participant Name",
    "Email",
    "Position",
    "School/Unit",
    "Day",
    "Date",
    "AM In",
    "AM Out",
    "PM In",
    "PM Out",
    "Status",
    "Notes",
  ]);

  // Style headers
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0D9488" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
  headerRow.height = 25;

  // Add attendance data
  let rowNumber = 1;
  attendanceRecords.forEach((record) => {
    const dataRow = attendanceSheet.addRow([
      rowNumber++,
      record.user.fullName,
      record.user.email,
      record.user.position || "N/A",
      record.user.schoolName || record.user.unitName || "N/A",
      record.dayNumber || 1,
      formatDate(record.date),
      formatTime(record.amInTime),
      formatTime(record.amOutTime),
      formatTime(record.pmInTime),
      formatTime(record.pmOutTime),
      record.status,
      record.notes || "",
    ]);

    // Style data rows
    dataRow.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFD1D5DB" } },
        left: { style: "thin", color: { argb: "FFD1D5DB" } },
        bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
        right: { style: "thin", color: { argb: "FFD1D5DB" } },
      };
      cell.alignment = { vertical: "middle", wrapText: true };

      // Center align specific columns
      if ([1, 6, 7, 8, 9, 10, 11, 12].includes(colNumber)) {
        cell.alignment = { ...cell.alignment, horizontal: "center" };
      }

      // Color code status
      if (colNumber === 12) {
        if (record.status === "Present") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD1FAE5" },
          };
          cell.font = { color: { argb: "FF065F46" }, bold: true };
        } else if (record.status === "Partial") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFEF3C7" },
          };
          cell.font = { color: { argb: "FF92400E" }, bold: true };
        } else if (record.status === "Absent") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFEE2E2" },
          };
          cell.font = { color: { argb: "FF991B1B" }, bold: true };
        }
      }
    });
    dataRow.height = 20;
  });

  // ==================== SHEET 2: SUMMARY ====================
  const summarySheet = workbook.addWorksheet("Summary", {
    properties: { tabColor: { argb: "FF0891B2" } },
  });

  // Set column widths
  summarySheet.columns = [
    { width: 5 }, // No.
    { width: 30 }, // Name
    { width: 25 }, // Email
    { width: 25 }, // Position
    { width: 30 }, // School/Unit
    { width: 15 }, // Registration Status
    { width: 15 }, // Days Attended
    { width: 15 }, // Attendance %
    { width: 15 }, // Overall Status
  ];

  // Add title
  summarySheet.mergeCells("A1:I1");
  const summaryTitleCell = summarySheet.getCell("A1");
  summaryTitleCell.value = `ATTENDANCE SUMMARY - ${event.name}`;
  summaryTitleCell.font = { size: 16, bold: true, color: { argb: "FF0891B2" } };
  summaryTitleCell.alignment = { horizontal: "center", vertical: "middle" };
  summarySheet.getRow(1).height = 30;

  // Add event summary stats
  const totalRegistered = registrations.length;
  const totalDays = event.numberOfDays || 1;
  const uniqueAttendees = new Set(
    attendanceRecords.map((record) => record.userId)
  ).size;
  const attendanceRate =
    totalRegistered > 0
      ? Math.round((uniqueAttendees / totalRegistered) * 100)
      : 0;

  summarySheet.mergeCells("A2:I2");
  const statsCell = summarySheet.getCell("A2");
  statsCell.value = `Total Registered: ${totalRegistered} | Attended: ${uniqueAttendees} | Attendance Rate: ${attendanceRate}% | Event Days: ${totalDays}`;
  statsCell.font = { size: 11, italic: true };
  statsCell.alignment = { horizontal: "center", vertical: "middle" };
  summarySheet.getRow(2).height = 20;

  // Add blank row
  summarySheet.addRow([]);

  // Add headers
  const summaryHeaderRow = summarySheet.addRow([
    "No.",
    "Participant Name",
    "Email",
    "Position",
    "School/Unit",
    "Registration Status",
    "Days Attended",
    "Attendance %",
    "Overall Status",
  ]);

  // Style headers
  summaryHeaderRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  summaryHeaderRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0891B2" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
  summaryHeaderRow.height = 25;

  // Prepare summary data
  const participantSummary = new Map();

  // Initialize with all registrations
  registrations.forEach((reg) => {
    participantSummary.set(reg.userId, {
      user: reg.user,
      registered: true,
      daysAttended: 0,
      totalDays: totalDays,
      attendanceRecords: [],
    });
  });

  // Add attendance data
  attendanceRecords.forEach((record) => {
    if (!participantSummary.has(record.userId)) {
      // Participant attended but not registered (edge case)
      participantSummary.set(record.userId, {
        user: record.user,
        registered: false,
        daysAttended: 0,
        totalDays: totalDays,
        attendanceRecords: [],
      });
    }

    const participant = participantSummary.get(record.userId);
    participant.attendanceRecords.push(record);

    if (record.status === "Present" || record.status === "Partial") {
      participant.daysAttended++;
    }
  });

  // Add summary data rows
  let summaryRowNumber = 1;
  Array.from(participantSummary.values()).forEach((participant) => {
    const attendancePercentage = calculateAttendancePercentage(
      participant.attendanceRecords,
      participant.totalDays
    );

    let overallStatus = "Absent";
    if (attendancePercentage >= 80) {
      overallStatus = "Excellent";
    } else if (attendancePercentage >= 60) {
      overallStatus = "Good";
    } else if (attendancePercentage > 0) {
      overallStatus = "Partial";
    }

    const dataRow = summarySheet.addRow([
      summaryRowNumber++,
      participant.user.fullName,
      participant.user.email,
      participant.user.position || "N/A",
      participant.user.schoolName || participant.user.unitName || "N/A",
      participant.registered ? "Registered" : "Walk-in",
      `${participant.daysAttended}/${participant.totalDays}`,
      `${attendancePercentage}%`,
      overallStatus,
    ]);

    // Style data rows
    dataRow.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFD1D5DB" } },
        left: { style: "thin", color: { argb: "FFD1D5DB" } },
        bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
        right: { style: "thin", color: { argb: "FFD1D5DB" } },
      };
      cell.alignment = { vertical: "middle", wrapText: true };

      // Center align specific columns
      if ([1, 6, 7, 8, 9].includes(colNumber)) {
        cell.alignment = { ...cell.alignment, horizontal: "center" };
      }

      // Color code registration status
      if (colNumber === 6) {
        if (participant.registered) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD1FAE5" },
          };
          cell.font = { color: { argb: "FF065F46" } };
        } else {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFEF3C7" },
          };
          cell.font = { color: { argb: "FF92400E" } };
        }
      }

      // Color code overall status
      if (colNumber === 9) {
        if (overallStatus === "Excellent") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD1FAE5" },
          };
          cell.font = { color: { argb: "FF065F46" }, bold: true };
        } else if (overallStatus === "Good") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFBFDBFE" },
          };
          cell.font = { color: { argb: "FF1E40AF" }, bold: true };
        } else if (overallStatus === "Partial") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFEF3C7" },
          };
          cell.font = { color: { argb: "FF92400E" }, bold: true };
        } else {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFEE2E2" },
          };
          cell.font = { color: { argb: "FF991B1B" }, bold: true };
        }
      }
    });
    dataRow.height = 20;
  });

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

module.exports = {
  generateEventAttendanceExcel,
};
