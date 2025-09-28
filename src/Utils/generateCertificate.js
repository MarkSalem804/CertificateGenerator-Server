const fs = require("fs");
const { PDFDocument, rgb } = require("pdf-lib");
const path = require("path");
const { DateTime } = require("luxon");
const QRCode = require("qrcode");
// const { v4: uuidv4 } = require("uuid");

function truncateWithEllipsis(text, maxLength) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
}

function setTextIfFieldExists(
  form,
  fieldName,
  value,
  fontSize = 9,
  isBold = false
) {
  let field;
  try {
    field = form.getTextField(fieldName);
    if (field) {
      field.setText(value);
      field.setFontSize(fontSize);
      if (isBold) {
        // Try to set bold font (this may not work with all PDFs)
        try {
          field.setFontSize(fontSize + 1); // Slightly larger for bold effect
        } catch (fontError) {
          // If bold setting fails, just use regular font
          console.warn(
            `Could not set bold font for ${fieldName}:`,
            fontError.message
          );
        }
      }
      field.enableReadOnly();
    }
  } catch (e) {
    // Field does not exist, ignore
  }
}

// Generate QR Code for certificate
async function generateQRCode(data) {
  try {
    const qrData = {
      certificateNumber: data.certificateNumber,
      participantName: data.participantName,
      eventName: data.eventName,
      issuedDate: data.issuedDate,
      verificationUrl: `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/verify-certificate/${data.certificateNumber}`,
    };

    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 150,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    return null;
  }
}

// Generate certificate PDF
async function generateCertificatePDF(certificateData) {
  try {
    console.log(
      "🔍 [generateCertificatePDF] Generating certificate:",
      certificateData.certificateNumber
    );
    console.log("📋 [generateCertificatePDF] Certificate data:", {
      eventDate: certificateData.eventDate,
      issuedDate: certificateData.issuedDate,
      createdAt: certificateData.createdAt,
      duration: certificateData.duration,
      participantName: certificateData.participantName,
      eventName: certificateData.eventName,
      eventVenue: certificateData.eventVenue,
    });

    // Get template path based on template ID or use default
    const templatePath = await getTemplatePath(certificateData.templateId);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    const templateBytes = fs.readFileSync(templatePath);

    // Load the existing PDF template
    const pdfDoc = await PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();

    // Format dates with proper error handling
    let formattedEventDate = "Invalid Date";
    let formattedIssuedDate = "Invalid Date";
    let formattedCreatedAt = "Invalid Date";

    try {
      if (certificateData.eventDate) {
        formattedEventDate = DateTime.fromISO(
          certificateData.eventDate
        ).toFormat("MMMM dd, yyyy");
      }
    } catch (error) {
      console.warn("Error formatting event date:", error);
      formattedEventDate = new Date(
        certificateData.eventDate
      ).toLocaleDateString();
    }

    try {
      if (certificateData.issuedDate) {
        formattedIssuedDate = DateTime.fromISO(
          certificateData.issuedDate
        ).toFormat("MMMM dd, yyyy");
      }
    } catch (error) {
      console.warn("Error formatting issued date:", error);
      formattedIssuedDate = new Date(
        certificateData.issuedDate
      ).toLocaleDateString();
    }

    try {
      if (certificateData.createdAt) {
        formattedCreatedAt = DateTime.fromJSDate(
          new Date(certificateData.createdAt)
        ).toFormat("MMMM dd, yyyy 'at' hh:mm a");
      }
    } catch (error) {
      console.warn("Error formatting created date:", error);
      formattedCreatedAt = new Date(certificateData.createdAt).toLocaleString();
    }

    // Set form fields
    setTextIfFieldExists(
      form,
      "PARTICIPANT_NAME",
      certificateData.participantName.toUpperCase(),
      22,
      true // Make it bold
    );
    setTextIfFieldExists(form, "EVENT_NAME", certificateData.eventName, 12);
    setTextIfFieldExists(form, "EVENT_VENUE", certificateData.eventVenue, 10);
    setTextIfFieldExists(
      form,
      "PARTICIPANT_ROLE",
      certificateData.participantRole,
      10
    );
    setTextIfFieldExists(form, "EVENT_DATE", formattedEventDate, 10);
    setTextIfFieldExists(form, "ISSUED_DATE", formattedIssuedDate, 10);
    setTextIfFieldExists(form, "DURATION", certificateData.duration, 10);

    // Optional fields - only set if they exist in the template
    setTextIfFieldExists(
      form,
      "CERTIFICATE_NUMBER",
      certificateData.certificateNumber,
      10
    );
    setTextIfFieldExists(form, "CREATED_DATE", formattedCreatedAt, 9);
    setTextIfFieldExists(form, "ISSUER_NAME", certificateData.issuerName, 10);

    // QR Code generation removed as requested

    // Flatten the form to make it non-editable
    form.flatten();

    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, "../../certificates");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate output filename
    const sanitizedName = certificateData.participantName.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    const outputPath = path.join(
      outputDir,
      `Certificate_${certificateData.certificateNumber}_${sanitizedName}.pdf`
    );

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);

    console.log(
      "✅ [generateCertificatePDF] Certificate generated:",
      outputPath
    );
    return outputPath;
  } catch (error) {
    console.error("❌ [generateCertificatePDF] Error:", error);
    throw new Error(`Certificate generation failed: ${error.message}`);
  }
}

// Get template path based on template ID
async function getTemplatePath(templateId) {
  try {
    // Use the specific template path provided by user
    const templatePath = path.join(
      __dirname,
      "../../templates",
      "Certificate of Recognition - Matatag - Template.pdf"
    );

    return templatePath;
  } catch (error) {
    console.error("Error getting template path:", error);
    throw new Error(`Template not found for ID: ${templateId}`);
  }
}

// Generate certificate data for PDF generation
function prepareCertificateData(certificate, user, event, issuer, template) {
  return {
    certificateNumber: certificate.certificateNumber,
    participantName: user.fullName,
    participantRole: user.role,
    eventName: event.name,
    eventVenue: event.venue || event.location,
    eventDate: event.date,
    issuedDate: certificate.issuedAt,
    createdAt: certificate.createdAt,
    duration: certificate.duration || "N/A",
    issuerName: issuer.fullName,
    templateId: template.id,
    templateName: template.name,
  };
}

module.exports = {
  generateCertificatePDF,
  prepareCertificateData,
  generateQRCode,
};
