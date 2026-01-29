const fs = require("fs");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const path = require("path");
const { DateTime } = require("luxon");
const QRCode = require("qrcode");
const fontkit = require("@pdf-lib/fontkit");
// const { v4: uuidv4 } = require("uuid");

function truncateWithEllipsis(text, maxLength) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
}

function drawWrappedText(page, text, rect, fontSize, font, alignment) {
  const { rgb } = require("pdf-lib");

  // Split text into words
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  // Calculate line height (font size + small spacing)
  const lineHeight = fontSize * 2.0;

  // Calculate available width with padding
  const availableWidth = rect.width - 4; // 2px padding on each side

  // Build lines by fitting words
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth <= availableWidth) {
      currentLine = testLine;
    } else {
      // Current line is full, start a new one
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Single word is too long, truncate it
        lines.push(
          word.substring(0, Math.floor(availableWidth / (fontSize * 0.6)))
        );
        currentLine = "";
      }
    }
  }

  // Add the last line if it exists
  if (currentLine) {
    lines.push(currentLine);
  }

  // Calculate starting Y position (center vertically in the field)
  const totalTextHeight = lines.length * lineHeight;
  const startY =
    rect.y + rect.height / 2 + totalTextHeight / 2 - lineHeight / 2;

  // Draw each line
  lines.forEach((line, index) => {
    const lineWidth = font.widthOfTextAtSize(line, fontSize);
    let x = rect.x + 2; // Default left alignment

    // Apply alignment
    if (alignment === 1) {
      // Center
      x = rect.x + rect.width / 2 - lineWidth / 2;
    } else if (alignment === 2) {
      // Right
      x = rect.x + rect.width - lineWidth - 2;
    }

    const y = startY - index * lineHeight;

    page.drawText(line, {
      x: x,
      y: y,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
  });

  console.log(`✅ Drew wrapped text for EVENT_NAME: ${lines.length} lines`);
}

function drawRichText(page, segments, rect, baseFontSize, font, alignment) {
  // Flatten segments into words with style info
  const atoms = [];
  segments.forEach((seg) => {
    if (!seg.text) return;
    const textStr = String(seg.text);
    const words = textStr.split(" ");
    words.forEach((word, i) => {
      if (word.length > 0) {
        atoms.push({ text: word, isBold: seg.isBold });
      }
    });
  });

  const spaceWidth = font.widthOfTextAtSize(" ", baseFontSize);
  const lines = [];
  let currentLine = [];
  let currentLineWidth = 0;
  const availableWidth = rect.width - 4; // Padding

  // Build lines
  for (const atom of atoms) {
    // effective font size for width calculation (add tiny bit for bold)
    const atomFontSize = atom.isBold ? baseFontSize : baseFontSize;
    const atomWidth = font.widthOfTextAtSize(atom.text, atomFontSize);

    // Check if adding this word exceeds width
    // Add space width if line is not empty
    const additionalWidth = (currentLine.length > 0 ? spaceWidth : 0) + atomWidth;

    if (currentLineWidth + additionalWidth <= availableWidth) {
      if (currentLine.length > 0) {
        currentLineWidth += spaceWidth;
      }
      currentLine.push(atom);
      currentLineWidth += atomWidth;
    } else {
      // Start new line
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      currentLine = [atom];
      currentLineWidth = atomWidth;
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  // Draw lines
  const lineHeight = baseFontSize * 1.8; // Increased line height for better spacing
  const totalHeight = lines.length * lineHeight;
  
  // Return height info if we are just measuring
  if (!page) {
    // console.log(`   [Metric] Font: ${baseFontSize}, Height: ${totalHeight}, Lines: ${lines.length}`);
    return totalHeight;
  }

  // Vertical centering
  const startY = rect.y + rect.height / 2 + totalHeight / 2 - lineHeight * 0.8;
  
  console.log(`   [Draw] Rect Y: ${rect.y}, Height: ${rect.height}, Total Text Height: ${totalHeight}, StartY: ${startY}`);

  lines.forEach((line, lineIndex) => {
    // Calculate total line width for alignment
    let lineWidth = 0;
    line.forEach((atom, i) => {
      if (i > 0) lineWidth += spaceWidth;
      lineWidth += font.widthOfTextAtSize(atom.text, baseFontSize);
    });

    let x = rect.x + 2;
    if (alignment === 1) x = rect.x + rect.width / 2 - lineWidth / 2;
    else if (alignment === 2) x = rect.x + rect.width - lineWidth - 2;

    const y = startY - lineIndex * lineHeight;

    line.forEach((atom, i) => {
      if (i > 0) x += spaceWidth;
      
      const atomWidth = font.widthOfTextAtSize(atom.text, baseFontSize);
      
      // Draw text
      // Simulate bold by drawing multiple times with slight offset
      if (atom.isBold) {
        // Draw bold
        page.drawText(atom.text, { x: x, y: y, size: baseFontSize, font: font, color: rgb(0, 0, 0) });
        page.drawText(atom.text, { x: x + 0.3, y: y, size: baseFontSize, font: font, color: rgb(0, 0, 0) });
        page.drawText(atom.text, { x: x, y: y + 0.3, size: baseFontSize, font: font, color: rgb(0, 0, 0) });
      } else {
        // Regular
        page.drawText(atom.text, { x: x, y: y, size: baseFontSize, font: font, color: rgb(0, 0, 0) });
      }
      
      x += atomWidth;
    });
  });
}

function setTextIfFieldExists(
  form,
  fieldName,
  value,
  fontSize = 9,
  isBold = false,
  customFont = null,
  pdfDoc = null
) {
  let field;
  try {
    field = form.getTextField(fieldName);
    if (field) {
      // Store the original alignment
      let originalAlignment;
      try {
        originalAlignment = field.getAlignment();
      } catch (alignmentError) {
        originalAlignment = 0; // 0 = left, 1 = center, 2 = right
      }

      // If custom font is provided, draw text directly on PDF
      if (customFont && pdfDoc) {
        try {
          // Get field widgets (visual representations)
          const widgets = field.acroField.getWidgets();
          if (widgets.length > 0) {
            const widget = widgets[0];
            const rect = widget.getRectangle();

            // Find which page this field is on
            const pages = pdfDoc.getPages();
            let targetPage = pages[0]; // default to first page

            // Get the page reference from the widget
            try {
              const pageRef = widget.P();
              if (pageRef) {
                const pageIndex = pages.findIndex(
                  (page) => page.ref === pageRef
                );
                if (pageIndex >= 0) {
                  targetPage = pages[pageIndex];
                }
              }
            } catch (e) {
              // Use first page as fallback
            }

            
            // Special handling for CERTIFICATE_BODY using Rich Text and Auto-Scaling
            if (fieldName === "CERTIFICATE_BODY" && Array.isArray(value)) {
                 // Initial font size search
                 let bodyFontSize = 14; // Start smaller as requested
                 const minBodyFontSize = 8;
                 
                 // Smart shrink loop based on HEIGHT
                 let estimatedHeight = drawRichText(null, value, rect, bodyFontSize, customFont, originalAlignment);
                 console.log(`[Auto-Scale] Initial: Size ${bodyFontSize}, Height ${estimatedHeight} vs Bounds ${rect.height}`);
                 
                 while (estimatedHeight > (rect.height - 4) && bodyFontSize > minBodyFontSize) {
                    bodyFontSize -= 0.5;
                    estimatedHeight = drawRichText(null, value, rect, bodyFontSize, customFont, originalAlignment);
                    console.log(`[Auto-Scale] Adjust: Size ${bodyFontSize}, Height ${estimatedHeight}`);
                 }

                 if (bodyFontSize <= minBodyFontSize) {
                    console.warn("[Auto-Scale] Warning: Text may not fit even at minimum font size.");
                 }

                 drawRichText(targetPage, value, rect, bodyFontSize, customFont, originalAlignment);
                 
                 // Clear field
                 field.setText("");
                 console.log(`✅ Drew Rich Text Body with size ${bodyFontSize}`);
            } else {
                // Determine text value (handle array fallback if somehow passed here without matching field name, though unlikely)
                const textStr = Array.isArray(value) ? value.map(s => s.text).join("") : String(value);

                // Calculate text position with automatic font size adjustment
                let actualFontSize = isBold ? fontSize + 1 : fontSize;
                let textWidth = customFont.widthOfTextAtSize(textStr, actualFontSize);
    
                // Auto-shrink font size if text is too wide (with some padding)
                const maxWidth = rect.width - 4; // 4px total padding (2px on each side)
                const minFontSize = Math.max(fontSize * 0.5, 9); // Don't go below 50% of original or 9pt
    
                while (textWidth > maxWidth && actualFontSize > minFontSize) {
                  actualFontSize -= 0.5; // Reduce by 0.5pt at a time
                  textWidth = customFont.widthOfTextAtSize(textStr, actualFontSize);
                }
    
                // Special handling for EVENT_NAME field - enable text wrapping
                if (fieldName === "EVENT_NAME") {
                  // Always use text wrapping for event names to ensure they fit properly
                  drawWrappedText(
                    targetPage,
                    textStr,
                    rect,
                    actualFontSize,
                    customFont,
                    originalAlignment
                  );
                  // Clear the form field text (make it invisible) - do this here to prevent doubling
                  field.setText("");
    
                  const originalSize = isBold ? fontSize + 1 : fontSize;
                  const sizeAdjustment =
                    originalSize !== actualFontSize
                      ? ` (adjusted from ${originalSize})`
                      : "";
                  console.log(
                    `✅ Drew wrapped "${fieldName}" with Lucida Calligraphy with size ${actualFontSize}${sizeAdjustment}`
                  );
                } else {
                  // Single line text for other fields
                  let textX = rect.x + 2; // Small padding
                  const textY = rect.y + rect.height / 2 - actualFontSize / 3;
    
                  // Apply alignment
                  if (originalAlignment === 1) {
                    // Center
                    textX = rect.x + rect.width / 2 - textWidth / 2;
                  } else if (originalAlignment === 2) {
                    // Right
                    textX = rect.x + rect.width - textWidth - 2;
                  }
    
                  // Draw text directly on the page with custom font
                  targetPage.drawText(textStr, {
                    x: textX,
                    y: textY,
                    size: actualFontSize,
                    font: customFont,
                    color: rgb(0, 0, 0),
                  });
                  // Clear the form field text (make it invisible)
                  field.setText("");
    
                  const originalSize = isBold ? fontSize + 1 : fontSize;
                  const sizeAdjustment =
                    originalSize !== actualFontSize
                      ? ` (adjusted from ${originalSize})`
                      : "";
                  console.log(
                    `✅ Drew "${fieldName}" with Lucida Calligraphy at (${Math.round(
                      textX
                    )}, ${Math.round(
                      textY
                    )}) with size ${actualFontSize}${sizeAdjustment}`
                  );
                }
            }
            }
        } catch (fontError) {
          console.error(
            `❌ Could not draw custom font for ${fieldName}:`,
            fontError.message,
            fontError.stack
          );
          try {
             fs.appendFileSync(path.join(__dirname, "../../error_log.txt"), `\n[${new Date().toISOString()}] ${fieldName} Error: ${fontError.message}\nStack: ${fontError.stack}\n`);
          } catch(e) {}
          
          // Fallback: use regular form field
          const textValue = Array.isArray(value) 
            ? value.map(s => s.text).join("") 
            : value;
            
          field.setText(textValue);
          field.setFontSize(isBold ? fontSize + 1 : fontSize);
          try {
            field.setAlignment(originalAlignment);
          } catch (e) {
            // Ignore
          }
        }
      } else {
        // No custom font, use regular form field
        field.setText(value);
        field.setFontSize(isBold ? fontSize + 1 : fontSize);
        try {
          field.setAlignment(originalAlignment);
        } catch (e) {
          // Ignore
        }
      }

      field.enableReadOnly();
    }
  } catch (e) {
    console.warn(`Field ${fieldName} does not exist or error:`, e.message);
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
        process.env.FRONTEND_URL || "https://sdoic-certigo.depedimuscity.com"
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

function constructCertificateBody(
  data,
  formattedEventDate,
  formattedIssuedDate
) {
  const segments = [];
  const certType = String(data.certType || "Participation").toLowerCase();
  
  if (certType === "appearance") {
      // Body for Appearance
      segments.push({ text: data.eventName, isBold: true });
      
      segments.push({ text: " held on ", isBold: false });
      segments.push({ text: formattedEventDate, isBold: true });
      segments.push({ text: ", at ", isBold: false });
      segments.push({ text: data.eventVenue + ".", isBold: true });

      segments.push({ text: " Issued this ", isBold: false });
      segments.push({ text: formattedIssuedDate, isBold: true });
      segments.push({ text: ", at ", isBold: false });
      segments.push({ text: data.eventVenue + ".", isBold: true });
  } else if (certType === "recognition") {
      // Body for Recognition
      segments.push({ text: "has served as ", isBold: false });
      segments.push({ text: (data.eventRole || data.participantRole), isBold: true });
      segments.push({ text: " during the conduct of ", isBold: false });
      segments.push({ text: data.eventName, isBold: true });

      segments.push({ text: " held on ", isBold: false });
      segments.push({ text: formattedEventDate, isBold: true });
      segments.push({ text: ", at ", isBold: false });
      segments.push({ text: data.eventVenue + ".", isBold: true });

      segments.push({ text: " Issued this ", isBold: false });
      segments.push({ text: formattedIssuedDate, isBold: true });
      segments.push({ text: ", at ", isBold: false });
      segments.push({ text: data.eventVenue + ".", isBold: true });

      // Add CPD info to Recognition if available
      if (
        data.cpdUnits &&
        data.cpdUnits !== "N/A" &&
        data.cpdUnits !== "0" &&
        data.cpdUnits !== "0.0"
      ) {
        // PRC Number removed from body as it is now a dedicated form field
        segments.push({ text: ` (${data.cpdUnits} CPD Units)`, isBold: true });
      }
  } else {
      // Default to Participation
      segments.push({ text: "In recognition of active participation and commitment during the", isBold: false });
      segments.push({ text: " " + data.eventName, isBold: true });
      segments.push({ text: " held on ", isBold: false });
      segments.push({ text: formattedEventDate, isBold: true });
      segments.push({ text: ", at ", isBold: false });
      segments.push({ text: data.eventVenue + ".", isBold: true });

      if (data.duration && data.duration !== "N/A") {
         segments.push({ text: " Number of training hours participated: ", isBold: false });
         segments.push({ text: data.duration + " hours.", isBold: true });
      }

      segments.push({ text: " Issued this ", isBold: false });
      segments.push({ text: formattedIssuedDate, isBold: true });
      segments.push({ text: ", at ", isBold: false });
      segments.push({ text: data.eventVenue + ".", isBold: true });

      if (
        data.cpdUnits &&
        data.cpdUnits !== "N/A" &&
        data.cpdUnits !== "0" &&
        data.cpdUnits !== "0.0"
      ) {
        // PRC Number removed from body as it is now a dedicated form field
        segments.push({ text: ` (${data.cpdUnits} CPD Units)`, isBold: true });
      }
  }

  return segments;
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
      participantSchool: certificateData.participantSchool,
      participantUnit: certificateData.participantUnit,
      eventName: certificateData.eventName,
      eventVenue: certificateData.eventVenue,
      cpdUnits: certificateData.cpdUnits,
    });

    // Get template path based on certificate type and CPD Units
    const templatePath = await getTemplatePath(
      certificateData.certType,
      certificateData.cpdUnits
    );

    console.log(`🔍 [generateCertificatePDF] Using template: ${templatePath}`);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    console.log(`✅ [generateCertificatePDF] Template file exists, reading...`);
    const templateBytes = fs.readFileSync(templatePath);
    console.log(
      `✅ [generateCertificatePDF] Template loaded, size: ${templateBytes.length} bytes`
    );

    // Load the existing PDF template
    const pdfDoc = await PDFDocument.load(templateBytes);

    // Register fontkit to enable custom fonts
    pdfDoc.registerFontkit(fontkit);

    // Load custom font (Lucida Calligraphy)
    let customFont = null;
    try {
      // Load Lucida Calligraphy from project fonts directory
      const fontPath = path.join(__dirname, "../../fonts/LCALLIG.TTF");
      if (fs.existsSync(fontPath)) {
        const fontBytes = fs.readFileSync(fontPath);
        customFont = await pdfDoc.embedFont(fontBytes);
        console.log(
          "✅ [generateCertificatePDF] Lucida Calligraphy font loaded successfully from",
          fontPath
        );
      } else {
        console.warn(
          "⚠️ [generateCertificatePDF] Lucida Calligraphy font not found at",
          fontPath
        );
      }
    } catch (fontError) {
      console.warn(
        "⚠️ [generateCertificatePDF] Could not load custom font:",
        fontError.message
      );
    }

    const form = pdfDoc.getForm();

    // Format dates with proper error handling
    let formattedEventDate = "Date not available";
    let formattedIssuedDate = "Date not available";
    let formattedCreatedAt = "Date not available";

    try {
      if (certificateData.eventDate) {
        const eventDate = new Date(certificateData.eventDate);
        if (!isNaN(eventDate.getTime())) {
          formattedEventDate = eventDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      }
    } catch (error) {
      console.warn("Error formatting event date:", error);
      formattedEventDate = "Date not available";
    }

    try {
      if (certificateData.issuedDate) {
        const issuedDate = new Date(certificateData.issuedDate);
        if (!isNaN(issuedDate.getTime())) {
          formattedIssuedDate = issuedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      }
    } catch (error) {
      console.warn("Error formatting issued date:", error);
      formattedIssuedDate = "Date not available";
    }

    try {
      if (certificateData.createdAt) {
        const createdDate = new Date(certificateData.createdAt);
        if (!isNaN(createdDate.getTime())) {
          formattedCreatedAt = createdDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      }
    } catch (error) {
      console.warn("Error formatting created date:", error);
      formattedCreatedAt = "Date not available";
    }

    // Set form fields
    setTextIfFieldExists(
      form,
      "PARTICIPANT_NAME",
      certificateData.participantName.toUpperCase(),
      28,
      true, // Make it bold
      customFont,
      pdfDoc
    );

    // Construct and set the certificate body paragraph
    const certificateBody = constructCertificateBody(
      certificateData,
      formattedEventDate,
      formattedIssuedDate
    );
    setTextIfFieldExists(
      form,
      "CERTIFICATE_BODY",
      certificateBody,
      12,
      false,
      customFont,
      pdfDoc
    );

    // Add EVENT_ROLE field for Recognition certificates
    if (
      certificateData.certType === "Recognition" &&
      certificateData.eventRole
    ) {
      setTextIfFieldExists(
        form,
        "EVENT_ROLE",
        certificateData.eventRole,
        14,
        false,
        customFont,
        pdfDoc
      );
    }

    setTextIfFieldExists(
      form,
      "EVENT_NAME",
      certificateData.eventName,
      16,
      true,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "EVENT_VENUE",
      certificateData.eventVenue,
      12,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "EVENT_VENUE2",
      certificateData.eventVenue,
      12,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "PARTICIPANT_ROLE",
      certificateData.participantRole,
      10,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "PARTICIPANT_SCHOOL",
      certificateData.participantSchool,
      16,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "PARTICIPANT_UNIT",
      certificateData.participantUnit,
      10,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "EVENT_DATE",
      formattedEventDate,
      14,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "ISSUED_DATE",
      formattedIssuedDate,
      14,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "EVENT_DATE2",
      formattedEventDate,
      14,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "ISSUED_DATE2",
      formattedIssuedDate,
      14,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "DURATION",
      certificateData.duration,
      14,
      false,
      customFont,
      pdfDoc
    );

    // Only set CPD_UNITS if it exists (for templates with CPD)
    if (
      certificateData.cpdUnits &&
      certificateData.cpdUnits !== "N/A" &&
      certificateData.cpdUnits !== "0" &&
      certificateData.cpdUnits !== "0.0"
    ) {
      setTextIfFieldExists(
        form,
        "CPD_UNITS",
        certificateData.cpdUnits,
        14,
        false,
        customFont,
        pdfDoc
      );
    }

    // Only set PRC_NUMBER if it exists (for templates with PRC accreditation)
    if (certificateData.prcNumber && certificateData.prcNumber !== "N/A") {
      setTextIfFieldExists(
        form,
        "PRC_NUMBER",
        certificateData.prcNumber,
        12,
        false,
        customFont,
        pdfDoc
      );
    }

    // Optional fields - only set if they exist in the template
    setTextIfFieldExists(
      form,
      "CERTIFICATE_NUMBER",
      certificateData.certificateNumber,
      10,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "CREATED_DATE",
      formattedCreatedAt,
      9,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "ISSUER_NAME",
      certificateData.issuerName,
      10,
      false,
      customFont,
      pdfDoc
    );

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
    const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
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

// Get template path based on certificate type
async function getTemplatePath(certType, cpdUnits = null) {
  try {
    let templateFileName;

    // Determine if we should use the template with or without CPD Units
    // cpdUnits will be "N/A" when event.cpdUnits is false, or a string number when true
    const hasCpdUnits =
      cpdUnits && cpdUnits !== "N/A" && cpdUnits !== "0" && cpdUnits !== "0.0";

    // Select template based on certificate type and CPD Units
    const typeKey = String(certType || "Participation").toLowerCase();

    switch (typeKey) {
      case "appearance":
        // Appearance uses its own dedicated template
        templateFileName = "Cert of Appearance (Revised 2026).pdf";
        break;
      case "participation":
        templateFileName = hasCpdUnits
          ? "Cert of Participation-CertiGo(Revised 2026).pdf"
          : "Cert of Participation-CertiGo(Revised 2026).pdf"; // Using same for now as variant is missing
        break;
      case "recognition":
        templateFileName = hasCpdUnits
          ? "Cert of Recognition(Revised 2026).pdf"
          : "Cert of Recognition(Revised 2026)-No-CPD.pdf"; 
        
        // Check if No-CPD variant exists, otherwise fallback to standard
        const fullPath = path.join(__dirname, "../../templates", templateFileName);
        if (!fs.existsSync(fullPath)) {
            templateFileName = "Cert of Recognition(Revised 2026).pdf";
        }
        break;
      default:
        // Default based on CPD Units availability
        templateFileName = hasCpdUnits
          ? "Cert of Participation-CertiGo(Revised 2026).pdf"
          : "Cert of Participation-CertiGo(Revised 2026).pdf";
    }

    console.log(
      `📋 [getTemplatePath] CPD Units: ${cpdUnits}, Using template: ${templateFileName}`
    );

    const templatePath = path.join(
      __dirname,
      "../../templates",
      templateFileName
    );

    // Check if template file exists
    if (!fs.existsSync(templatePath)) {
      console.warn(
        `Template file not found: ${templatePath}, using default Participation template`
      );
      // Fallback to Participation template (the only one available)
      return path.join(
        __dirname,
        "../../templates",
        "Cert of Participation -CertiGo2.pdf"
      );
    }

    return templatePath;
  } catch (error) {
    console.error("Error getting template path:", error);
    throw new Error(`Template not found for type: ${certType}`);
  }
}

// Generate PDF buffer for download (without saving to file)
async function generateCertificatePDFBuffer(certificateData) {
  try {
    console.log(
      "🔍 [generateCertificatePDFBuffer] Generating certificate buffer:",
      certificateData.certificateNumber
    );
    console.log("📋 [generateCertificatePDFBuffer] Certificate data:", {
      eventDate: certificateData.eventDate,
      issuedDate: certificateData.issuedDate,
      createdAt: certificateData.createdAt,
      duration: certificateData.duration,
      participantName: certificateData.participantName,
      participantSchool: certificateData.participantSchool,
      participantUnit: certificateData.participantUnit,
      eventName: certificateData.eventName,
      eventVenue: certificateData.eventVenue,
      cpdUnits: certificateData.cpdUnits,
    });

    // Get template path based on certificate type and CPD Units
    const templatePath = await getTemplatePath(
      certificateData.certType,
      certificateData.cpdUnits
    );

    console.log(
      `🔍 [generateCertificatePDFBuffer] Using template: ${templatePath}`
    );

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    console.log(
      `✅ [generateCertificatePDFBuffer] Template file exists, reading...`
    );
    const templateBytes = fs.readFileSync(templatePath);
    console.log(
      `✅ [generateCertificatePDFBuffer] Template loaded, size: ${templateBytes.length} bytes`
    );

    // Load the existing PDF template
    const pdfDoc = await PDFDocument.load(templateBytes);

    // Register fontkit to enable custom fonts
    pdfDoc.registerFontkit(fontkit);

    // Load custom font (Lucida Calligraphy)
    let customFont = null;
    try {
      // Load Lucida Calligraphy from project fonts directory
      const fontPath = path.join(__dirname, "../../fonts/LCALLIG.TTF");
      if (fs.existsSync(fontPath)) {
        const fontBytes = fs.readFileSync(fontPath);
        customFont = await pdfDoc.embedFont(fontBytes);
        console.log(
          "✅ [generateCertificatePDFBuffer] Lucida Calligraphy font loaded successfully from",
          fontPath
        );
      } else {
        console.warn(
          "⚠️ [generateCertificatePDFBuffer] Lucida Calligraphy font not found at",
          fontPath
        );
      }
    } catch (fontError) {
      console.warn(
        "⚠️ [generateCertificatePDFBuffer] Could not load custom font:",
        fontError.message
      );
    }

    const form = pdfDoc.getForm();

    // Format dates with proper error handling
    let formattedEventDate = "Date not available";
    let formattedIssuedDate = "Date not available";
    let formattedCreatedAt = "Date not available";

    try {
      if (certificateData.eventDate) {
        const eventDate = new Date(certificateData.eventDate);
        if (!isNaN(eventDate.getTime())) {
          formattedEventDate = eventDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      }
    } catch (error) {
      console.warn("Error formatting event date:", error);
      formattedEventDate = "Date not available";
    }

    try {
      if (certificateData.issuedDate) {
        const issuedDate = new Date(certificateData.issuedDate);
        if (!isNaN(issuedDate.getTime())) {
          formattedIssuedDate = issuedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      }
    } catch (error) {
      console.warn("Error formatting issued date:", error);
      formattedIssuedDate = "Date not available";
    }

    try {
      if (certificateData.createdAt) {
        const createdDate = new Date(certificateData.createdAt);
        if (!isNaN(createdDate.getTime())) {
          formattedCreatedAt = createdDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      }
    } catch (error) {
      console.warn("Error formatting created date:", error);
      formattedCreatedAt = "Date not available";
    }

    // Set form fields with error handling
    setTextIfFieldExists(
      form,
      "PARTICIPANT_NAME",
      certificateData.participantName.toUpperCase(),
      28,
      true, // Make it bold
      customFont,
      pdfDoc
    );

    // Construct and set the certificate body paragraph
    const certificateBody = constructCertificateBody(
      certificateData,
      formattedEventDate,
      formattedIssuedDate
    );
    setTextIfFieldExists(
      form,
      "CERTIFICATE_BODY",
      certificateBody,
      12,
      false,
      customFont,
      pdfDoc
    );

    // Add EVENT_ROLE field for Recognition certificates
    if (
      certificateData.certType === "Recognition" &&
      certificateData.eventRole
    ) {
      setTextIfFieldExists(
        form,
        "EVENT_ROLE",
        certificateData.eventRole,
        14,
        false,
        customFont,
        pdfDoc
      );
    }

    setTextIfFieldExists(
      form,
      "EVENT_NAME",
      certificateData.eventName,
      16,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "EVENT_VENUE",
      certificateData.eventVenue,
      10,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "EVENT_VENUE2",
      certificateData.eventVenue,
      10,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "EVENT_DATE",
      formattedEventDate,
      14,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "ISSUED_DATE",
      formattedIssuedDate,
      14,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "EVENT_DATE2",
      formattedEventDate,
      14,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "ISSUED_DATE2",
      formattedIssuedDate,
      14,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "CREATED_DATE",
      formattedCreatedAt,
      10,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "DURATION",
      certificateData.duration,
      10,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "CERTIFICATE_NUMBER",
      certificateData.certificateNumber,
      8,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "PARTICIPANT_ROLE",
      certificateData.participantRole,
      10,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "PARTICIPANT_SCHOOL",
      certificateData.participantSchool,
      18,
      false,
      customFont,
      pdfDoc
    );
    setTextIfFieldExists(
      form,
      "PARTICIPANT_UNIT",
      certificateData.participantUnit,
      10,
      false,
      customFont,
      pdfDoc
    );

    // Only set CPD_UNITS if it exists (for templates with CPD)
    if (
      certificateData.cpdUnits &&
      certificateData.cpdUnits !== "N/A" &&
      certificateData.cpdUnits !== "0" &&
      certificateData.cpdUnits !== "0.0"
    ) {
      setTextIfFieldExists(
        form,
        "CPD_UNITS",
        certificateData.cpdUnits,
        14,
        false,
        customFont,
        pdfDoc
      );
    }

    // Only set PRC_NUMBER if it exists (for templates with PRC accreditation)
    if (certificateData.prcNumber && certificateData.prcNumber !== "N/A") {
      setTextIfFieldExists(
        form,
        "PRC_NUMBER",
        certificateData.prcNumber,
        14,
        false,
        customFont,
        pdfDoc
      );
    }

    setTextIfFieldExists(
      form,
      "ISSUER_NAME",
      certificateData.issuerName,
      10,
      false,
      customFont,
      pdfDoc
    );

    // QR Code generation removed as requested

    // Flatten the form to make it non-editable
    form.flatten();

    // Save the PDF as buffer (without saving to file)
    const pdfBytes = await pdfDoc.save({ useObjectStreams: false });

    console.log(
      `✅ [generateCertificatePDFBuffer] PDF buffer generated, size: ${pdfBytes.length} bytes`
    );
    return pdfBytes;
  } catch (error) {
    console.error("❌ [generateCertificatePDFBuffer] Error:", error);
    throw new Error(`Certificate buffer generation failed: ${error.message}`);
  }
}

// Generate certificate data for PDF generation
function prepareCertificateData(certificate, user, event, issuer, template) {
  // Use eventRole if provided, otherwise fallback to user's role
  const displayRole = certificate.eventRole || user.role;

  return {
    certificateNumber: certificate.certificateNumber,
    certType: certificate.certType || "Recognition", // Default to Recognition
    participantName: user.fullName,
    participantRole: user.role,
    eventRole: displayRole, // This will be used for Recognition certificates
    participantSchool: user.schoolName || "N/A",
    participantUnit: user.unitName || "N/A",
    eventName: event.name,
    eventVenue: event.venue || event.location,
    eventDate: event.date,
    issuedDate: certificate.issuedAt,
    createdAt: certificate.createdAt,
    duration: certificate.duration || "N/A",
    cpdUnits: event.cpdUnits ? (event.cpdUnitsCount || 0).toString() : "N/A",
    issuerName: issuer.fullName,
    templateId: template.id,
    templateName: template.name,
    prcNumber: event.prcNumber || "N/A",
  };
}

module.exports = {
  generateCertificatePDF,
  generateCertificatePDFBuffer,
  prepareCertificateData,
  generateQRCode,
};
