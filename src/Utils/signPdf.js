const signer = require("node-signpdf").default;
const { plainAddPlaceholder } = require("node-signpdf/dist/helpers");
const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

/**
 * Signs a PDF buffer using a P12 certificate.
 * Adds a visual "Signed" stamp and a cryptographic placeholder.
 * @param {Buffer} pdfBuffer - The PDF buffer.
 * @param {string} p12Path - Absolute path to the .p12 certificate file.
 * @param {string} password - Password for the .p12 certificate.
 * @returns {Buffer} - The signed PDF buffer.
 */
async function signPdfWithVisual(pdfBuffer, p12Path, password) {
  try {
    if (!fs.existsSync(p12Path)) {
      throw new Error(`Certificate file not found at: ${p12Path}`);
    }

    // Step 1: Add a visual "Digitally Signed" stamp using pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    
    // Position: Centered horizontally at the bottom area (above Superintendent)
    const centerX = width / 2;
    const signatureY = 80; // Lowered from 110 to avoid overlap and be closer to name
    
    // Embed a standard font for width calculation
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // 1. Prepare Text Lines
    const textLines = [
        "Digitally signed by",
        "MENDOZA HOMER",
        "NAPENAS",
        `Date: ${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, '0')}.${String(new Date().getDate()).padStart(2, '0')}`,
        `${new Date().toLocaleTimeString('en-GB')} +08:00`
    ];
    
    const fontSize = 8.5;
    
    // 2. Embed and Draw E-Signature Image (if exists)
    // FIX: Corrected path from "../DigitalSign/..." to "./DigitalSign/..."
    const signatureImagePath = path.join(__dirname, "DigitalSign/homer-sign.png");
    if (fs.existsSync(signatureImagePath)) {
        const imageBytes = fs.readFileSync(signatureImagePath);
        const image = await pdfDoc.embedPng(imageBytes);
        
        // Scale image - Reduced from 0.18 to 0.13
        const imgDims = image.scale(0.13); 
        
        firstPage.drawImage(image, {
            x: centerX - imgDims.width - 5, // Left of center
            y: signatureY - (imgDims.height / 2) + 15,
            width: imgDims.width,
            height: imgDims.height,
        });
    }

    // 3. Draw Text Lines
    textLines.forEach((line, index) => {
        firstPage.drawText(line, {
            x: centerX + 5, // Right of center
            y: signatureY + 30 - (index * 11), // Slightly moved up to account for extra line
            size: fontSize,
            font: (index === 1 || index === 2) ? helveticaBoldFont : helveticaFont,
            color: rgb(0, 0, 0),
        });
    });

    // Save with useObjectStreams: false for node-signpdf compatibility
    const pdfWithVisual = await pdfDoc.save({ useObjectStreams: false });
    const pdfBufferWithVisual = Buffer.from(pdfWithVisual);

    const p12Buffer = fs.readFileSync(p12Path);
    
    // Step 2: Add the cryptographic placeholder
    const pdfWithPlaceholder = plainAddPlaceholder({
        pdfBuffer: pdfBufferWithVisual,
        reason: 'CertiGo Digital Signature',
        contactInfo: 'admin@certigo.com',
        name: 'CertiGo Authority',
        location: 'Imus, Cavite',
    });

    // Step 3: Sign the document
    const signedPdfBuffer = signer.sign(pdfWithPlaceholder, p12Buffer, { passphrase: password });

    return signedPdfBuffer;
  } catch (error) {
    console.error("❌ [signPDF] Error signing PDF:", error.message);
    throw error;
  }
}

// Export wrapper to match previous function signature (synchronous wrapper for async logic)
// Since we introduced async pdf-lib, we need to adapt the service to await this
async function signPDF(pdfBuffer, p12Path, password) {
    return await signPdfWithVisual(pdfBuffer, p12Path, password);
}

module.exports = { signPDF };
