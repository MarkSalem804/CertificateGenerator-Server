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

function setTextIfFieldExists(form, fieldName, value, fontSize = 9) {
  let field;
  try {
    field = form.getTextField(fieldName);
    if (field) {
      field.setText(value);
      field.setFontSize(fontSize);
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

    // Get template path based on template ID or use default
    const templatePath = await getTemplatePath(certificateData.templateId);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    const templateBytes = fs.readFileSync(templatePath);

    // Load the existing PDF template
    const pdfDoc = await PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();

    // Format dates
    const formattedEventDate = DateTime.fromISO(
      certificateData.eventDate
    ).toFormat("MMMM dd, yyyy");
    const formattedIssuedDate = DateTime.fromISO(
      certificateData.issuedDate
    ).toFormat("MMMM dd, yyyy");
    const formattedCreatedAt = DateTime.fromJSDate(
      new Date(certificateData.createdAt)
    ).toFormat("MMMM dd, yyyy 'at' hh:mm a");

    // Set form fields
    setTextIfFieldExists(
      form,
      "PARTICIPANT_NAME",
      certificateData.participantName,
      14
    );
    setTextIfFieldExists(form, "EVENT_NAME", certificateData.eventName, 12);
    setTextIfFieldExists(form, "EVENT_VENUE", certificateData.eventVenue, 10);
    setTextIfFieldExists(
      form,
      "CERTIFICATE_NUMBER",
      certificateData.certificateNumber,
      10
    );
    setTextIfFieldExists(
      form,
      "PARTICIPANT_ROLE",
      certificateData.participantRole,
      10
    );
    setTextIfFieldExists(form, "EVENT_DATE", formattedEventDate, 10);
    setTextIfFieldExists(form, "ISSUED_DATE", formattedIssuedDate, 10);
    setTextIfFieldExists(form, "CREATED_DATE", formattedCreatedAt, 9);
    setTextIfFieldExists(form, "DURATION", certificateData.duration, 10);
    setTextIfFieldExists(form, "ISSUER_NAME", certificateData.issuerName, 10);

    // Generate QR Code
    const qrCodeDataURL = await generateQRCode(certificateData);

    // If QR code was generated, embed it in the PDF
    if (qrCodeDataURL) {
      try {
        // Convert data URL to buffer
        const base64Data = qrCodeDataURL.split(",")[1];
        const qrCodeBuffer = Buffer.from(base64Data, "base64");

        // Embed QR code image
        const qrCodeImage = await pdfDoc.embedPng(qrCodeBuffer);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // Position QR code (adjust coordinates as needed)
        firstPage.drawImage(qrCodeImage, {
          x: 450, // Adjust based on template
          y: 50, // Adjust based on template
          width: 100,
          height: 100,
        });
      } catch (qrError) {
        console.warn("Could not embed QR code:", qrError.message);
      }
    }

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
