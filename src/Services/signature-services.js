const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");
const { signPDF } = require("../Utils/signPdf");

// Path to the official PNPKI certificate
const P12_PATH = path.join(__dirname, "../Utils/DigitalSign/1758169534214-1757656055583-MENDOZA+HOMER+NAPENAS.p12");
const P12_PASSWORD = process.env.P12_PASSWORD || "password"; 

// Debug: Check if password is loaded (safe check)
if (process.env.P12_PASSWORD) {
    console.log(`🔑 [PNPKI] Password loaded from .env (Length: ${process.env.P12_PASSWORD.length})`);
} else {
    console.warn(`⚠️ [PNPKI] P12_PASSWORD NOT found in .env, using default fallback.`);
}


/**
 * Signs a single certificate document by ID
 * @param {number} certificateId 
 * @returns {Object} Result with signed path
 */
async function signDocument(certificateId) {
    try {
        console.log(`🔏 [signDocument] Signing certificate: ${certificateId}`);
        const certificate = await prisma.certificate.findUnique({
            where: { id: parseInt(certificateId) },
            include: { user: true }
        });

        if (!certificate) {
            throw new Error("Certificate not found");
        }

        // Reconstruct filename
        const sanitizedName = certificate.user.fullName.replace(/[^a-zA-Z0-9]/g, "_");
        const filename = `Certificate_${certificate.certificateNumber}_${sanitizedName}.pdf`;
        const filePath = path.join(__dirname, "../../certificates", filename);

        if (!fs.existsSync(filePath)) {
            throw new Error(`Certificate PDF file not found at: ${filePath}`);
        }

        // Read PDF
        const pdfBuffer = fs.readFileSync(filePath);

        // Sign PDF
        const signedBuffer = await signPDF(pdfBuffer, P12_PATH, P12_PASSWORD);

        // Overwrite file with signed version
        fs.writeFileSync(filePath, signedBuffer);

        // Update status in database
        await prisma.certificate.update({
            where: { id: certificate.id },
            data: { certStatus: "Signed" }
        });

        console.log(`✅ [signDocument] Successfully signed: ${filename}`);
        return {
            success: true,
            certificateId: certificate.id,
            path: filePath
        };

    } catch (error) {
        console.error(`❌ [signDocument] Error: ${error.message}`);
        throw error;
    }
}

/**
 * Bulk signs all certificates for an event
 * @param {number} eventId 
 * @returns {Object} Summary of signing process
 */
async function bulkSignDocument(eventId) {
    try {
        console.log(`🔏 [bulkSignDocument] Bulk signing for event: ${eventId}`);
        
        const certificates = await prisma.certificate.findMany({
            where: { eventId: parseInt(eventId) },
            include: { user: true }
        });

        if (certificates.length === 0) {
            return {
                message: "No certificates found for this event",
                count: 0,
                successCount: 0,
                failCount: 0
            };
        }

        let successCount = 0;
        let failCount = 0;
        const errors = [];

        for (const cert of certificates) {
            try {
                // Reconstruct filename
                const sanitizedName = cert.user.fullName.replace(/[^a-zA-Z0-9]/g, "_");
                const filename = `Certificate_${cert.certificateNumber}_${sanitizedName}.pdf`;
                const filePath = path.join(__dirname, "../../certificates", filename);

                if (fs.existsSync(filePath)) {
                    const pdfBuffer = fs.readFileSync(filePath);
                    const signedBuffer = await signPDF(pdfBuffer, P12_PATH, P12_PASSWORD);
                    fs.writeFileSync(filePath, signedBuffer);

                    // Update status in database
                    await prisma.certificate.update({
                        where: { id: cert.id },
                        data: { certStatus: "Signed" }
                    });

                    successCount++;
                } else {
                    failCount++;
                    errors.push(`File missing for cert ${cert.id}`);
                }
            } catch (err) {
                failCount++;
                errors.push(`Failed to sign cert ${cert.id}: ${err.message}`);
            }
        }

        console.log(`✅ [bulkSignDocument] Finished. Success: ${successCount}, Fail: ${failCount}`);
        return {
            success: true,
            total: certificates.length,
            successCount,
            failCount,
            errors
        };

    } catch (error) {
        console.error(`❌ [bulkSignDocument] Error: ${error.message}`);
        throw error;
    }
}

module.exports = {
    signDocument,
    bulkSignDocument
};
