const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticateToken } = require("../Middlewares/auth");
const {
  checkGeofencing,
  validateCoordinates,
  getGeofencingStatusMessage,
} = require("../Utils/geofencing");
const {
  broadcastEventCreated,
  broadcastEventUpdated,
  broadcastTableCreated,
  broadcastParticipantAction,
  broadcastNotification,
  broadcastEventCreatedBoth,
  broadcastEventUpdatedBoth,
  broadcastTableCreatedBoth,
  broadcastParticipantActionBoth,
  broadcastNotificationBoth,
} = require("../Utils/socketUtils");
const certRouter = express.Router();
const certService = require("../Services/certgen-services");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads/templates");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Allow PDF and Word documents
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and Word documents are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

certRouter.post("/addPDProgram", async (req, res) => {
  const { programdataName } = req.body;
  try {
    if (!programdataName) {
      return res.status(400).json({
        success: false,
        error: "Program name is required",
      });
    }
    const newProgram = await certService.addPDProgram(programdataName);
    res.status(201).json({
      success: true,
      message: "Program added successfully",
      program: newProgram,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

certRouter.post("/addFundSource", async (req, res) => {
  const { fundSourceName } = req.body;
  try {
    if (!fundSourceName) {
      return res.status(400).json({
        success: false,
        error: "Fund source name is required",
      });
    }
    const newFundSource = await certService.addFundSource(fundSourceName);
    res.status(201).json({
      success: true,
      message: "Fund source added successfully",
      fundSource: newFundSource,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

certRouter.get("/getAllFundSources", async (req, res) => {
  try {
    const fundSources = await certService.getAllFundSources();
    res.status(200).json({
      success: true,
      message: "Fund sources fetched successfully",
      fundSources: fundSources,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

certRouter.get("/getAllPDPrograms", async (req, res) => {
  try {
    const pdPrograms = await certService.getAllPDPrograms();
    res.status(200).json({
      success: true,
      message: "PD programs fetched successfully",
      pdPrograms: pdPrograms,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

certRouter.post("/addDesignation", async (req, res) => {
  const { designationName } = req.body;
  try {
    if (!designationName) {
      return res.status(400).json({
        success: false,
        error: "Designation name is required",
      });
    }
    const newDesignation = await certService.addDesignation(designationName);
    res.status(201).json({
      success: true,
      message: "Designation added successfully",
      designation: newDesignation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

certRouter.get("/getAllDesignations", async (req, res) => {
  try {
    const designations = await certService.getAllDesignations();
    res.status(200).json({
      success: true,
      message: "Designations fetched successfully",
      designations: designations,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

certRouter.post("/addUnit", async (req, res) => {
  const { unitName, designationId } = req.body;
  const designationIdInt = parseInt(designationId);

  try {
    if (!unitName || !designationIdInt) {
      return res.status(400).json({
        success: false,
        error: "Unit name and designation ID are required",
      });
    }
    const newUnit = await certService.addUnit(unitName, designationIdInt);
    res.status(201).json({
      success: true,
      message: "Unit added successfully",
      unit: newUnit,
    });
  } catch (error) {
    console.error("addUnit error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

certRouter.get("/getAllUnits", async (req, res) => {
  try {
    const units = await certService.getAllUnits();
    res.status(200).json({
      success: true,
      message: "Units fetched successfully",
      units: units,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

certRouter.post("/addSchool", async (req, res) => {
  const { schoolName, designationId } = req.body;
  const designationIdInt = parseInt(designationId);
  try {
    if (!schoolName || !designationIdInt) {
      return res.status(400).json({
        success: false,
        error: "School name and designation ID are required",
      });
    }
    const newSchool = await certService.addSchool(schoolName, designationIdInt);
    res.status(201).json({
      success: true,
      message: "School added successfully",
      school: newSchool,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

certRouter.get("/getAllSchools", async (req, res) => {
  try {
    const schools = await certService.getAllSchools();
    res.status(200).json({
      success: true,
      message: "Schools fetched successfully",
      schools: schools,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ==================== EVENTS ROUTES ====================

// Create Event
certRouter.post("/addEvent", authenticateToken, async (req, res) => {
  try {
    const eventData = req.body;

    if (!eventData.name || !eventData.date || !eventData.location) {
      return res.status(400).json({
        success: false,
        error: "Event name, date, and location are required",
      });
    }

    // Validate numberOfDays if provided
    if (
      eventData.numberOfDays &&
      (eventData.numberOfDays < 1 || eventData.numberOfDays > 365)
    ) {
      return res.status(400).json({
        success: false,
        error: "Number of days must be between 1 and 365",
      });
    }

    // Validate fundSourceId if provided
    if (eventData.fundSourceId && isNaN(parseInt(eventData.fundSourceId))) {
      return res.status(400).json({
        success: false,
        error: "Fund Source ID must be a valid number",
      });
    }

    // Validate pdProgramId if provided
    if (eventData.pdProgramId && isNaN(parseInt(eventData.pdProgramId))) {
      return res.status(400).json({
        success: false,
        error: "PD Program ID must be a valid number",
      });
    }

    // Validate totalApprovedBudget if provided
    if (
      eventData.totalApprovedBudget &&
      isNaN(parseFloat(eventData.totalApprovedBudget))
    ) {
      return res.status(400).json({
        success: false,
        error: "Total approved budget must be a valid number",
      });
    }

    // Validate cpdUnitsCount if provided
    if (
      eventData.cpdUnitsCount &&
      (isNaN(parseFloat(eventData.cpdUnitsCount)) ||
        eventData.cpdUnitsCount < 0)
    ) {
      return res.status(400).json({
        success: false,
        error: "CPD units count must be a valid non-negative number",
      });
    }

    // Add createdBy field from authenticated user
    eventData.createdBy = req.user.id;

    const newEvent = await certService.addEvent(eventData);

    // Automatically create attendance and meal attendance tables based on numberOfDays
    const numberOfDays = eventData.numberOfDays || 1;
    const attendanceTablePromises = [];
    const mealAttendanceTablePromises = [];

    for (let day = 1; day <= numberOfDays; day++) {
      // Create attendance table for each day
      attendanceTablePromises.push(
        certService.addAttendanceTable({
          eventId: newEvent.id,
          dayNumber: day,
        })
      );

      // Create meal attendance table for each day
      mealAttendanceTablePromises.push(
        certService.addMealAttendanceTable({
          eventId: newEvent.id,
          dayNumber: day,
        })
      );
    }

    // Create all attendance and meal attendance tables
    await Promise.all([
      ...attendanceTablePromises,
      ...mealAttendanceTablePromises,
    ]);

    console.log(
      `✅ [addEvent] Created ${numberOfDays} attendance table(s) and ${numberOfDays} meal attendance table(s) for event ${newEvent.id}`
    );

    // Broadcast event creation to all connected clients (HTTP and HTTPS)
    broadcastEventCreatedBoth(req, newEvent);

    res.status(201).json({
      success: true,
      message: `Event created successfully with ${numberOfDays} attendance and meal table(s) auto-generated`,
      event: newEvent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get All Events
certRouter.get("/getAllEvents", authenticateToken, async (req, res) => {
  try {
    // Get user info from authenticated request
    const userId = req.user.id;
    const userRole = req.user.role;
    const userSchoolName = req.user.schoolName;

    const events = await certService.getAllEvents(
      userId,
      userRole,
      userSchoolName
    );
    res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      events: events,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get Event by ID
certRouter.get("/getEvent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid event ID provided",
      });
    }

    const event = await certService.getEventById(eventId);
    res.status(200).json({
      success: true,
      message: "Event fetched successfully",
      event: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Update Event
certRouter.put("/updateEvent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id, 10);
    const updateData = req.body;

    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid event ID provided",
      });
    }

    // Validate numberOfDays if provided
    if (
      updateData.numberOfDays &&
      (updateData.numberOfDays < 1 || updateData.numberOfDays > 365)
    ) {
      return res.status(400).json({
        success: false,
        error: "Number of days must be between 1 and 365",
      });
    }

    // Validate fundSourceId if provided
    if (updateData.fundSourceId && isNaN(parseInt(updateData.fundSourceId))) {
      return res.status(400).json({
        success: false,
        error: "Fund Source ID must be a valid number",
      });
    }

    // Validate pdProgramId if provided
    if (updateData.pdProgramId && isNaN(parseInt(updateData.pdProgramId))) {
      return res.status(400).json({
        success: false,
        error: "PD Program ID must be a valid number",
      });
    }

    // Validate totalApprovedBudget if provided
    if (
      updateData.totalApprovedBudget &&
      isNaN(parseFloat(updateData.totalApprovedBudget))
    ) {
      return res.status(400).json({
        success: false,
        error: "Total approved budget must be a valid number",
      });
    }

    // Validate cpdUnitsCount if provided
    if (
      updateData.cpdUnitsCount &&
      (isNaN(parseFloat(updateData.cpdUnitsCount)) ||
        updateData.cpdUnitsCount < 0)
    ) {
      return res.status(400).json({
        success: false,
        error: "CPD units count must be a valid non-negative number",
      });
    }

    const updatedEvent = await certService.updateEvent(eventId, updateData);
    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete Event
certRouter.delete("/deleteEvent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid event ID provided",
      });
    }

    await certService.deleteEvent(eventId);
    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Update Event Status
certRouter.patch("/updateEventStatus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid event ID provided",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required",
      });
    }

    const updatedEvent = await certService.updateEventStatus(eventId, status);
    res.status(200).json({
      success: true,
      message: "Event status updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ==================== EVENT REGISTRATION ROUTES ====================

// Register for Event
certRouter.post(
  "/registerForEvent/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const { notes } = req.body;
      const userId = req.user.id;
      const eventIdInt = parseInt(eventId, 10);

      if (isNaN(eventIdInt)) {
        return res.status(400).json({
          success: false,
          error: "Invalid event ID provided",
        });
      }

      // Check if event exists
      const event = await certService.getEventById(eventIdInt);
      if (!event) {
        return res.status(404).json({
          success: false,
          error: "Event not found",
        });
      }

      // Check if user is already registered
      const existingRegistration = await prisma.eventRegistration.findUnique({
        where: {
          userId_eventId: {
            userId: userId,
            eventId: eventIdInt,
          },
        },
      });

      if (existingRegistration) {
        if (existingRegistration.status === "registered") {
          return res.status(400).json({
            success: false,
            error: "You are already registered for this event",
          });
        } else if (existingRegistration.status === "cancelled") {
          // Update existing cancelled registration to registered
          const updatedRegistration = await prisma.eventRegistration.update({
            where: {
              userId_eventId: {
                userId: userId,
                eventId: eventIdInt,
              },
            },
            data: {
              status: "registered",
              registeredAt: new Date(),
              notes: notes || null,
            },
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
              event: {
                select: {
                  id: true,
                  name: true,
                  date: true,
                  location: true,
                },
              },
            },
          });

          return res.status(200).json({
            success: true,
            message: "Successfully re-registered for the event",
            registration: updatedRegistration,
          });
        }
      }

      // Create new registration
      const newRegistration = await prisma.eventRegistration.create({
        data: {
          userId: userId,
          eventId: eventIdInt,
          notes: notes || null,
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          event: {
            select: {
              id: true,
              name: true,
              date: true,
              location: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: "Successfully registered for the event",
        registration: newRegistration,
      });
    } catch (error) {
      console.error("registerForEvent error:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Cancel Event Registration
certRouter.delete(
  "/cancelEventRegistration/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;
      const eventIdInt = parseInt(eventId, 10);

      if (isNaN(eventIdInt)) {
        return res.status(400).json({
          success: false,
          error: "Invalid event ID provided",
        });
      }

      // Check if registration exists
      const existingRegistration = await prisma.eventRegistration.findUnique({
        where: {
          userId_eventId: {
            userId: userId,
            eventId: eventIdInt,
          },
        },
      });

      if (!existingRegistration) {
        return res.status(404).json({
          success: false,
          error: "Registration not found",
        });
      }

      if (existingRegistration.status === "cancelled") {
        return res.status(400).json({
          success: false,
          error: "Registration is already cancelled",
        });
      }

      // Update registration status to cancelled
      const updatedRegistration = await prisma.eventRegistration.update({
        where: {
          userId_eventId: {
            userId: userId,
            eventId: eventIdInt,
          },
        },
        data: {
          status: "cancelled",
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          event: {
            select: {
              id: true,
              name: true,
              date: true,
              location: true,
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        message: "Event registration cancelled successfully",
        registration: updatedRegistration,
      });
    } catch (error) {
      console.error("cancelEventRegistration error:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get User's Event Registration Status
certRouter.get(
  "/getEventRegistrationStatus/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;
      const eventIdInt = parseInt(eventId, 10);

      if (isNaN(eventIdInt)) {
        return res.status(400).json({
          success: false,
          error: "Invalid event ID provided",
        });
      }

      const registration = await prisma.eventRegistration.findUnique({
        where: {
          userId_eventId: {
            userId: userId,
            eventId: eventIdInt,
          },
        },
        include: {
          event: {
            select: {
              id: true,
              name: true,
              date: true,
              location: true,
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        message: "Registration status fetched successfully",
        registration: registration,
        isRegistered: registration
          ? registration.status === "registered"
          : false,
      });
    } catch (error) {
      console.error("getEventRegistrationStatus error:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get All Event Registrations for an Event (Admin only)
certRouter.get(
  "/getEventRegistrations/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const eventIdInt = parseInt(eventId, 10);

      if (isNaN(eventIdInt)) {
        return res.status(400).json({
          success: false,
          error: "Invalid event ID provided",
        });
      }

      // Check if user is admin
      if (req.user.role !== "administrator") {
        return res.status(403).json({
          success: false,
          error: "Access denied. Administrator role required",
        });
      }

      const registrations = await prisma.eventRegistration.findMany({
        where: {
          eventId: eventIdInt,
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
              designationName: true,
              unitName: true,
              schoolName: true,
            },
          },
          event: {
            select: {
              id: true,
              name: true,
              date: true,
              location: true,
            },
          },
        },
        orderBy: {
          registeredAt: "desc",
        },
      });

      res.status(200).json({
        success: true,
        message: "Event registrations fetched successfully",
        registrations: registrations,
      });
    } catch (error) {
      console.error("getEventRegistrations error:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get User's All Event Registrations
certRouter.get(
  "/getUserEventRegistrations",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const registrations = await prisma.eventRegistration.findMany({
        where: {
          userId: userId,
        },
        include: {
          event: {
            select: {
              id: true,
              name: true,
              date: true,
              location: true,
              status: true,
            },
          },
        },
        orderBy: {
          registeredAt: "desc",
        },
      });

      res.status(200).json({
        success: true,
        message: "User event registrations fetched successfully",
        registrations: registrations,
      });
    } catch (error) {
      console.error("getUserEventRegistrations error:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// ==================== TEMPLATES ROUTES ====================

// Add Template with File Upload
certRouter.post(
  "/addTemplate",
  upload.single("templateFile"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "Template file is required",
        });
      }

      const { name, eventId } = req.body;

      if (!name || !eventId) {
        // Delete uploaded file if validation fails
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          error: "Template name and event ID are required",
        });
      }

      const templateData = {
        name: name,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        eventId: parseInt(eventId, 10),
      };

      const newTemplate = await certService.addTemplate(templateData);
      res.status(201).json({
        success: true,
        message: "Template uploaded successfully",
        template: newTemplate,
      });
    } catch (error) {
      // Delete uploaded file if there's an error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get All Templates
certRouter.get("/getAllTemplates", async (req, res) => {
  try {
    const templates = await certService.getAllTemplates();
    res.status(200).json({
      success: true,
      message: "Templates fetched successfully",
      templates: templates,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get Template by ID
certRouter.get("/getTemplate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const templateId = parseInt(id, 10);

    if (isNaN(templateId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid template ID provided",
      });
    }

    const template = await certService.getTemplateById(templateId);
    res.status(200).json({
      success: true,
      message: "Template fetched successfully",
      template: template,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get Templates by Event ID
certRouter.get("/getTemplatesByEvent/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventIdInt = parseInt(eventId, 10);

    if (isNaN(eventIdInt)) {
      return res.status(400).json({
        success: false,
        error: "Invalid event ID provided",
      });
    }

    const templates = await certService.getTemplatesByEventId(eventIdInt);
    res.status(200).json({
      success: true,
      message: "Templates fetched successfully",
      templates: templates,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Update Template
certRouter.put(
  "/updateTemplate/:id",
  upload.single("templateFile"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const templateId = parseInt(id, 10);
      const { name } = req.body;

      if (isNaN(templateId)) {
        return res.status(400).json({
          success: false,
          error: "Invalid template ID provided",
        });
      }

      if (!name) {
        return res.status(400).json({
          success: false,
          error: "Template name is required",
        });
      }

      let updateData = { name: name };

      // If new file is uploaded, update file information
      if (req.file) {
        // Get current template to delete old file
        const currentTemplate = await certService.getTemplateById(templateId);
        if (currentTemplate && fs.existsSync(currentTemplate.filePath)) {
          fs.unlinkSync(currentTemplate.filePath);
        }

        updateData = {
          ...updateData,
          fileName: req.file.originalname,
          filePath: req.file.path,
          fileSize: req.file.size,
        };
      }

      const updatedTemplate = await certService.updateTemplate(
        templateId,
        updateData
      );
      res.status(200).json({
        success: true,
        message: "Template updated successfully",
        template: updatedTemplate,
      });
    } catch (error) {
      // Delete uploaded file if there's an error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Delete Template
certRouter.delete("/deleteTemplate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const templateId = parseInt(id, 10);

    if (isNaN(templateId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid template ID provided",
      });
    }

    // Get template to delete file
    const template = await certService.getTemplateById(templateId);
    if (template && fs.existsSync(template.filePath)) {
      fs.unlinkSync(template.filePath);
    }

    await certService.deleteTemplate(templateId);
    res.status(200).json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Download Template File
certRouter.get("/downloadTemplate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const templateId = parseInt(id, 10);

    if (isNaN(templateId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid template ID provided",
      });
    }

    const template = await certService.getTemplateById(templateId);

    if (!fs.existsSync(template.filePath)) {
      return res.status(404).json({
        success: false,
        error: "Template file not found",
      });
    }

    res.download(template.filePath, template.fileName);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ==================== ATTENDANCE ROUTES ====================

// Add Attendance Table for a specific day
certRouter.post("/addAttendance", async (req, res) => {
  try {
    const { eventId, dayNumber } = req.body;

    // Validation
    if (!eventId || !dayNumber) {
      return res.status(400).json({
        success: false,
        error: "eventId and dayNumber are required",
      });
    }

    // Check if event exists
    const event = await certService.getEventById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Check if day number is valid (within event duration)
    if (dayNumber < 1 || dayNumber > event.numberOfDays) {
      return res.status(400).json({
        success: false,
        error: `Day number must be between 1 and ${event.numberOfDays}`,
      });
    }

    // Check if attendance table already exists for this day
    const existingAttendance = await certService.getAttendanceByDay(
      eventId,
      dayNumber
    );
    if (existingAttendance.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Attendance table for Day ${dayNumber} already exists`,
      });
    }

    // Calculate the date for this day
    const eventDate = new Date(event.date);
    const dayDate = new Date(
      eventDate.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000
    );

    // Create attendance table structure (empty table ready for participants)
    const attendanceTableData = {
      eventId: parseInt(eventId),
      dayNumber: parseInt(dayNumber),
      dayName: `Day ${dayNumber}`,
      date: dayDate,
      eventName: event.name,
      createdAt: new Date(),
    };

    // Save the attendance table to database
    const createdAttendanceTable = await certService.addAttendanceTable(
      attendanceTableData
    );

    res.status(201).json({
      success: true,
      message: `Successfully added attendance table for Day ${dayNumber}`,
      attendanceTable: createdAttendanceTable,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get Attendance by Event
certRouter.get(
  "/getAttendanceByEvent/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      console.log(
        `🔍 [getAttendanceByEvent Route] Request for eventId: ${eventId}`
      );

      if (!eventId || isNaN(eventId)) {
        console.log(
          `❌ [getAttendanceByEvent Route] Invalid eventId: ${eventId}`
        );
        return res.status(400).json({
          success: false,
          error: "Valid eventId is required",
        });
      }

      const attendance = await certService.getAttendanceByEvent(eventId);
      console.log(
        `📊 [getAttendanceByEvent Route] Service returned ${attendance.length} records`
      );

      res.status(200).json({
        success: true,
        message: "Attendance fetched successfully",
        attendance: attendance,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get Attendance by Day
certRouter.get("/getAttendanceByDay/:eventId/:dayNumber", async (req, res) => {
  try {
    const { eventId, dayNumber } = req.params;

    if (!eventId || isNaN(eventId) || !dayNumber || isNaN(dayNumber)) {
      return res.status(400).json({
        success: false,
        error: "Valid eventId and dayNumber are required",
      });
    }

    const attendance = await certService.getAttendanceByDay(eventId, dayNumber);

    res.status(200).json({
      success: true,
      message: "Attendance by day fetched successfully",
      attendance: attendance,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Update Attendance
certRouter.put("/updateAttendance/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Valid attendance ID is required",
      });
    }

    const updatedAttendance = await certService.updateAttendance(
      id,
      updateData
    );

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      attendance: updatedAttendance,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete Attendance
certRouter.delete("/deleteAttendance/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Valid attendance ID is required",
      });
    }

    await certService.deleteAttendance(id);

    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ==================== MEAL ATTENDANCE ROUTES ====================

// Add Meal Attendance Table for a specific day
certRouter.post("/addMealAttendance", async (req, res) => {
  try {
    const { eventId, dayNumber } = req.body;

    // Validation
    if (!eventId || !dayNumber) {
      return res.status(400).json({
        success: false,
        error: "eventId and dayNumber are required",
      });
    }

    // Check if event exists
    const event = await certService.getEventById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Check if day number is valid (within event duration)
    if (dayNumber < 1 || dayNumber > event.numberOfDays) {
      return res.status(400).json({
        success: false,
        error: `Day number must be between 1 and ${event.numberOfDays}`,
      });
    }

    // Check if meal attendance table already exists for this day
    const existingMealAttendance = await certService.getMealAttendanceByDay(
      eventId,
      dayNumber
    );
    if (existingMealAttendance.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Meal attendance table for Day ${dayNumber} already exists`,
      });
    }

    // Calculate the date for this day
    const eventDate = new Date(event.date);
    const dayDate = new Date(
      eventDate.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000
    );

    // Create meal attendance table structure (empty table ready for participants)
    const mealAttendanceTableData = {
      eventId: parseInt(eventId),
      dayNumber: parseInt(dayNumber),
      date: dayDate,
      eventName: event.name,
      createdAt: new Date(),
    };

    // Save the meal attendance table to database
    const createdMealAttendanceTable = await certService.addMealAttendance(
      mealAttendanceTableData
    );

    res.status(201).json({
      success: true,
      message: `Successfully added meal attendance table for Day ${dayNumber}`,
      mealAttendanceTable: createdMealAttendanceTable,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get Meal Attendance by Event
certRouter.get("/getMealAttendanceByEvent/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        error: "Valid eventId is required",
      });
    }

    const mealAttendance = await certService.getMealAttendanceByEvent(eventId);

    res.status(200).json({
      success: true,
      message: "Meal attendance fetched successfully",
      mealAttendance: mealAttendance,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get Meal Attendance by Day
certRouter.get(
  "/getMealAttendanceByDay/:eventId/:dayNumber",
  async (req, res) => {
    try {
      const { eventId, dayNumber } = req.params;

      if (!eventId || isNaN(eventId) || !dayNumber || isNaN(dayNumber)) {
        return res.status(400).json({
          success: false,
          error: "Valid eventId and dayNumber are required",
        });
      }

      const mealAttendance = await certService.getMealAttendanceByDay(
        eventId,
        dayNumber
      );

      res.status(200).json({
        success: true,
        message: "Meal attendance by day fetched successfully",
        mealAttendance: mealAttendance,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Update Meal Attendance
certRouter.put("/updateMealAttendance/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Valid meal attendance ID is required",
      });
    }

    const updatedMealAttendance = await certService.updateMealAttendance(
      id,
      updateData
    );

    res.status(200).json({
      success: true,
      message: "Meal attendance updated successfully",
      mealAttendance: updatedMealAttendance,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete Meal Attendance
certRouter.delete("/deleteMealAttendance/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Valid meal attendance ID is required",
      });
    }

    await certService.deleteMealAttendance(id);

    res.status(200).json({
      success: true,
      message: "Meal attendance deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ==================== INDIVIDUAL ATTENDANCE ROUTES ====================

// Add Individual Attendance Record with Geofencing
certRouter.post("/addIndividualAttendance", async (req, res) => {
  try {
    const {
      eventId,
      userId,
      dayNumber,
      participantLatitude,
      participantLongitude,
      amInTime,
      pmInTime,
      pmOutTime,
      notes,
    } = req.body;

    // Validation
    if (!eventId || !userId || !dayNumber) {
      return res.status(400).json({
        success: false,
        error: "eventId, userId, and dayNumber are required",
      });
    }

    // Check if event exists
    const event = await certService.getEventById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Check if user exists
    const user = await certService.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if day number is valid
    if (dayNumber < 1 || dayNumber > event.numberOfDays) {
      return res.status(400).json({
        success: false,
        error: `Day number must be between 1 and ${event.numberOfDays}`,
      });
    }

    // Check if attendance record already exists for this user and day
    const existingAttendance = await certService.getAttendanceByUserAndDay(
      eventId,
      userId,
      dayNumber
    );
    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        error: `Attendance record for this user on Day ${dayNumber} already exists`,
      });
    }

    // Geofencing validation
    let geofencingResult = null;
    let geofencingStatus = "Location not provided";

    if (
      participantLatitude &&
      participantLongitude &&
      event.eventLatitude &&
      event.eventLongitude
    ) {
      // Validate coordinates
      if (!validateCoordinates(participantLatitude, participantLongitude)) {
        return res.status(400).json({
          success: false,
          error: "Invalid participant coordinates",
        });
      }

      if (!validateCoordinates(event.eventLatitude, event.eventLongitude)) {
        return res.status(400).json({
          success: false,
          error: "Event location coordinates are invalid",
        });
      }

      // Check geofencing
      geofencingResult = checkGeofencing(
        event.eventLatitude,
        event.eventLongitude,
        participantLatitude,
        participantLongitude
      );

      geofencingStatus = getGeofencingStatusMessage(geofencingResult);

      // If geofencing is enabled and user is outside radius, return error
      if (!geofencingResult.isWithinRadius) {
        return res.status(400).json({
          success: false,
          error:
            "Attendance denied: You must be within the event venue to mark attendance",
          geofencing: {
            ...geofencingResult,
            status: geofencingStatus,
          },
        });
      }
    }

    // Calculate the date for this day
    const eventDate = new Date(event.date);
    const dayDate = new Date(
      eventDate.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000
    );

    // Create attendance record
    const attendanceData = {
      eventId: parseInt(eventId),
      userId: parseInt(userId),
      dayNumber: parseInt(dayNumber),
      dayName: `Day ${dayNumber}`,
      date: dayDate,
      amInTime: amInTime ? new Date(amInTime) : null,
      pmInTime: pmInTime ? new Date(pmInTime) : null,
      pmOutTime: pmOutTime ? new Date(pmOutTime) : null,
      participantLatitude: participantLatitude || null,
      participantLongitude: participantLongitude || null,
      status: "Present",
      notes: notes || null,
      createdAt: new Date(),
    };

    const newAttendance = await certService.addIndividualAttendance(
      attendanceData
    );

    res.status(201).json({
      success: true,
      message: "Attendance record added successfully",
      attendance: newAttendance,
      geofencing: geofencingResult
        ? {
            ...geofencingResult,
            status: geofencingStatus,
          }
        : null,
    });
  } catch (error) {
    console.error("❌ [addIndividualAttendance] Error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Update Individual Attendance Record
certRouter.put(
  "/updateIndividualAttendance/:attendanceId",
  async (req, res) => {
    try {
      const { attendanceId } = req.params;
      const {
        participantLatitude,
        participantLongitude,
        amInTime,
        amOutTime,
        pmInTime,
        pmOutTime,
        status,
        notes,
      } = req.body;

      // Get existing attendance record
      const existingAttendance = await certService.getAttendanceById(
        attendanceId
      );
      if (!existingAttendance) {
        return res.status(404).json({
          success: false,
          error: "Attendance record not found",
        });
      }

      // Get event details for geofencing
      const event = await certService.getEventById(existingAttendance.eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          error: "Event not found",
        });
      }

      // Geofencing validation for updates
      let geofencingResult = null;
      let geofencingStatus = "Location not provided";

      if (
        participantLatitude &&
        participantLongitude &&
        event.eventLatitude &&
        event.eventLongitude
      ) {
        if (!validateCoordinates(participantLatitude, participantLongitude)) {
          return res.status(400).json({
            success: false,
            error: "Invalid participant coordinates",
          });
        }

        geofencingResult = checkGeofencing(
          event.eventLatitude,
          event.eventLongitude,
          participantLatitude,
          participantLongitude
        );

        geofencingStatus = getGeofencingStatusMessage(geofencingResult);
      }

      // Prepare update data
      const updateData = {
        participantLatitude:
          participantLatitude || existingAttendance.participantLatitude,
        participantLongitude:
          participantLongitude || existingAttendance.participantLongitude,
        amInTime: amInTime ? new Date(amInTime) : existingAttendance.amInTime,
        amOutTime: amOutTime
          ? new Date(amOutTime)
          : existingAttendance.amOutTime,
        pmInTime: pmInTime ? new Date(pmInTime) : existingAttendance.pmInTime,
        pmOutTime: pmOutTime
          ? new Date(pmOutTime)
          : existingAttendance.pmOutTime,
        status: status || existingAttendance.status,
        notes: notes !== undefined ? notes : existingAttendance.notes,
        updatedAt: new Date(),
      };

      const updatedAttendance = await certService.updateIndividualAttendance(
        attendanceId,
        updateData
      );

      res.status(200).json({
        success: true,
        message: "Attendance record updated successfully",
        attendance: updatedAttendance,
        geofencing: geofencingResult
          ? {
              ...geofencingResult,
              status: geofencingStatus,
            }
          : null,
      });
    } catch (error) {
      console.error("❌ [updateIndividualAttendance] Error:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get Individual Attendance by User and Day
certRouter.get(
  "/getAttendanceByUserAndDay/:eventId/:userId/:dayNumber",
  async (req, res) => {
    try {
      const { eventId, userId, dayNumber } = req.params;

      if (!eventId || !userId || !dayNumber) {
        return res.status(400).json({
          success: false,
          error: "eventId, userId, and dayNumber are required",
        });
      }

      const attendance = await certService.getAttendanceByUserAndDay(
        parseInt(eventId),
        parseInt(userId),
        parseInt(dayNumber)
      );

      if (!attendance) {
        return res.status(404).json({
          success: false,
          error: "Attendance record not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Attendance record fetched successfully",
        attendance: attendance,
      });
    } catch (error) {
      console.error("❌ [getAttendanceByUserAndDay] Error:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Add Attendance Table (with URL parameters)
certRouter.post("/addAttendanceTable/:eventId/:dayNumber", async (req, res) => {
  try {
    const { eventId, dayNumber } = req.params;

    // Validation
    if (!eventId || !dayNumber) {
      return res.status(400).json({
        success: false,
        error: "eventId and dayNumber are required",
      });
    }

    // Get event details
    const event = await certService.getEventById(parseInt(eventId));
    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Check if day number is valid (within event duration)
    if (parseInt(dayNumber) < 1 || parseInt(dayNumber) > event.numberOfDays) {
      return res.status(400).json({
        success: false,
        error: `Day number must be between 1 and ${event.numberOfDays}`,
      });
    }

    // Check if attendance table already exists for this day
    const existingAttendanceTable = await certService.getAttendanceTableByDay(
      parseInt(eventId),
      parseInt(dayNumber)
    );
    if (existingAttendanceTable) {
      return res.status(400).json({
        success: false,
        error: `Attendance table for Day ${dayNumber} already exists`,
      });
    }

    // Create attendance table structure (empty table ready for participants)
    const attendanceTableData = {
      eventId: parseInt(eventId),
      dayNumber: parseInt(dayNumber),
    };

    // Save the attendance table to database
    const createdAttendanceTable = await certService.addAttendanceTable(
      attendanceTableData
    );

    // Broadcast table creation to event room (HTTP and HTTPS)
    broadcastTableCreatedBoth(req, eventId, {
      ...createdAttendanceTable,
      eventTitle: event.name,
      dayNumber: parseInt(dayNumber),
    });

    res.status(201).json({
      success: true,
      message: `Successfully added attendance table for Day ${dayNumber}`,
      attendanceTable: createdAttendanceTable,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Add Meal Attendance Table (with URL parameters)
certRouter.post(
  "/addMealAttendanceTable/:eventId/:dayNumber",
  async (req, res) => {
    try {
      const { eventId, dayNumber } = req.params;

      // Validation
      if (!eventId || !dayNumber) {
        return res.status(400).json({
          success: false,
          error: "eventId and dayNumber are required",
        });
      }

      // Get event details
      const event = await certService.getEventById(parseInt(eventId));
      if (!event) {
        return res.status(404).json({
          success: false,
          error: "Event not found",
        });
      }

      // Check if day number is valid (within event duration)
      if (parseInt(dayNumber) < 1 || parseInt(dayNumber) > event.numberOfDays) {
        return res.status(400).json({
          success: false,
          error: `Day number must be between 1 and ${event.numberOfDays}`,
        });
      }

      // Check if meal attendance table already exists for this day
      const existingMealAttendanceTable =
        await certService.getMealAttendanceTableByDay(
          parseInt(eventId),
          parseInt(dayNumber)
        );
      if (existingMealAttendanceTable) {
        return res.status(400).json({
          success: false,
          error: `Meal attendance table for Day ${dayNumber} already exists`,
        });
      }

      // Create meal attendance table structure (empty table ready for participants)
      const mealAttendanceTableData = {
        eventId: parseInt(eventId),
        dayNumber: parseInt(dayNumber),
      };

      // Save the meal attendance table to database
      const createdMealAttendanceTable =
        await certService.addMealAttendanceTable(mealAttendanceTableData);

      // Broadcast table creation to event room (HTTP and HTTPS)
      broadcastTableCreatedBoth(req, eventId, {
        ...createdMealAttendanceTable,
        eventTitle: event.name,
        dayNumber: parseInt(dayNumber),
        tableType: "meal",
      });

      res.status(201).json({
        success: true,
        message: `Successfully added meal attendance table for Day ${dayNumber}`,
        mealAttendanceTable: createdMealAttendanceTable,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// ==================== ATTENDANCE TABLES ROUTES ====================

// Get Attendance Tables by Event
certRouter.get("/getAttendanceTablesByEvent/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        error: "Valid eventId is required",
      });
    }

    const attendanceTables = await certService.getAttendanceTablesByEvent(
      eventId
    );

    res.status(200).json({
      success: true,
      message: "Attendance tables fetched successfully",
      attendanceTables: attendanceTables,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get Attendance Table by Day
certRouter.get(
  "/getAttendanceTableByDay/:eventId/:dayNumber",
  async (req, res) => {
    try {
      const { eventId, dayNumber } = req.params;

      if (!eventId || isNaN(eventId) || !dayNumber || isNaN(dayNumber)) {
        return res.status(400).json({
          success: false,
          error: "Valid eventId and dayNumber are required",
        });
      }

      const attendanceTable = await certService.getAttendanceTableByDay(
        eventId,
        dayNumber
      );

      res.status(200).json({
        success: true,
        message: "Attendance table fetched successfully",
        attendanceTable: attendanceTable,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// ==================== MEAL ATTENDANCE TABLES ROUTES ====================

// Get Meal Attendance Tables by Event
certRouter.get("/getMealAttendanceTablesByEvent/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        error: "Valid eventId is required",
      });
    }

    const mealAttendanceTables =
      await certService.getMealAttendanceTablesByEvent(eventId);

    res.status(200).json({
      success: true,
      message: "Meal attendance tables fetched successfully",
      mealAttendanceTables: mealAttendanceTables,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get Meal Attendance Table by Day
certRouter.get(
  "/getMealAttendanceTableByDay/:eventId/:dayNumber",
  async (req, res) => {
    try {
      const { eventId, dayNumber } = req.params;

      if (!eventId || isNaN(eventId) || !dayNumber || isNaN(dayNumber)) {
        return res.status(400).json({
          success: false,
          error: "Valid eventId and dayNumber are required",
        });
      }

      const mealAttendanceTable = await certService.getMealAttendanceTableByDay(
        eventId,
        dayNumber
      );

      res.status(200).json({
        success: true,
        message: "Meal attendance table fetched successfully",
        mealAttendanceTable: mealAttendanceTable,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// ==================== QR CODE GENERATION ROUTES ====================

// Generate QR Code for Attendance Table
certRouter.post(
  "/generateAttendanceQRCode/:eventId/:dayNumber",
  async (req, res) => {
    try {
      const { eventId, dayNumber } = req.params;

      if (!eventId || isNaN(eventId) || !dayNumber || isNaN(dayNumber)) {
        return res.status(400).json({
          success: false,
          error: "Valid eventId and dayNumber are required",
        });
      }

      const attendanceTable = await certService.generateAttendanceTableQRCode(
        eventId,
        dayNumber
      );

      res.status(200).json({
        success: true,
        message: "Attendance QR code generated successfully",
        attendanceTable: attendanceTable,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Generate QR Code for Meal Attendance Table
certRouter.post(
  "/generateMealAttendanceQRCode/:eventId/:dayNumber",
  async (req, res) => {
    try {
      const { eventId, dayNumber } = req.params;

      if (!eventId || isNaN(eventId) || !dayNumber || isNaN(dayNumber)) {
        return res.status(400).json({
          success: false,
          error: "Valid eventId and dayNumber are required",
        });
      }

      const mealAttendanceTable =
        await certService.generateMealAttendanceTableQRCode(eventId, dayNumber);

      res.status(200).json({
        success: true,
        message: "Meal attendance QR code generated successfully",
        mealAttendanceTable: mealAttendanceTable,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Generate QR Code for AM Out Attendance
certRouter.post(
  "/generateAMOutAttendanceQRCode/:eventId/:dayNumber",
  async (req, res) => {
    try {
      const { eventId, dayNumber } = req.params;

      const qrCodeData = await certService.generateAMOutAttendanceQRCode(
        eventId,
        dayNumber
      );

      res.status(200).json({
        success: true,
        message: "AM Out attendance QR code generated successfully",
        qrCodeData: qrCodeData,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Generate QR Code for PM In Attendance
certRouter.post(
  "/generatePMInAttendanceQRCode/:eventId/:dayNumber",
  async (req, res) => {
    try {
      const { eventId, dayNumber } = req.params;

      const qrCodeData = await certService.generatePMInAttendanceQRCode(
        eventId,
        dayNumber
      );

      res.status(200).json({
        success: true,
        message: "PM In attendance QR code generated successfully",
        qrCodeData: qrCodeData,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Generate QR Code for PM Out Attendance
certRouter.post(
  "/generatePMOutAttendanceQRCode/:eventId/:dayNumber",
  async (req, res) => {
    try {
      const { eventId, dayNumber } = req.params;

      const qrCodeData = await certService.generatePMOutAttendanceQRCode(
        eventId,
        dayNumber
      );

      res.status(200).json({
        success: true,
        message: "PM Out attendance QR code generated successfully",
        qrCodeData: qrCodeData,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Record Attendance Phase (AM Out, PM In, PM Out)
certRouter.post(
  "/recordAttendancePhase",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId, dayNumber, attendancePhase, qrData } = req.body;
      const userId = req.user.id;

      console.log(`🔍 [recordAttendancePhase route] Request data:`, {
        eventId,
        dayNumber,
        attendancePhase,
        userId,
        user: req.user,
      });

      if (!eventId || !dayNumber || !attendancePhase || !qrData) {
        return res.status(400).json({
          success: false,
          error:
            "Missing required fields: eventId, dayNumber, attendancePhase, qrData",
        });
      }

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "User not authenticated. Please log in again.",
        });
      }

      // Validate QR code data
      if (
        !qrData ||
        qrData.type !== `attendance_${attendancePhase}` ||
        qrData.eventId !== parseInt(eventId) ||
        qrData.dayNumber !== parseInt(dayNumber)
      ) {
        return res.status(400).json({
          success: false,
          error: "Invalid QR code data for this attendance phase",
        });
      }

      // Get event details to check if user is the creator
      const event = await certService.getEventById(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          error: "Event not found",
        });
      }

      // Prevent event creators from recording attendance on their own events
      if (event.createdBy === userId) {
        return res.status(403).json({
          success: false,
          error:
            "Event creators cannot record attendance on their own events. You can only monitor this event.",
        });
      }

      // Get user's location from request body (passed from frontend)
      const participantLocation = req.body.participantLocation || null;

      // Record the attendance phase
      const result = await certService.recordAttendancePhase(
        userId,
        eventId,
        dayNumber,
        attendancePhase,
        participantLocation
      );

      res.status(200).json({
        success: true,
        message: result.message,
        attendance: result.attendance,
        phase: result.phase,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// ==================== EVENT PARTICIPATION ROUTES ====================

// Join Event
certRouter.post("/joinEvent/:eventId", authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { participantLocation } = req.body; // Optional location data
    const userId = req.user.id;

    // Get event details for validation
    const event = await certService.getEventById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Prevent event creators from joining their own events
    if (event.createdBy === userId) {
      return res.status(403).json({
        success: false,
        error:
          "Event creators cannot join their own events. You can only monitor this event.",
      });
    }

    // Check if event has completely ended (past the last day)
    const { isEventEnded, canJoinEvent } = require("../Utils/timeValidation");
    if (isEventEnded(event.date, event.numberOfDays, event.endTime)) {
      return res.status(400).json({
        success: false,
        error: "Cannot join event. The event has completely ended.",
      });
    }

    // Check if event has started (allow joining only after start time)
    if (!canJoinEvent(event.date, event.startTime)) {
      return res.status(400).json({
        success: false,
        error: "Cannot join event. The event has not started yet.",
      });
    }

    const participation = await certService.joinEvent(
      userId,
      parseInt(eventId)
    );

    // Automatically record attendance on join
    let attendanceResult = null;
    try {
      // Determine correct attendance phase based on current time and event start time
      // Use local time (Philippines timezone) for phase detection
      const currentTime = new Date();
      const philippinesTime = new Date(
        currentTime.toLocaleString("en-US", { timeZone: "Asia/Manila" })
      );
      const currentHour = philippinesTime.getHours();
      const currentMinute = philippinesTime.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      // Parse event times
      const { parseEventTime } = require("../Utils/timeValidation");
      const eventStartTime = parseEventTime(event.startTime);
      let eventStartMinutes = null;
      if (eventStartTime) {
        eventStartMinutes = eventStartTime.hour * 60 + eventStartTime.minute;
      }

      // Parse PM time ranges from event
      const pmInStartTime = parseEventTime(event.pmInStartTime || "13:00");
      const pmInEndTime = parseEventTime(event.pmInEndTime || "13:30");
      const pmOutStartTime = parseEventTime(event.pmOutStartTime || "17:00");
      const pmOutEndTime = parseEventTime(event.pmOutEndTime || "18:00");

      // Convert to minutes for comparison
      const pmInStartMinutes = pmInStartTime
        ? pmInStartTime.hour * 60 + pmInStartTime.minute
        : 13 * 60;
      const pmInEndMinutes = pmInEndTime
        ? pmInEndTime.hour * 60 + pmInEndTime.minute
        : 13 * 60 + 30;
      const pmOutStartMinutes = pmOutStartTime
        ? pmOutStartTime.hour * 60 + pmOutStartTime.minute
        : 17 * 60;
      const pmOutEndMinutes = pmOutEndTime
        ? pmOutEndTime.hour * 60 + pmOutEndTime.minute
        : 18 * 60;

      // Determine phase based on current time and event-specific time ranges
      let attendancePhase = "am_in"; // Default fallback

      // Check if current time is within PM IN range
      if (
        currentTimeInMinutes >= pmInStartMinutes &&
        currentTimeInMinutes <= pmInEndMinutes
      ) {
        attendancePhase = "pm_in";
      }
      // Check if current time is within PM OUT range (universal 5:00 PM - 6:00 PM)
      else if (
        currentTimeInMinutes >= 17 * 60 && // 5:00 PM
        currentTimeInMinutes <= 18 * 60 // 6:00 PM
      ) {
        attendancePhase = "pm_out";
      }
      // Check if current time is in morning (before PM IN start time)
      else if (currentTimeInMinutes < pmInStartMinutes) {
        // Check if it's AM OUT time (12:00 PM - 12:59 PM)
        if (
          currentTimeInMinutes >= 12 * 60 &&
          currentTimeInMinutes <= 12 * 60 + 59
        ) {
          attendancePhase = "am_out";
        } else {
          attendancePhase = "am_in";
        }
      }
      // After PM OUT end time - default to am_in for next day
      else {
        attendancePhase = "am_in";
      }

      console.log(
        `🔍 [Join Event] Current time (Philippines): ${philippinesTime.toLocaleTimeString()}, Phase: ${attendancePhase}`
      );
      console.log(`🔍 [Join Event] Time debugging:`, {
        currentTimeInMinutes,
        pmOutStartMinutes: 17 * 60, // 5:00 PM (universal)
        pmOutEndMinutes: 18 * 60, // 6:00 PM (universal)
        pmOutStartTime: "17:00 (universal)",
        pmOutEndTime: "18:00 (universal)",
        isWithinPMOutRange:
          currentTimeInMinutes >= 17 * 60 && currentTimeInMinutes <= 18 * 60,
      });

      attendanceResult = await certService.recordAttendanceOnJoin(
        userId,
        parseInt(eventId),
        participantLocation,
        attendancePhase
      );
    } catch (attendanceError) {
      // Log attendance error but don't fail the join
      console.log(
        `Attendance recording failed for user ${userId} joining event ${eventId}:`,
        attendanceError.message
      );
    }

    // Broadcast participant join to event room (HTTP and HTTPS)
    broadcastParticipantActionBoth(
      req,
      eventId,
      {
        userId: userId,
        userName: req.user.name,
        userEmail: req.user.email,
        participation: participation,
        attendance: attendanceResult,
      },
      "joined"
    );

    res.status(200).json({
      success: true,
      message: "Successfully joined event",
      data: participation,
      attendance: attendanceResult,
      isLate: participation.isLate,
      requiresValidation: participation.requiresValidation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Unjoin Event
certRouter.post(
  "/unjoinEvent/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;

      const participation = await certService.unjoinEvent(
        userId,
        parseInt(eventId)
      );

      // Broadcast participant unjoin to event room (HTTP and HTTPS)
      broadcastParticipantActionBoth(
        req,
        eventId,
        {
          userId: userId,
          userName: req.user.name,
          userEmail: req.user.email,
          participation: participation,
        },
        "left"
      );

      res.status(200).json({
        success: true,
        message: "Successfully unjoined event",
        data: participation,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get User Event Participations
certRouter.get(
  "/userEventParticipations",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const participations = await certService.getUserEventParticipations(
        userId
      );

      res.status(200).json({
        success: true,
        data: participations,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Check User Event Participation
certRouter.get(
  "/checkParticipation/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;

      const participation = await certService.checkUserEventParticipation(
        userId,
        parseInt(eventId)
      );

      res.status(200).json({
        success: true,
        data: participation,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get Event Participants
certRouter.get(
  "/eventParticipants/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId } = req.params;

      const participants = await certService.getEventParticipants(
        parseInt(eventId)
      );

      res.status(200).json({
        success: true,
        data: participants,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Generate Email Code for Event Joining
certRouter.post(
  "/generateEmailCode/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;

      const emailCode = await certService.generateEmailCodeService(
        eventId,
        userId
      );

      // Get user email for sending the code
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, fullName: true },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      // Get event details for email
      const event = await prisma.event.findUnique({
        where: { id: parseInt(eventId) },
        select: { name: true, date: true, location: true },
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          error: "Event not found",
        });
      }

      // Send email with the code
      const sendEmail = require("../Middlewares/sendEmail");
      const emailSubject = `Join Code for ${event.name}`;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d3748;">Join Event Code</h2>
          <p>Hello ${user.fullName},</p>
          <p>You requested to join the event "<strong>${
            event.name
          }</strong>".</p>
        <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h3 style="color: #2d3748; margin: 0;">Your Join Code</h3>
          <div style="font-size: 32px; font-weight: bold; color: #3182ce; letter-spacing: 4px; margin: 10px 0;">
            ${emailCode}
          </div>
          <p style="color: #718096; font-size: 14px; margin: 0;">This code expires in 5 minutes</p>
        </div>
        <p><strong>Event Details:</strong></p>
        <ul>
          <li><strong>Event:</strong> ${event.name}</li>
          <li><strong>Date:</strong> ${new Date(
            event.date
          ).toLocaleDateString()}</li>
          <li><strong>Location:</strong> ${event.location}</li>
        </ul>
        <p>Use this code in the application to join the event.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #718096; font-size: 12px;">
          This is an automated message from SDOIC Professional Development Attendance and Certification System.
        </p>
      </div>
    `;

      await sendEmail(user.email, emailSubject, emailHtml);

      res.status(200).json({
        success: true,
        message: "Email code generated and sent successfully",
        data: {
          emailCode: emailCode,
          expiresIn: "5 minutes",
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Validate Email Code for Event Joining
certRouter.post(
  "/validateEmailCode/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const { emailCode, participantLocation } = req.body; // Optional location data
      const userId = req.user.id;

      if (!emailCode) {
        return res.status(400).json({
          success: false,
          error: "Email code is required",
        });
      }

      const result = await certService.validateEmailCodeService(
        eventId,
        userId,
        emailCode
      );

      if (result.valid) {
        // Automatically record attendance after successful email code validation
        let attendanceResult = null;
        try {
          attendanceResult = await certService.recordAttendanceOnJoin(
            userId,
            parseInt(eventId),
            participantLocation
          );
        } catch (attendanceError) {
          // Log attendance error but don't fail the email code validation
          console.log(
            `Attendance recording failed for user ${userId} after email code validation for event ${eventId}:`,
            attendanceError.message
          );
        }

        res.status(200).json({
          success: true,
          message: result.message,
          attendance: attendanceResult,
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.message,
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Generate QR Code Data for Event
certRouter.get(
  "/generateEventQRCode/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId } = req.params;

      const qrData = await certService.generateEventQRCodeDataService(eventId);

      res.status(200).json({
        success: true,
        message: "QR code data generated successfully",
        data: qrData,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// ==================== DEDICATED ATTENDANCE PHASE ENDPOINTS ====================

// AM IN Attendance
certRouter.post("/attendance/am-in", authenticateToken, async (req, res) => {
  try {
    const { eventId, dayNumber = 1, participantLocation } = req.body;
    const userId = req.user.id;

    console.log(
      `🎯 [AM IN] User ${userId} recording AM IN for event ${eventId}, day ${dayNumber}`
    );

    // Check if user already has attendance record for this day
    const existingAttendance = await certService.getAttendanceByUserAndDay(
      eventId,
      userId,
      dayNumber
    );

    let result;
    if (existingAttendance) {
      // Update existing record with AM IN time
      result = await certService.recordAttendancePhase(
        userId,
        eventId,
        dayNumber,
        "am_in",
        participantLocation
      );
    } else {
      // Create new record with AM IN time
      result = await certService.recordAttendanceOnJoin(
        userId,
        eventId,
        participantLocation,
        "am_in"
      );
    }

    res.status(200).json({
      success: true,
      message: "AM IN attendance recorded successfully",
      attendance: result,
    });
  } catch (error) {
    console.error("Error recording AM IN attendance:", error);
    res.status(500).json({
      success: false,
      error: "Failed to record AM IN attendance",
    });
  }
});

// AM OUT Attendance
certRouter.post("/attendance/am-out", authenticateToken, async (req, res) => {
  try {
    const { eventId, dayNumber = 1, participantLocation } = req.body;
    const userId = req.user.id;

    console.log(
      `🎯 [AM OUT] User ${userId} recording AM OUT for event ${eventId}, day ${dayNumber}`
    );

    // Check if user already has attendance record for this day
    const existingAttendance = await certService.getAttendanceByUserAndDay(
      eventId,
      userId,
      dayNumber
    );

    console.log(`🔍 [AM OUT] Existing attendance check:`, {
      eventId,
      userId,
      dayNumber,
      existingAttendance: existingAttendance ? "FOUND" : "NOT FOUND",
    });

    let result;
    if (existingAttendance) {
      // Update existing record with AM OUT time
      result = await certService.recordAttendancePhase(
        userId,
        eventId,
        dayNumber,
        "am_out",
        participantLocation
      );
    } else {
      // Create new attendance record for this day (Day 2, 3, etc.)
      // Use recordAttendancePhase with a special flag to create new record
      result = await certService.recordAttendancePhase(
        userId,
        eventId,
        dayNumber,
        "am_out",
        participantLocation,
        true // createIfNotExists flag
      );
    }

    console.log(`✅ [AM OUT] Attendance recorded successfully:`, {
      userId,
      eventId,
      dayNumber,
      result,
    });

    res.status(200).json({
      success: true,
      message: "AM OUT attendance recorded successfully",
      attendance: result,
    });
  } catch (error) {
    console.error("Error recording AM OUT attendance:", error);
    res.status(500).json({
      success: false,
      error: "Failed to record AM OUT attendance",
    });
  }
});

// PM IN Attendance
certRouter.post("/attendance/pm-in", authenticateToken, async (req, res) => {
  try {
    const { eventId, dayNumber = 1, participantLocation } = req.body;
    const userId = req.user.id;

    console.log(
      `🎯 [PM IN] User ${userId} recording PM IN for event ${eventId}, day ${dayNumber}`
    );

    // Check if user already has attendance record for this day
    const existingAttendance = await certService.getAttendanceByUserAndDay(
      eventId,
      userId,
      dayNumber
    );

    console.log(`🔍 [PM IN] Existing attendance check:`, {
      eventId,
      userId,
      dayNumber,
      existingAttendance: existingAttendance ? "FOUND" : "NOT FOUND",
    });

    let result;
    if (existingAttendance) {
      // Update existing record with PM IN time
      result = await certService.recordAttendancePhase(
        userId,
        eventId,
        dayNumber,
        "pm_in",
        participantLocation
      );
    } else {
      // Create new record with PM IN time
      result = await certService.recordAttendanceOnJoin(
        userId,
        eventId,
        participantLocation,
        "pm_in"
      );
    }

    console.log(`✅ [PM IN] Attendance recorded successfully:`, {
      userId,
      eventId,
      dayNumber,
      result,
    });

    res.status(200).json({
      success: true,
      message: "PM IN attendance recorded successfully",
      attendance: result,
    });
  } catch (error) {
    console.error("Error recording PM IN attendance:", error);
    res.status(500).json({
      success: false,
      error: "Failed to record PM IN attendance",
    });
  }
});

// PM OUT Attendance
certRouter.post("/attendance/pm-out", authenticateToken, async (req, res) => {
  try {
    const { eventId, dayNumber = 1, participantLocation } = req.body;
    const userId = req.user.id;

    console.log(
      `🎯 [PM OUT] User ${userId} recording PM OUT for event ${eventId}, day ${dayNumber}`
    );

    // Check if user already has attendance record for this day
    const existingAttendance = await certService.getAttendanceByUserAndDay(
      eventId,
      userId,
      dayNumber
    );

    console.log(`🔍 [PM OUT] Existing attendance check:`, {
      eventId,
      userId,
      dayNumber,
      existingAttendance: existingAttendance ? "FOUND" : "NOT FOUND",
    });

    let result;
    if (existingAttendance) {
      // Update existing record with PM OUT time
      result = await certService.recordAttendancePhase(
        userId,
        eventId,
        dayNumber,
        "pm_out",
        participantLocation
      );
    } else {
      // Create new attendance record for this day (Day 2, 3, etc.)
      // Use recordAttendancePhase with a special flag to create new record
      result = await certService.recordAttendancePhase(
        userId,
        eventId,
        dayNumber,
        "pm_out",
        participantLocation,
        true // createIfNotExists flag
      );
    }

    console.log(`✅ [PM OUT] Attendance recorded successfully:`, {
      userId,
      eventId,
      dayNumber,
      result,
    });

    res.status(200).json({
      success: true,
      message: "PM OUT attendance recorded successfully",
      attendance: result,
    });
  } catch (error) {
    console.error("Error recording PM OUT attendance:", error);
    res.status(500).json({
      success: false,
      error: "Failed to record PM OUT attendance",
    });
  }
});

// Join Event with QR Code
certRouter.post(
  "/joinEventWithQRCode/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const { qrData, participantLocation } = req.body;
      const userId = req.user.id;

      if (!qrData) {
        return res.status(400).json({
          success: false,
          error: "QR code data is required",
        });
      }

      // Get event details for validation
      const event = await certService.getEventById(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          error: "Event not found",
        });
      }

      // Prevent event creators from joining their own events
      if (event.createdBy === userId) {
        return res.status(403).json({
          success: false,
          error:
            "Event creators cannot join their own events. You can only monitor this event.",
        });
      }

      // Check if event has completely ended (past the last day)
      const { isEventEnded, canJoinEvent } = require("../Utils/timeValidation");
      if (isEventEnded(event.date, event.numberOfDays, event.endTime)) {
        return res.status(400).json({
          success: false,
          error: "Cannot join event. The event has completely ended.",
        });
      }

      // Check if event has started (allow joining only after start time)
      if (!canJoinEvent(event.date, event.startTime)) {
        return res.status(400).json({
          success: false,
          error: "Cannot join event. The event has not started yet.",
        });
      }

      const result = await certService.joinEventWithQRCodeService(
        eventId,
        userId,
        qrData
      );

      if (result.success) {
        // Automatically record attendance after successful QR code join
        let attendanceResult = null;
        try {
          attendanceResult = await certService.recordAttendanceOnJoin(
            userId,
            parseInt(eventId),
            participantLocation
          );
        } catch (attendanceError) {
          // Log attendance error but don't fail the join
          console.log(
            `Attendance recording failed for user ${userId} after QR code join for event ${eventId}:`,
            attendanceError.message
          );
        }

        res.status(200).json({
          success: true,
          message: result.message,
          attendance: attendanceResult,
          isLate: result.isLate,
          requiresValidation: result.requiresValidation,
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.message,
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

certRouter.post("/scanAttendanceQR", authenticateToken, async (req, res) => {
  try {
    const { qrData, participantLocation } = req.body;
    const userId = req.user.id;

    if (!qrData) {
      return res.status(400).json({
        success: false,
        error: "QR code data is required",
      });
    }

    // Parse QR data to determine which dedicated endpoint to call
    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        error: "Invalid QR code format",
      });
    }

    const { eventId, dayNumber = 1 } = parsedData;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        error: "QR code missing event information",
      });
    }

    // Determine which dedicated endpoint to call based on QR type
    let endpoint;
    if (parsedData.type === "attendance_am_in") {
      endpoint = "/attendance/am-in";
    } else if (parsedData.type === "attendance_am_out") {
      endpoint = "/attendance/am-out";
    } else if (parsedData.type === "attendance_pm_in") {
      endpoint = "/attendance/pm-in";
    } else if (parsedData.type === "attendance_pm_out") {
      endpoint = "/attendance/pm-out";
    } else {
      // Default to AM IN for legacy QR codes
      endpoint = "/attendance/am-in";
    }

    // Call the appropriate dedicated endpoint
    const response = await fetch(`https://sdoic-certigo.depedimuscity.com:5017${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
      },
      body: JSON.stringify({
        eventId,
        dayNumber,
        participantLocation,
      }),
    });

    const result = await response.json();
    res.status(response.status).json(result);
  } catch (error) {
    console.error("Error in legacy scanAttendanceQR:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Get User's Attendance Status for an Event
certRouter.get(
  "/getUserAttendance/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;

      if (!eventId || isNaN(eventId)) {
        return res.status(400).json({
          success: false,
          error: "Valid event ID is required",
        });
      }

      const userAttendance = await certService.getAttendanceByUserAndEvent(
        eventId,
        userId
      );

      res.status(200).json({
        success: true,
        message: "User attendance fetched successfully",
        attendance: userAttendance,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Validate Attendance Record
certRouter.put(
  "/validateAttendance/:attendanceId",
  authenticateToken,
  async (req, res) => {
    try {
      const { attendanceId } = req.params;
      console.log(
        `🔍 [validateAttendance Route] Validating attendance: ${attendanceId}`
      );

      if (!attendanceId || isNaN(attendanceId)) {
        console.log(
          `❌ [validateAttendance Route] Invalid attendanceId: ${attendanceId}`
        );
        return res.status(400).json({
          success: false,
          error: "Valid attendance ID is required",
        });
      }

      const result = await certService.validateAttendanceRecord(attendanceId);
      console.log(`📊 [validateAttendance Route] Validation result:`, result);

      // Broadcast attendance validation to all connected clients
      broadcastNotificationBoth(req, {
        type: "attendance_validated",
        message: "Attendance record validated successfully",
        attendanceId: attendanceId,
        attendance: result,
        timestamp: new Date().toISOString(),
      });

      res.status(200).json({
        success: true,
        message: "Attendance record validated successfully",
        attendance: result,
      });
    } catch (error) {
      console.error(`❌ [validateAttendance Route] Error:`, error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Reject Attendance Record
certRouter.put(
  "/rejectAttendance/:attendanceId",
  authenticateToken,
  async (req, res) => {
    try {
      const { attendanceId } = req.params;
      console.log(
        `🔍 [rejectAttendance Route] Rejecting attendance: ${attendanceId}`
      );

      if (!attendanceId || isNaN(attendanceId)) {
        console.log(
          `❌ [rejectAttendance Route] Invalid attendanceId: ${attendanceId}`
        );
        return res.status(400).json({
          success: false,
          error: "Valid attendance ID is required",
        });
      }

      const result = await certService.rejectAttendanceRecord(attendanceId);
      console.log(`📊 [rejectAttendance Route] Rejection result:`, result);

      // Broadcast attendance rejection to all connected clients
      broadcastNotificationBoth(req, {
        type: "attendance_rejected",
        message: "Attendance record rejected successfully",
        attendanceId: attendanceId,
        attendance: result,
        timestamp: new Date().toISOString(),
      });

      res.status(200).json({
        success: true,
        message: "Attendance record rejected successfully",
        attendance: result,
      });
    } catch (error) {
      console.error(`❌ [rejectAttendance Route] Error:`, error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// ==================== CERTIFICATE ROUTES ====================

// Get All Certificates
certRouter.get("/getAllCertificates", authenticateToken, async (req, res) => {
  try {
    const certificates = await certService.getAllCertificates();
    res.status(200).json({
      success: true,
      message: "Certificates fetched successfully",
      certificates: certificates,
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get User Certificates (for participants to see only their own certificates)
certRouter.get("/getUserCertificates", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const certificates = await certService.getUserCertificates(userId);
    res.status(200).json({
      success: true,
      message: "User certificates fetched successfully",
      certificates: certificates,
    });
  } catch (error) {
    console.error("Error fetching user certificates:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get certificates for proponent's events
certRouter.get(
  "/getProponentCertificates",
  authenticateToken,
  async (req, res) => {
    try {
      const proponentId = req.user.id;
      const certificates = await certService.getCertificatesByProponent(
        proponentId
      );
      res.status(200).json({
        success: true,
        message: "Proponent certificates fetched successfully",
        certificates: certificates,
      });
    } catch (error) {
      console.error("Error fetching proponent certificates:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get certificates by school (for school heads)
certRouter.get(
  "/getSchoolCertificates",
  authenticateToken,
  async (req, res) => {
    try {
      const schoolName = req.user.schoolName;
      const certificates = await certService.getCertificatesBySchool(
        schoolName
      );
      res.status(200).json({
        success: true,
        message: "School certificates fetched successfully",
        certificates: certificates,
      });
    } catch (error) {
      console.error("Error fetching school certificates:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get Certificate by ID
certRouter.get("/getCertificate/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const certificateId = parseInt(id, 10);

    if (isNaN(certificateId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid certificate ID provided",
      });
    }

    const certificate = await certService.getCertificateById(certificateId);
    res.status(200).json({
      success: true,
      message: "Certificate fetched successfully",
      certificate: certificate,
    });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get Certificates by Event
certRouter.get(
  "/getCertificatesByEvent/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const eventIdInt = parseInt(eventId, 10);

      if (isNaN(eventIdInt)) {
        return res.status(400).json({
          success: false,
          error: "Invalid event ID provided",
        });
      }

      const certificates = await certService.getCertificatesByEvent(eventIdInt);
      res.status(200).json({
        success: true,
        message: "Event certificates fetched successfully",
        certificates: certificates,
      });
    } catch (error) {
      console.error("Error fetching event certificates:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// ==================== CERTIFICATE GENERATION ROUTES ====================

// Generate certificates for all participants in an event
certRouter.post(
  "/generateCertificatesForEvent/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const { certType } = req.body; // Certificate type: Appearance, Participation, Recognition
      const issuedBy = req.user.id;

      const eventIdInt = parseInt(eventId, 10);

      if (isNaN(eventIdInt)) {
        return res.status(400).json({
          success: false,
          error: "Invalid event ID provided",
        });
      }

      // Validate certificate type
      const validCertTypes = ["Appearance", "Participation", "Recognition"];
      const selectedCertType = certType || "Recognition"; // Default to Recognition

      if (!validCertTypes.includes(selectedCertType)) {
        return res.status(400).json({
          success: false,
          error: `Invalid certificate type. Must be one of: ${validCertTypes.join(
            ", "
          )}`,
        });
      }

      console.log(
        `🔍 [generateCertificatesForEvent] Generating ${selectedCertType} certificates for event: ${eventIdInt}`
      );

      const certificates = await certService.generateCertificatesForEvent(
        eventIdInt,
        issuedBy,
        null, // templateId
        selectedCertType,
        req.user.role,
        req.user.schoolName
      );

      res.status(200).json({
        success: true,
        message: `${selectedCertType} certificates generated successfully`,
        certificates: certificates,
        count: certificates.length,
      });
    } catch (error) {
      console.error("Error generating certificates:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Generate individual certificate for a specific participant
certRouter.post(
  "/generateIndividualCertificate/:eventId/:userId",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId, userId } = req.params;
      const { certType, eventRole } = req.body; // Certificate type and optional event role
      const issuedBy = req.user.id;

      const eventIdInt = parseInt(eventId, 10);
      const userIdInt = parseInt(userId, 10);

      if (isNaN(eventIdInt) || isNaN(userIdInt)) {
        return res.status(400).json({
          success: false,
          error: "Invalid event ID or user ID provided",
        });
      }

      // Validate certificate type
      const validCertTypes = ["Appearance", "Participation", "Recognition"];
      const selectedCertType = certType || "Recognition"; // Default to Recognition

      if (!validCertTypes.includes(selectedCertType)) {
        return res.status(400).json({
          success: false,
          error: `Invalid certificate type. Must be one of: ${validCertTypes.join(
            ", "
          )}`,
        });
      }

      console.log(
        `🔍 [generateIndividualCertificate] Generating ${selectedCertType} certificate for user: ${userIdInt} in event: ${eventIdInt}, eventRole: ${
          eventRole || "default"
        }`
      );

      const certificate = await certService.generateIndividualCertificate(
        eventIdInt,
        userIdInt,
        issuedBy,
        null, // templateId
        selectedCertType,
        eventRole || null // Optional event role for Recognition certificates
      );

      res.status(200).json({
        success: true,
        message: `${selectedCertType} certificate generated successfully`,
        certificate: certificate,
      });
    } catch (error) {
      console.error("Error generating individual certificate:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Download certificate PDF
certRouter.get(
  "/downloadCertificate/:certificateId",
  authenticateToken,
  async (req, res) => {
    try {
      const { certificateId } = req.params;
      const certificateIdInt = parseInt(certificateId, 10);

      if (isNaN(certificateIdInt)) {
        return res.status(400).json({
          success: false,
          error: "Invalid certificate ID provided",
        });
      }

      console.log(
        `🔍 [downloadCertificate] Downloading certificate: ${certificateIdInt}`
      );

      const result = await certService.downloadCertificate(certificateIdInt);

      if (!result || !result.pdfBuffer) {
        return res.status(404).json({
          success: false,
          error: "Certificate PDF not found",
        });
      }

      // Set appropriate headers for PDF download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="Certificate_${result.certificateNumber}.pdf"`
      );
      res.setHeader("Content-Length", result.pdfBuffer.length);

      // Send the PDF buffer
      res.send(result.pdfBuffer);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// ==================== TRAINED PARTICIPANTS ROUTES ====================

// Get all trained participants
certRouter.get(
  "/getTrainedParticipants",
  authenticateToken,
  async (req, res) => {
    try {
      // Pass proponentId if user is a proponent
      const proponentId = req.user.role === "proponent" ? req.user.id : null;

      const participants = await certService.getTrainedParticipants(
        req.user.role,
        req.user.schoolName,
        proponentId
      );

      res.status(200).json({
        success: true,
        message: "Trained participants fetched successfully",
        participants: participants,
      });
    } catch (error) {
      console.error("Error fetching trained participants:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get dashboard statistics
certRouter.get("/getDashboardStats", authenticateToken, async (req, res) => {
  try {
    const stats = await certService.getDashboardStats(
      req.user.role,
      req.user.schoolName
    );

    res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      stats: stats,
    });
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ==================== REPORTS ROUTES ====================

// Generate Excel attendance report for an event
certRouter.get(
  "/generateAttendanceReport/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const userRole = req.user.role;

      console.log(
        `📊 [generateAttendanceReport] User ${req.user.id} (${userRole}) requesting report for event ${eventId}`
      );

      // Check if user has permission (proponent or admin only)
      if (userRole !== "proponent" && userRole !== "administrator") {
        return res.status(403).json({
          success: false,
          error:
            "Access denied. Only proponents and administrators can generate reports.",
        });
      }

      // Get the report data
      const reportData = await certService.getEventAttendanceReport(eventId);

      // Generate Excel file
      const {
        generateEventAttendanceExcel,
      } = require("../Utils/generateExcelReport");
      const excelBuffer = await generateEventAttendanceExcel(reportData);

      // Format filename
      const eventName = reportData.event.name
        .replace(/[^a-zA-Z0-9]/g, "_")
        .substring(0, 50);
      const fileName = `Attendance_Report_${eventName}_${Date.now()}.xlsx`;

      // Set headers for file download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Length", excelBuffer.length);

      console.log(
        `✅ [generateAttendanceReport] Excel report generated: ${fileName}`
      );

      // Send the buffer
      res.send(excelBuffer);
    } catch (error) {
      console.error("❌ [generateAttendanceReport] Error:", error);
      res.status(400).json({
        success: false,
        error: error.message || "Failed to generate attendance report",
      });
    }
  }
);

module.exports = certRouter;
