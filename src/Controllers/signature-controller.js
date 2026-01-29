const express = require("express");
const router = express.Router();
const signatureService = require("../Services/signature-services");
const { authenticateToken } = require("../Middlewares/auth");

// Sign a single document
router.post("/signDocument", authenticateToken, async (req, res) => {
  try {
    const { certificateId } = req.body;

    if (!certificateId) {
      return res.status(400).json({
        success: false,
        error: "Certificate ID is required",
      });
    }

    const result = await signatureService.signDocument(certificateId);

    res.status(200).json({
      success: true,
      message: "Document signed successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Bulk sign documents for an event
router.post("/bulkSignDocument", authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        error: "Event ID is required",
      });
    }

    const result = await signatureService.bulkSignDocument(eventId);

    res.status(200).json({
      success: true,
      message: "Bulk signing completed",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
