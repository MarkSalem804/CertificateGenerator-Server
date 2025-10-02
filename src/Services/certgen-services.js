const certORM = require("../Database/certgen-database");
const {
  generateCertificatePDF,
  prepareCertificateData,
} = require("../Utils/generateCertificate");
const {
  calculateAttendanceDurations,
  generateDurationSummary,
} = require("../Utils/durationUtils");

async function addDesignation(designationName) {
  try {
    const newDesignation = await certORM.addDesignation(designationName);
    return newDesignation;
  } catch (error) {
    throw new Error("Error adding designation: " + error.message);
  }
}

async function getAllDesignations() {
  try {
    const designations = await certORM.getAllDesignations();
    return designations;
  } catch (error) {
    throw new Error("Error getting all designations: " + error.message);
  }
}

async function addUnit(unitName, designationId) {
  try {
    const newUnit = await certORM.addUnit(unitName, designationId);
    return newUnit;
  } catch (error) {
    throw new Error("Error adding unit: " + error.message);
  }
}

async function getAllUnits() {
  try {
    const units = await certORM.getAllUnits();
    return units;
  } catch (error) {
    throw new Error("Error getting all units: " + error.message);
  }
}

async function addSchool(schoolName, designationId) {
  try {
    const newSchool = await certORM.addSchool(schoolName, designationId);
    return newSchool;
  } catch (error) {
    throw new Error("Error adding school: " + error.message);
  }
}

async function getAllSchools() {
  try {
    const schools = await certORM.getAllSchools();
    return schools;
  } catch (error) {
    throw new Error("Error getting all schools: " + error.message);
  }
}

async function addPDProgram(programData) {
  try {
    const newProgram = await certORM.pdProgram(programData);
    return newProgram;
  } catch (error) {
    throw new Error("Error adding program: " + error.message);
  }
}

async function getAllPDPrograms() {
  try {
    const programs = await certORM.getAllPdPrograms();
    return programs;
  } catch (error) {
    throw new Error("Error getting all PD programs: " + error.message);
  }
}

async function addFundSource(fundSourceData) {
  try {
    const newFundSource = await certORM.addFundSource(fundSourceData);
    return newFundSource;
  } catch (error) {
    throw new Error("Error adding fund source: " + error.message);
  }
}

async function getAllFundSources() {
  try {
    const fundSources = await certORM.getAllFundSources();
    return fundSources;
  } catch (error) {
    throw new Error("Error getting all fund sources: " + error.message);
  }
}

// ==================== EVENTS SERVICES ====================

async function addEvent(eventData) {
  try {
    const newEvent = await certORM.addEvent(eventData);
    return newEvent;
  } catch (error) {
    throw new Error("Error adding event: " + error.message);
  }
}

async function getAllEvents() {
  try {
    const events = await certORM.getAllEvents();
    return events;
  } catch (error) {
    throw new Error("Error getting all events: " + error.message);
  }
}

async function getEventById(eventId) {
  try {
    const event = await certORM.getEventById(eventId);
    return event;
  } catch (error) {
    throw new Error("Error getting event by ID: " + error.message);
  }
}

async function updateEvent(eventId, updateData) {
  try {
    const updatedEvent = await certORM.updateEvent(eventId, updateData);
    return updatedEvent;
  } catch (error) {
    throw new Error("Error updating event: " + error.message);
  }
}

async function deleteEvent(eventId) {
  try {
    await certORM.deleteEvent(eventId);
  } catch (error) {
    throw new Error("Error deleting event: " + error.message);
  }
}

async function updateEventStatus(eventId, status) {
  try {
    const updatedEvent = await certORM.updateEventStatus(eventId, status);
    return updatedEvent;
  } catch (error) {
    throw new Error("Error updating event status: " + error.message);
  }
}

// ==================== TEMPLATES SERVICES ====================

async function addTemplate(templateData) {
  try {
    const newTemplate = await certORM.addTemplate(templateData);
    return newTemplate;
  } catch (error) {
    throw new Error("Error adding template: " + error.message);
  }
}

async function getAllTemplates() {
  try {
    const templates = await certORM.getAllTemplates();
    return templates;
  } catch (error) {
    throw new Error("Error getting all templates: " + error.message);
  }
}

async function getTemplateById(templateId) {
  try {
    const template = await certORM.getTemplateById(templateId);
    return template;
  } catch (error) {
    throw new Error("Error getting template by ID: " + error.message);
  }
}

async function getTemplatesByEventId(eventId) {
  try {
    const templates = await certORM.getTemplatesByEventId(eventId);
    return templates;
  } catch (error) {
    throw new Error("Error getting templates by event ID: " + error.message);
  }
}

async function updateTemplate(templateId, updateData) {
  try {
    const updatedTemplate = await certORM.updateTemplate(
      templateId,
      updateData
    );
    return updatedTemplate;
  } catch (error) {
    throw new Error("Error updating template: " + error.message);
  }
}

async function deleteTemplate(templateId) {
  try {
    await certORM.deleteTemplate(templateId);
  } catch (error) {
    throw new Error("Error deleting template: " + error.message);
  }
}

// Individual Attendance Functions
async function addIndividualAttendance(attendanceData) {
  try {
    const newAttendance = await certORM.addIndividualAttendance(attendanceData);
    return newAttendance;
  } catch (error) {
    throw new Error("Error adding individual attendance: " + error.message);
  }
}

async function updateIndividualAttendance(attendanceId, updateData) {
  try {
    const updatedAttendance = await certORM.updateIndividualAttendance(
      attendanceId,
      updateData
    );
    return updatedAttendance;
  } catch (error) {
    throw new Error("Error updating individual attendance: " + error.message);
  }
}

async function getAttendanceById(attendanceId) {
  try {
    const attendance = await certORM.getAttendanceById(attendanceId);
    return attendance;
  } catch (error) {
    throw new Error("Error getting attendance by ID: " + error.message);
  }
}

async function getAttendanceByUserAndDay(eventId, userId, dayNumber) {
  try {
    const attendance = await certORM.getAttendanceByUserAndDay(
      eventId,
      userId,
      dayNumber
    );
    return attendance;
  } catch (error) {
    throw new Error(
      "Error getting attendance by user and day: " + error.message
    );
  }
}

async function getUserById(userId) {
  try {
    const user = await certORM.getUserById(userId);
    return user;
  } catch (error) {
    throw new Error("Error getting user by ID: " + error.message);
  }
}

// ==================== ATTENDANCE SERVICES ====================

// Add Attendance
async function addAttendance(attendanceData) {
  try {
    return await certORM.addAttendance(attendanceData);
  } catch (error) {
    throw new Error(`Error adding attendance: ${error.message}`);
  }
}

// Get Attendance by Event
async function getAttendanceByEvent(eventId) {
  try {
    return await certORM.getAttendanceByEvent(eventId);
  } catch (error) {
    throw new Error(`Error fetching attendance: ${error.message}`);
  }
}

// Get Attendance by User and Event
async function getAttendanceByUserAndEvent(eventId, userId) {
  try {
    return await certORM.getAttendanceByUserAndEvent(eventId, userId);
  } catch (error) {
    throw new Error(`Error fetching user attendance: ${error.message}`);
  }
}

// Get Attendance by Day
async function getAttendanceByDay(eventId, dayNumber) {
  try {
    return await certORM.getAttendanceByDay(eventId, dayNumber);
  } catch (error) {
    throw new Error(`Error fetching attendance by day: ${error.message}`);
  }
}

// Update Attendance
async function updateAttendance(attendanceId, updateData) {
  try {
    return await certORM.updateAttendance(attendanceId, updateData);
  } catch (error) {
    throw new Error(`Error updating attendance: ${error.message}`);
  }
}

// Delete Attendance
async function deleteAttendance(attendanceId) {
  try {
    return await certORM.deleteAttendance(attendanceId);
  } catch (error) {
    throw new Error(`Error deleting attendance: ${error.message}`);
  }
}

// ==================== MEAL ATTENDANCE SERVICES ====================

// Add Meal Attendance
async function addMealAttendance(mealAttendanceData) {
  try {
    return await certORM.addMealAttendance(mealAttendanceData);
  } catch (error) {
    throw new Error(`Error adding meal attendance: ${error.message}`);
  }
}

// Get Meal Attendance by Event
async function getMealAttendanceByEvent(eventId) {
  try {
    return await certORM.getMealAttendanceByEvent(eventId);
  } catch (error) {
    throw new Error(`Error fetching meal attendance: ${error.message}`);
  }
}

// Get Meal Attendance by Day
async function getMealAttendanceByDay(eventId, dayNumber) {
  try {
    return await certORM.getMealAttendanceByDay(eventId, dayNumber);
  } catch (error) {
    throw new Error(`Error fetching meal attendance by day: ${error.message}`);
  }
}

// Update Meal Attendance
async function updateMealAttendance(mealAttendanceId, updateData) {
  try {
    return await certORM.updateMealAttendance(mealAttendanceId, updateData);
  } catch (error) {
    throw new Error(`Error updating meal attendance: ${error.message}`);
  }
}

// Delete Meal Attendance
async function deleteMealAttendance(mealAttendanceId) {
  try {
    return await certORM.deleteMealAttendance(mealAttendanceId);
  } catch (error) {
    throw new Error(`Error deleting meal attendance: ${error.message}`);
  }
}

// ==================== ATTENDANCE TABLES SERVICES ====================

// Add Attendance Table
async function addAttendanceTable(attendanceTableData) {
  try {
    return await certORM.addAttendanceTable(attendanceTableData);
  } catch (error) {
    throw new Error(`Error adding attendance table: ${error.message}`);
  }
}

// Get Attendance Tables by Event
async function getAttendanceTablesByEvent(eventId) {
  try {
    return await certORM.getAttendanceTablesByEvent(eventId);
  } catch (error) {
    throw new Error(`Error fetching attendance tables: ${error.message}`);
  }
}

// Get Attendance Table by Day
async function getAttendanceTableByDay(eventId, dayNumber) {
  try {
    return await certORM.getAttendanceTableByDay(eventId, dayNumber);
  } catch (error) {
    throw new Error(`Error fetching attendance table by day: ${error.message}`);
  }
}

// ==================== MEAL ATTENDANCE TABLES SERVICES ====================

// Add Meal Attendance Table
async function addMealAttendanceTable(mealAttendanceTableData) {
  try {
    return await certORM.addMealAttendanceTable(mealAttendanceTableData);
  } catch (error) {
    throw new Error(`Error adding meal attendance table: ${error.message}`);
  }
}

// Get Meal Attendance Tables by Event
async function getMealAttendanceTablesByEvent(eventId) {
  try {
    return await certORM.getMealAttendanceTablesByEvent(eventId);
  } catch (error) {
    throw new Error(`Error fetching meal attendance tables: ${error.message}`);
  }
}

// Get Meal Attendance Table by Day
async function getMealAttendanceTableByDay(eventId, dayNumber) {
  try {
    return await certORM.getMealAttendanceTableByDay(eventId, dayNumber);
  } catch (error) {
    throw new Error(
      `Error fetching meal attendance table by day: ${error.message}`
    );
  }
}

// ==================== QR CODE GENERATION SERVICES ====================

// Generate QR Code for Attendance Table
async function generateAttendanceTableQRCode(eventId, dayNumber) {
  try {
    return await certORM.generateAttendanceTableQRCode(eventId, dayNumber);
  } catch (error) {
    throw new Error(`Error generating attendance QR code: ${error.message}`);
  }
}

// Generate QR Code for Meal Attendance Table
async function generateMealAttendanceTableQRCode(eventId, dayNumber) {
  try {
    return await certORM.generateMealAttendanceTableQRCode(eventId, dayNumber);
  } catch (error) {
    throw new Error(
      `Error generating meal attendance QR code: ${error.message}`
    );
  }
}

// Generate QR Code for AM Out Attendance
async function generateAMOutAttendanceQRCode(eventId, dayNumber) {
  try {
    return await certORM.generateAMOutAttendanceQRCode(eventId, dayNumber);
  } catch (error) {
    throw new Error(
      `Error generating AM Out attendance QR code: ${error.message}`
    );
  }
}

// Generate QR Code for PM In Attendance
async function generatePMInAttendanceQRCode(eventId, dayNumber) {
  try {
    return await certORM.generatePMInAttendanceQRCode(eventId, dayNumber);
  } catch (error) {
    throw new Error(
      `Error generating PM In attendance QR code: ${error.message}`
    );
  }
}

// Generate QR Code for PM Out Attendance
async function generatePMOutAttendanceQRCode(eventId, dayNumber) {
  try {
    return await certORM.generatePMOutAttendanceQRCode(eventId, dayNumber);
  } catch (error) {
    throw new Error(
      `Error generating PM Out attendance QR code: ${error.message}`
    );
  }
}

// Event Participation Service Functions
async function joinEvent(userId, eventId) {
  try {
    // Get event details to check if user is joining late
    const event = await certORM.getEventById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Check if user is joining after event has started
    const { canJoinEvent } = require("../Utils/timeValidation");
    const isLate = canJoinEvent(event.date, event.startTime);

    // Join the event with late status
    const participation = await certORM.joinEvent(userId, eventId);

    // If joining late, mark as requiring validation
    if (isLate) {
      // Update participation to indicate late join requiring validation
      const updatedParticipation = await certORM.updateEventParticipationStatus(
        userId,
        eventId,
        "joined_late"
      );
      return {
        ...updatedParticipation,
        isLate: true,
        requiresValidation: true,
        message:
          "Joined successfully, but requires admin validation due to late registration.",
      };
    }

    return {
      ...participation,
      isLate: false,
      requiresValidation: false,
      message: "Successfully joined event.",
    };
  } catch (error) {
    throw new Error(`Error joining event: ${error.message}`);
  }
}

async function unjoinEvent(userId, eventId) {
  try {
    return await certORM.unjoinEvent(userId, eventId);
  } catch (error) {
    throw new Error(`Error unjoining event: ${error.message}`);
  }
}

async function getUserEventParticipations(userId) {
  try {
    return await certORM.getUserEventParticipations(userId);
  } catch (error) {
    throw new Error(
      `Error getting user event participations: ${error.message}`
    );
  }
}

async function checkUserEventParticipation(userId, eventId) {
  try {
    return await certORM.checkUserEventParticipation(userId, eventId);
  } catch (error) {
    throw new Error(
      `Error checking user event participation: ${error.message}`
    );
  }
}

async function getEventParticipants(eventId) {
  try {
    return await certORM.getEventParticipants(eventId);
  } catch (error) {
    throw new Error(`Error getting event participants: ${error.message}`);
  }
}

// Email Code Services
async function generateEmailCodeService(eventId, userId) {
  try {
    return await certORM.generateEmailCode(eventId, userId);
  } catch (error) {
    throw new Error(`Error generating email code: ${error.message}`);
  }
}

async function validateEmailCodeService(eventId, userId, emailCode) {
  try {
    return await certORM.validateEmailCode(eventId, userId, emailCode);
  } catch (error) {
    throw new Error(`Error validating email code: ${error.message}`);
  }
}

// QR Code Services
async function generateEventQRCodeDataService(eventId) {
  try {
    return await certORM.generateEventQRCodeData(eventId);
  } catch (error) {
    throw new Error(`Error generating QR code data: ${error.message}`);
  }
}

async function joinEventWithQRCodeService(eventId, userId, qrData) {
  try {
    // Get event details to check if user is joining late
    const event = await certORM.getEventById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Check if user is joining after event has started
    const { canJoinEvent } = require("../Utils/timeValidation");
    const isLate = canJoinEvent(event.date, event.startTime);

    // Join the event with QR code
    const result = await certORM.joinEventWithQRCode(eventId, userId, qrData);

    // If joining late, mark as requiring validation
    if (isLate && result.success) {
      // Update participation to indicate late join requiring validation
      const updatedParticipation = await certORM.updateEventParticipationStatus(
        userId,
        eventId,
        "joined_late"
      );
      return {
        ...result,
        isLate: true,
        requiresValidation: true,
        message:
          result.message +
          " Note: Requires admin validation due to late registration.",
      };
    }

    return {
      ...result,
      isLate: false,
      requiresValidation: false,
    };
  } catch (error) {
    throw new Error(`Error joining event with QR code: ${error.message}`);
  }
}

// ==================== AUTOMATIC ATTENDANCE RECORDING SERVICES ====================

// Record attendance when user joins event (via email code or QR code)
async function recordAttendanceOnJoin(
  userId,
  eventId,
  participantLocation = null
) {
  try {
    // Get event details
    const event = await certORM.getEventById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Calculate which day the user is joining (current day relative to event start)
    const eventStartDate = new Date(event.date);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - eventStartDate.getTime();
    const dayNumber = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    console.log(
      `Day calculation: eventStartDate=${eventStartDate}, currentDate=${currentDate}, timeDiff=${timeDiff}, dayNumber=${dayNumber}`
    );

    // Validate day number is within event duration
    if (dayNumber < 1 || dayNumber > event.numberOfDays) {
      throw new Error(
        `Cannot record attendance: Event day ${dayNumber} is outside the event duration (${event.numberOfDays} days)`
      );
    }

    // Check if attendance record already exists for this user and day
    const existingAttendance = await certORM.getAttendanceByUserAndDay(
      eventId,
      userId,
      dayNumber
    );
    if (existingAttendance) {
      throw new Error(`Attendance record for Day ${dayNumber} already exists`);
    }

    // Get or create attendance table for this day
    console.log(
      `Looking for attendance table: eventId=${eventId}, dayNumber=${dayNumber}`
    );
    let attendanceTable = await certORM.getAttendanceTableByDay(
      eventId,
      dayNumber
    );

    console.log(`Found attendance table:`, attendanceTable);

    if (!attendanceTable) {
      // Auto-create attendance table for this day
      console.log(`Auto-creating attendance table for Day ${dayNumber}`);
      const attendanceTableData = {
        eventId: parseInt(eventId),
        dayNumber: dayNumber,
      };
      attendanceTable = await certORM.addAttendanceTable(attendanceTableData);
      console.log(`Created attendance table:`, attendanceTable);
    }

    // Calculate the date for this day
    const attendanceDate = new Date(
      eventStartDate.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000
    );

    // Validate geofencing if location is provided
    let geofencingResult = null;
    let attendanceStatus = "Present";
    let attendanceNotes = "";

    if (participantLocation && event.eventLongitude && event.eventLatitude) {
      const { checkGeofencing } = require("../Utils/geofencing");
      geofencingResult = checkGeofencing(
        parseFloat(event.eventLatitude),
        parseFloat(event.eventLongitude),
        parseFloat(participantLocation.latitude),
        parseFloat(participantLocation.longitude),
        event.geofencingRadius
      );

      if (!geofencingResult.isWithinRadius) {
        // Record attendance but mark it as needing validation
        attendanceStatus = "Needs Validation";
        attendanceNotes = `Location validation required: Participant is ${geofencingResult.distance}m away from event venue (radius: ${event.geofencingRadius}m)`;
        console.log(
          `⚠️ Geofencing warning: User ${userId} is ${geofencingResult.distance}m away from event ${eventId} (radius: ${event.geofencingRadius}m)`
        );
      }
    } else if (!participantLocation) {
      // No location provided - mark as needing validation
      attendanceStatus = "Needs Validation";
      attendanceNotes =
        "Location permission denied or unavailable - manual verification required";
      console.log(
        `⚠️ Location unavailable: User ${userId} joined event ${eventId} without location data`
      );
    }

    // Create attendance record with AM In time as current time
    const attendanceData = {
      userId: parseInt(userId),
      eventId: parseInt(eventId),
      attendanceTableId: attendanceTable.id,
      dayNumber: dayNumber,
      dayName: `Day ${dayNumber}`,
      date: attendanceDate,
      amInTime: new Date(), // First scan - AM In
      participantLongitude: participantLocation
        ? participantLocation.longitude.toString()
        : null,
      participantLatitude: participantLocation
        ? participantLocation.latitude.toString()
        : null,
      status: attendanceStatus,
      notes: attendanceNotes || "Automatically recorded on event join",
    };

    console.log(`Creating attendance record:`, attendanceData);
    const newAttendance = await certORM.addIndividualAttendance(attendanceData);
    console.log(`Successfully created attendance record:`, newAttendance);

    let message = `Attendance recorded for Day ${dayNumber}`;
    if (attendanceStatus === "Needs Validation") {
      message += ` (Status: Needs Validation - Location verification required)`;
    }

    return {
      success: true,
      message: message,
      attendance: newAttendance,
      geofencing: geofencingResult,
      status: attendanceStatus,
      notes: attendanceNotes,
    };
  } catch (error) {
    throw new Error(`Error recording attendance on join: ${error.message}`);
  }
}

// Record attendance from QR code scan (for subsequent scans)
async function recordAttendanceFromQRScan(
  userId,
  eventId,
  dayNumber,
  scanType,
  participantLocation = null
) {
  try {
    // Get event details
    const event = await certORM.getEventById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Validate day number
    if (dayNumber < 1 || dayNumber > event.numberOfDays) {
      throw new Error(
        `Invalid day number: ${dayNumber}. Event has ${event.numberOfDays} days.`
      );
    }

    // Get existing attendance record
    const existingAttendance = await certORM.getAttendanceByUserAndDay(
      eventId,
      userId,
      dayNumber
    );
    if (!existingAttendance) {
      throw new Error(
        `No attendance record found for Day ${dayNumber}. Please join the event first.`
      );
    }

    // Validate geofencing if location is provided
    let geofencingResult = null;
    if (participantLocation && event.eventLongitude && event.eventLatitude) {
      const { checkGeofencing } = require("../Utils/geofencing");
      geofencingResult = checkGeofencing(
        parseFloat(event.eventLatitude),
        parseFloat(event.eventLongitude),
        parseFloat(participantLocation.latitude),
        parseFloat(participantLocation.longitude),
        event.geofencingRadius
      );

      if (!geofencingResult.isWithinRadius) {
        throw new Error(
          `Attendance denied: You must be within ${event.geofencingRadius}m of the event venue. ` +
            `You are ${geofencingResult.distance}m away.`
        );
      }
    }

    // Determine which time field to update based on scan type
    const updateData = {
      participantLongitude: participantLocation
        ? participantLocation.longitude.toString()
        : existingAttendance.participantLongitude,
      participantLatitude: participantLocation
        ? participantLocation.latitude.toString()
        : existingAttendance.participantLatitude,
    };

    const currentTime = new Date();

    switch (scanType.toLowerCase()) {
      case "am_out":
        if (existingAttendance.amOutTime) {
          throw new Error("AM Out time already recorded");
        }
        updateData.amOutTime = currentTime;
        break;
      case "pm_in":
        if (existingAttendance.pmInTime) {
          throw new Error("PM In time already recorded");
        }
        updateData.pmInTime = currentTime;
        break;
      case "pm_out":
        if (existingAttendance.pmOutTime) {
          throw new Error("PM Out time already recorded");
        }
        updateData.pmOutTime = currentTime;
        break;
      default:
        throw new Error(
          `Invalid scan type: ${scanType}. Valid types: am_out, pm_in, pm_out`
        );
    }

    // Calculate duration if this is the final scan (PM Out)
    if (scanType.toLowerCase() === "pm_out") {
      const amInTime = existingAttendance.amInTime;
      const pmOutTime = currentTime;

      if (amInTime) {
        const durationMs = pmOutTime.getTime() - amInTime.getTime();
        const durationHours = durationMs / (1000 * 60 * 60);

        // Cap at 8 hours maximum
        const cappedHours = Math.min(durationHours, 8);
        updateData.duration = `${cappedHours.toFixed(2)} hours`;

        // Update status based on duration
        if (cappedHours >= 6) {
          updateData.status = "Present";
        } else if (cappedHours >= 3) {
          updateData.status = "Partial";
        } else {
          updateData.status = "Absent";
        }
      }
    }

    const updatedAttendance = await certORM.updateIndividualAttendance(
      existingAttendance.id,
      updateData
    );

    return {
      success: true,
      message: `${scanType.toUpperCase()} time recorded successfully`,
      attendance: updatedAttendance,
      geofencing: geofencingResult,
    };
  } catch (error) {
    throw new Error(
      `Error recording attendance from QR scan: ${error.message}`
    );
  }
}

// Validate Attendance Record
async function validateAttendanceRecord(attendanceId) {
  try {
    console.log(
      `🔍 [validateAttendanceRecord] Validating attendance: ${attendanceId}`
    );

    const updatedAttendance = await certORM.updateIndividualAttendance(
      attendanceId,
      {
        status: "Present",
        notes: "Validated by administrator",
        updatedAt: new Date(),
      }
    );

    console.log(
      `📊 [validateAttendanceRecord] Updated attendance:`,
      updatedAttendance
    );
    return updatedAttendance;
  } catch (error) {
    throw new Error(`Error validating attendance: ${error.message}`);
  }
}

// Reject Attendance Record
async function rejectAttendanceRecord(attendanceId) {
  try {
    console.log(
      `🔍 [rejectAttendanceRecord] Rejecting attendance: ${attendanceId}`
    );

    const updatedAttendance = await certORM.updateIndividualAttendance(
      attendanceId,
      {
        status: "Absent",
        notes: "Rejected by administrator - invalid attendance",
        updatedAt: new Date(),
      }
    );

    console.log(
      `📊 [rejectAttendanceRecord] Updated attendance:`,
      updatedAttendance
    );
    return updatedAttendance;
  } catch (error) {
    throw new Error(`Error rejecting attendance: ${error.message}`);
  }
}

// Check if attendance phase has already been recorded
function checkPhaseAlreadyRecorded(attendanceRecord, attendancePhase) {
  switch (attendancePhase) {
    case "am_out":
      return attendanceRecord.amOutTime !== null;
    case "pm_in":
      return attendanceRecord.pmInTime !== null;
    case "pm_out":
      return attendanceRecord.pmOutTime !== null;
    default:
      return false;
  }
}

// Validate time window for attendance phase based on event times
function validateAttendancePhaseTime(
  attendancePhase,
  eventStartTime = null,
  eventEndTime = null
) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute; // Convert to minutes for easier comparison

  // If no event times provided, use default government schedule
  if (!eventStartTime || !eventEndTime) {
    return validateDefaultAttendancePhaseTime(attendancePhase, currentTime);
  }

  // Parse event times
  const startTime = parseEventTime(eventStartTime);
  const endTime = parseEventTime(eventEndTime);

  if (!startTime || !endTime) {
    return validateDefaultAttendancePhaseTime(attendancePhase, currentTime);
  }

  const startMinutes = startTime.hour * 60 + startTime.minute;
  const endMinutes = endTime.hour * 60 + endTime.minute;

  // Check if current time is within event hours (including grace periods)
  const startGracePeriod = startMinutes - 15;
  const endGracePeriod = endMinutes + 30;

  if (currentTime < startGracePeriod || currentTime > endGracePeriod) {
    return {
      isValid: false,
      message: "Outside event hours",
    };
  }

  // Determine phase based on event timing
  const timeFromStart = currentTime - startMinutes;

  // For events starting at 2:00 PM or later, skip AM phases
  if (startMinutes >= 840) {
    // 2:00 PM = 840 minutes
    // Event starts in afternoon - only PM phases
    if (attendancePhase === "pm_in") {
      if (timeFromStart < 15) {
        // First 15 minutes - on time
        return { isValid: true, isLate: false };
      } else if (timeFromStart < 60) {
        // 15-60 minutes - late but allowed
        return {
          isValid: true,
          isLate: true,
          message: "PM In attendance recorded late - requires admin validation",
        };
      } else {
        return {
          isValid: false,
          message: `PM In attendance can only be recorded within 1 hour of event start (${formatTimeFromMinutes(
            startMinutes
          )} - ${formatTimeFromMinutes(startMinutes + 60)})`,
        };
      }
    } else if (attendancePhase === "pm_out") {
      if (currentTime >= endMinutes && currentTime <= endMinutes + 30) {
        // After event ends + 30 minutes grace period
        return { isValid: true };
      } else {
        return {
          isValid: false,
          message: `PM Out attendance can only be recorded after the event ends with a 30-minute grace period (${formatTimeFromMinutes(
            endMinutes
          )} - ${formatTimeFromMinutes(endMinutes + 30)})`,
        };
      }
    } else {
      return {
        isValid: false,
        message: "Invalid attendance phase for afternoon events",
      };
    }
  } else {
    // Event starts in morning - use default phases but adjust for event times
    return validateDefaultAttendancePhaseTime(
      attendancePhase,
      currentTime,
      startMinutes,
      endMinutes
    );
  }
}

// Default government schedule validation (fallback)
function validateDefaultAttendancePhaseTime(
  attendancePhase,
  currentTime,
  eventStartMinutes = null,
  eventEndMinutes = null
) {
  switch (attendancePhase) {
    case "am_in":
      // If event times are provided, use event-specific AM In window
      if (eventStartMinutes !== null) {
        const amInStart = eventStartMinutes - 60; // 1 hour before event start
        const amInEnd = eventStartMinutes + 180; // 3 hours after event start
        const gracePeriodEnd = eventStartMinutes + 15; // 15 minutes grace period

        if (currentTime >= amInStart && currentTime < amInEnd) {
          const isLate = currentTime > gracePeriodEnd;
          return {
            isValid: true,
            isLate: isLate,
            message: isLate
              ? "AM In attendance recorded late - requires admin validation"
              : undefined,
          };
        } else {
          return {
            isValid: false,
            message: `AM In attendance can only be recorded from 1 hour before event start to 3 hours after (${formatTimeFromMinutes(
              amInStart
            )} - ${formatTimeFromMinutes(amInEnd)})`,
          };
        }
      } else {
        // Fallback to default government schedule
        // AM In: 9:00 AM - 10:00 AM (540-600 minutes)
        if (currentTime >= 540 && currentTime < 600) {
          return { isValid: true };
        } else {
          return {
            isValid: false,
            message:
              "AM In attendance can only be recorded between 9:00 AM - 10:00 AM",
          };
        }
      }

    case "am_out":
      // AM Out: 12:00 PM - 12:59 PM (720-779 minutes)
      if (currentTime >= 720 && currentTime <= 779) {
        return { isValid: true };
      } else {
        return {
          isValid: false,
          message:
            "AM Out attendance can only be recorded between 12:00 PM - 12:59 PM",
        };
      }

    case "pm_in":
      // PM In: 1:00 PM - 1:15 PM (780-795 minutes)
      if (currentTime >= 780 && currentTime <= 795) {
        return { isValid: true };
      } else {
        return {
          isValid: false,
          message:
            "PM In attendance can only be recorded between 1:00 PM - 1:15 PM",
        };
      }

    case "pm_out":
      // PM Out: Use event end time if provided, otherwise default to 5:00 PM - 5:30 PM
      const pmOutStart = eventEndMinutes !== null ? eventEndMinutes : 1020; // Default 5:00 PM = 1020 minutes
      const pmOutEnd = pmOutStart + 30; // 30 minute grace period

      if (currentTime >= pmOutStart && currentTime <= pmOutEnd) {
        return { isValid: true };
      } else {
        return {
          isValid: false,
          message: `PM Out attendance can only be recorded between ${formatTimeFromMinutes(
            pmOutStart
          )} - ${formatTimeFromMinutes(pmOutEnd)}`,
        };
      }

    default:
      return {
        isValid: false,
        message: `Invalid attendance phase: ${attendancePhase}`,
      };
  }
}

// Helper function to parse event time strings
function parseEventTime(timeString) {
  if (!timeString) return null;

  // Handle formats like "14:00", "2:00 PM", "14:00:00"
  const time = timeString.toString();

  if (time.includes(":")) {
    const parts = time.split(":");
    let hour = parseInt(parts[0]);
    const minute = parseInt(parts[1]);

    // Handle 24-hour format
    if (hour >= 0 && hour <= 23) {
      return { hour, minute };
    }
  }

  // Handle 12-hour format
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (match) {
    let hour = parseInt(match[1]);
    const minute = parseInt(match[2]);
    const period = match[3].toUpperCase();

    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    return { hour, minute };
  }

  return null;
}

// Helper function to format minutes back to time string
function formatTimeFromMinutes(minutes) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
}

// Record attendance for specific phase (AM Out, PM In, PM Out)
async function recordAttendancePhase(
  userId,
  eventId,
  dayNumber,
  attendancePhase,
  participantLocation = null
) {
  try {
    console.log(
      `Recording ${attendancePhase} attendance for user ${userId}, event ${eventId}, day ${dayNumber}`
    );

    // Get event details
    const event = await certORM.getEventById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Validate time window for attendance phase
    const timeValidation = validateAttendancePhaseTime(
      attendancePhase,
      event.startTime,
      event.endTime
    );
    if (!timeValidation.isValid) {
      throw new Error(timeValidation.message);
    }

    // Check if this is late attendance
    const isLateAttendance = timeValidation.isLate || false;

    // Find existing attendance record for this user, event, and day
    console.log(`🔍 [recordAttendancePhase] Looking for existing attendance:`, {
      userId,
      eventId,
      dayNumber,
      attendancePhase,
    });

    const existingAttendance = await certORM.getAttendanceByUserAndDay(
      eventId,
      userId,
      dayNumber
    );

    // If no existing attendance record, create one based on the first attendance phase
    if (!existingAttendance) {
      console.log(
        `🆕 [recordAttendancePhase] Creating new attendance record for ${attendancePhase}`
      );

      // Debug location data
      console.log(`📍 [recordAttendancePhase] Location data:`, {
        participantLocation,
        hasLocation: !!participantLocation,
        latitude: participantLocation?.latitude,
        longitude: participantLocation?.longitude,
      });

      // Find the attendance table for this event and day
      const attendanceTable = await certORM.getAttendanceTableByDay(
        eventId,
        dayNumber
      );
      console.log(
        `📋 [recordAttendancePhase] Found attendance table:`,
        attendanceTable
      );

      // Determine which time field to set based on the first attendance phase
      const newAttendanceData = {
        eventId: parseInt(eventId),
        userId: parseInt(userId),
        dayNumber: parseInt(dayNumber),
        dayName: `Day ${dayNumber}`, // Set day name
        date: new Date(), // Required field - current date
        attendanceTableId: attendanceTable?.id || null, // Link to attendance table for this day
        amInTime: null,
        amOutTime: null,
        pmInTime: null,
        pmOutTime: null,
        participantLatitude: participantLocation
          ? participantLocation.latitude.toString()
          : null,
        participantLongitude: participantLocation
          ? participantLocation.longitude.toString()
          : null,
        status: isLateAttendance ? "Needs Validation" : "Present",
        notes: isLateAttendance
          ? `${attendancePhase.toUpperCase()} attendance recorded late - requires admin validation`
          : `${attendancePhase.toUpperCase()} attendance recorded`,
      };

      // Set the appropriate time field based on the first attendance phase
      switch (attendancePhase) {
        case "am_in":
          newAttendanceData.amInTime = new Date();
          break;
        case "am_out":
          newAttendanceData.amOutTime = new Date();
          break;
        case "pm_in":
          newAttendanceData.pmInTime = new Date();
          break;
        case "pm_out":
          newAttendanceData.pmOutTime = new Date();
          break;
        default:
          throw new Error(`Invalid attendance phase: ${attendancePhase}`);
      }

      const newAttendance = await certORM.addIndividualAttendance(
        newAttendanceData
      );
      console.log(
        `✅ [recordAttendancePhase] Created new attendance record:`,
        newAttendance
      );

      // Calculate durations for the new attendance record
      const durations = calculateAttendanceDurations(newAttendance);
      const durationSummary = generateDurationSummary(durations);

      // Update the duration field in the database
      await certORM.updateIndividualAttendance(newAttendance.id, {
        duration: durationSummary,
      });

      console.log(`📊 Duration calculated for new record:`, durations);

      // Update event's current attendee count
      await certORM.updateEventAttendeeCount(eventId, 1); // Increment by 1

      // Create event participation record
      const participation = await certORM.joinEvent(userId, eventId);
      console.log(
        `✅ [recordAttendancePhase] Created event participation:`,
        participation
      );

      // If this is late attendance, update the participation status
      if (isLateAttendance) {
        await certORM.updateEventParticipationStatus(
          userId,
          eventId,
          "joined_late"
        );
        console.log(
          `✅ [recordAttendancePhase] Updated participation status to joined_late`
        );
      }

      return {
        success: true,
        message: isLateAttendance
          ? `Successfully recorded ${attendancePhase.toUpperCase()} attendance late and joined the event! Your attendance requires admin validation.`
          : `Successfully recorded ${attendancePhase.toUpperCase()} attendance and joined the event!`,
        attendance: newAttendance,
        phase: attendancePhase,
        isLate: isLateAttendance,
        requiresValidation: isLateAttendance,
        durations: durations,
        durationSummary: durationSummary,
      };
    }

    // Check if this attendance phase has already been recorded
    const phaseAlreadyRecorded = checkPhaseAlreadyRecorded(
      existingAttendance,
      attendancePhase
    );
    if (phaseAlreadyRecorded) {
      throw new Error(
        `${attendancePhase.toUpperCase()} attendance has already been recorded for this day.`
      );
    }

    // Validate geofencing if location is provided
    if (participantLocation && event.eventLongitude && event.eventLatitude) {
      const { checkGeofencing } = require("../Utils/geofencing");
      const geofencingResult = checkGeofencing(
        parseFloat(event.eventLatitude),
        parseFloat(event.eventLongitude),
        parseFloat(participantLocation.latitude),
        parseFloat(participantLocation.longitude),
        event.geofencingRadius
      );

      if (!geofencingResult.isWithinRadius) {
        // For AM Out and PM Out, allow attendance but mark as requiring validation
        if (attendancePhase === "am_out" || attendancePhase === "pm_out") {
          console.log(
            `⚠️ [recordAttendancePhase] ${attendancePhase.toUpperCase()} outside venue - marking for validation`
          );
          // Continue processing but mark as requiring validation
        } else {
          // For AM In and PM In, require geofencing (must be within venue)
          throw new Error(
            `Attendance denied: You must be within ${event.geofencingRadius}m of the event venue. ` +
              `You are ${geofencingResult.distance}m away.`
          );
        }
      }
    }

    // Find the attendance table for this event and day (for existing attendance updates)
    const attendanceTable = await certORM.getAttendanceTableByDay(
      eventId,
      dayNumber
    );
    console.log(
      `📋 [recordAttendancePhase] Found attendance table for update:`,
      attendanceTable
    );

    // Check if AM Out or PM Out is outside venue (for validation requirement)
    let isOutsideVenue = false;
    if (
      participantLocation &&
      event.eventLongitude &&
      event.eventLatitude &&
      (attendancePhase === "am_out" || attendancePhase === "pm_out")
    ) {
      const { checkGeofencing } = require("../Utils/geofencing");
      const geofencingResult = checkGeofencing(
        parseFloat(event.eventLatitude),
        parseFloat(event.eventLongitude),
        parseFloat(participantLocation.latitude),
        parseFloat(participantLocation.longitude),
        event.geofencingRadius
      );
      isOutsideVenue = !geofencingResult.isWithinRadius;
    }

    // Determine which time field to update based on attendance phase
    const updateData = {
      attendanceTableId:
        attendanceTable?.id || existingAttendance.attendanceTableId, // Link to attendance table
      participantLongitude: participantLocation
        ? participantLocation.longitude.toString()
        : existingAttendance.participantLongitude,
      participantLatitude: participantLocation
        ? participantLocation.latitude.toString()
        : existingAttendance.participantLatitude,
      status:
        isLateAttendance || isOutsideVenue
          ? "Needs Validation"
          : existingAttendance.status,
      notes: isLateAttendance
        ? `${attendancePhase.toUpperCase()} attendance recorded late - requires admin validation`
        : isOutsideVenue
        ? `${attendancePhase.toUpperCase()} attendance recorded outside venue - requires admin validation`
        : existingAttendance.notes,
    };

    // Set the appropriate time field based on attendance phase
    switch (attendancePhase) {
      case "am_out":
        updateData.amOutTime = new Date();
        break;
      case "pm_in":
        updateData.pmInTime = new Date();
        break;
      case "pm_out":
        updateData.pmOutTime = new Date();
        break;
      default:
        throw new Error(`Invalid attendance phase: ${attendancePhase}`);
    }

    // Update the attendance record
    const updatedAttendance = await certORM.updateIndividualAttendance(
      existingAttendance.id,
      updateData
    );

    // Calculate durations after updating attendance
    const durations = calculateAttendanceDurations(updatedAttendance);
    const durationSummary = generateDurationSummary(durations);

    // Update the duration field in the database
    await certORM.updateIndividualAttendance(existingAttendance.id, {
      duration: durationSummary,
    });

    console.log(
      `Successfully updated ${attendancePhase} attendance:`,
      updatedAttendance
    );
    console.log(`📊 Duration calculated:`, durations);

    return {
      success: true,
      message: isLateAttendance
        ? `${attendancePhase.toUpperCase()} attendance recorded late successfully! Your attendance requires admin validation.`
        : isOutsideVenue
        ? `${attendancePhase.toUpperCase()} attendance recorded outside venue successfully! Your attendance requires admin validation.`
        : `${attendancePhase.toUpperCase()} attendance recorded successfully`,
      attendance: updatedAttendance,
      phase: attendancePhase,
      isLate: isLateAttendance,
      requiresValidation: isLateAttendance || isOutsideVenue,
      durations: durations,
      durationSummary: durationSummary,
    };
  } catch (error) {
    throw new Error(
      `Error recording ${attendancePhase} attendance: ${error.message}`
    );
  }
}

// ==================== DURATION SERVICES ====================

// Get detailed duration information for an attendance record
async function getAttendanceDurations(attendanceId) {
  try {
    const attendance = await certORM.getAttendanceById(attendanceId);
    if (!attendance) {
      throw new Error("Attendance record not found");
    }

    const durations = calculateAttendanceDurations(attendance);
    return {
      success: true,
      attendance: attendance,
      durations: durations,
      summary: generateDurationSummary(durations),
    };
  } catch (error) {
    throw new Error(`Error getting attendance durations: ${error.message}`);
  }
}

// Get duration statistics for an event
async function getEventDurationStats(eventId) {
  try {
    const event = await certORM.getEventById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Get all attendance records for this event
    const attendances = await certORM.getAttendanceByEventId(eventId);

    const stats = {
      totalParticipants: attendances.length,
      participantsWithDuration: 0,
      totalDuration: 0,
      averageDuration: 0,
      morningSessions: 0,
      afternoonSessions: 0,
      fullDaySessions: 0,
      durationBreakdown: [],
    };

    attendances.forEach((attendance) => {
      const durations = calculateAttendanceDurations(attendance);

      if (durations.totalDuration > 0) {
        stats.participantsWithDuration++;
        stats.totalDuration += durations.totalDuration;

        if (durations.morningDuration > 0) stats.morningSessions++;
        if (durations.afternoonDuration > 0) stats.afternoonSessions++;
        if (durations.morningDuration > 0 && durations.afternoonDuration > 0) {
          stats.fullDaySessions++;
        }

        stats.durationBreakdown.push({
          userId: attendance.userId,
          userName: attendance.user?.fullName || "Unknown",
          durations: durations,
          summary: generateDurationSummary(durations),
        });
      }
    });

    if (stats.participantsWithDuration > 0) {
      stats.averageDuration = Math.round(
        stats.totalDuration / stats.participantsWithDuration
      );
    }

    return {
      success: true,
      event: event,
      stats: stats,
    };
  } catch (error) {
    throw new Error(`Error getting event duration stats: ${error.message}`);
  }
}

// ==================== CERTIFICATE SERVICES ====================

// Generate certificates for all participants with attendance records
async function generateCertificatesForEvent(eventId, issuedBy, templateId) {
  try {
    console.log(
      `🔍 [generateCertificatesForEvent] Generating certificates for event: ${eventId}`
    );

    // Get all participants with attendance records for this event
    const participantsWithAttendance =
      await certORM.getParticipantsWithAttendance(eventId);
    console.log(
      `📊 [generateCertificatesForEvent] Found ${participantsWithAttendance.length} participants with attendance`
    );

    if (participantsWithAttendance.length === 0) {
      throw new Error(
        "No participants with attendance records found for this event"
      );
    }

    // Get event and issuer details
    const event = await certORM.getEventById(eventId);
    const issuer = await certORM.getUserById(issuedBy);

    // Since templateId is now optional and template is a file in project directory
    const template = {
      id: null,
      name: "Certificate of Recognition - Matatag",
      description: "Standard certificate template",
    };

    // Generate certificates for each participant
    const certificates = [];
    for (const participant of participantsWithAttendance) {
      try {
        // Generate unique certificate number
        const certificateNumber = await generateUniqueCertificateNumber();

        // Calculate total duration from attendance records
        const totalDuration = await calculateTotalDuration(
          eventId,
          participant.userId
        );

        // Check if certificate already exists for this user and event
        const existingCertificate = await certORM.getCertificateByUserAndEvent(
          participant.userId,
          parseInt(eventId)
        );

        let certificate;
        if (existingCertificate) {
          console.log(
            `📋 [generateCertificatesForEvent] Certificate already exists for user ${participant.userId} in event ${eventId}, skipping creation`
          );
          certificate = existingCertificate;
        } else {
          // Create certificate in database
          certificate = await certORM.createCertificate({
            certificateNumber,
            userId: participant.userId,
            eventId: parseInt(eventId),
            issuedBy: parseInt(issuedBy),
            templateId: null, // Since template is a file, not in database
            duration: totalDuration,
          });
        }

        // Generate PDF certificate
        const certificateData = prepareCertificateData(
          certificate,
          participant.user,
          event,
          issuer,
          template
        );

        const pdfPath = await generateCertificatePDF(certificateData);

        // Note: PDF is generated and saved to file system, but path is not stored in database
        // since the certificate table doesn't have a pdfPath field

        certificates.push({
          ...certificate,
          pdfPath: pdfPath, // Include in response for frontend use
        });

        console.log(
          `✅ [generateCertificatesForEvent] Created certificate for user: ${participant.user.fullName}`
        );
      } catch (error) {
        console.error(
          `❌ [generateCertificatesForEvent] Error creating certificate for user ${participant.userId}:`,
          error
        );
        // Continue with other participants even if one fails
      }
    }

    console.log(
      `📊 [generateCertificatesForEvent] Generated ${certificates.length} certificates`
    );
    return certificates;
  } catch (error) {
    throw new Error(`Error generating certificates: ${error.message}`);
  }
}

// Generate individual certificate for a specific participant
async function generateIndividualCertificate(
  eventId,
  userId,
  issuedBy,
  templateId
) {
  try {
    console.log(
      `🔍 [generateIndividualCertificate] Generating certificate for user: ${userId} in event: ${eventId}`
    );

    // Get participant details
    const participant = await certORM.getUserById(userId);
    if (!participant) {
      throw new Error("Participant not found");
    }

    // Check if participant has attendance for this event
    const attendance = await certORM.getAttendanceByUserAndEvent(
      eventId,
      userId
    );
    if (!attendance || attendance.length === 0) {
      throw new Error("Participant has no attendance records for this event");
    }

    // Get event and issuer details
    const event = await certORM.getEventById(eventId);
    const issuer = await certORM.getUserById(issuedBy);

    // Since templateId is now optional and template is a file in project directory
    const template = {
      id: null,
      name: "Certificate of Recognition - Matatag",
      description: "Standard certificate template",
    };

    // Check if certificate already exists for this user and event
    const existingCertificate = await certORM.getCertificateByUserAndEvent(
      userId,
      parseInt(eventId)
    );

    let certificate;
    if (existingCertificate) {
      console.log(
        `📋 [generateIndividualCertificate] Certificate already exists for user ${userId} in event ${eventId}, returning existing certificate`
      );
      certificate = existingCertificate;
    } else {
      // Generate unique certificate number
      const certificateNumber = await generateUniqueCertificateNumber();

      // Calculate total duration
      const totalDuration = await calculateTotalDuration(
        eventId,
        parseInt(userId)
      );

      // Create certificate in database
      certificate = await certORM.createCertificate({
        certificateNumber,
        userId: parseInt(userId),
        eventId: parseInt(eventId),
        issuedBy: parseInt(issuedBy),
        templateId: null, // Since template is a file, not in database
        duration: totalDuration,
      });
    }

    // Generate PDF certificate
    const certificateData = prepareCertificateData(
      certificate,
      participant,
      event,
      issuer,
      template
    );
    const pdfPath = await generateCertificatePDF(certificateData);

    console.log(
      `✅ [generateIndividualCertificate] Created certificate for user: ${participant.fullName}`
    );

    return {
      ...certificate,
      pdfPath: pdfPath, // Include in response for frontend use
    };
  } catch (error) {
    throw new Error(
      `Error generating individual certificate: ${error.message}`
    );
  }
}

// Get certificates by event
async function getCertificatesByEvent(eventId) {
  try {
    console.log(
      `🔍 [getCertificatesByEvent] Fetching certificates for event: ${eventId}`
    );
    return await certORM.getCertificatesByEvent(eventId);
  } catch (error) {
    throw new Error(`Error fetching certificates: ${error.message}`);
  }
}

// Get all certificates
async function getAllCertificates() {
  try {
    console.log(`🔍 [getAllCertificates] Fetching all certificates`);
    return await certORM.getAllCertificates();
  } catch (error) {
    throw new Error(`Error fetching certificates: ${error.message}`);
  }
}

// Get certificate by ID
async function getCertificateById(certificateId) {
  try {
    console.log(
      `🔍 [getCertificateById] Fetching certificate: ${certificateId}`
    );
    return await certORM.getCertificateById(certificateId);
  } catch (error) {
    throw new Error(`Error fetching certificate: ${error.message}`);
  }
}

// Generate unique certificate number
async function generateUniqueCertificateNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `CERT-${timestamp}-${random}`;
}

// Calculate total duration from attendance records
async function calculateTotalDuration(eventId, userId) {
  try {
    const attendanceRecords = await certORM.getAttendanceByUserAndEvent(
      eventId,
      userId
    );

    console.log(
      `📊 [calculateTotalDuration] Found ${attendanceRecords.length} attendance records for user ${userId}`
    );

    let totalMinutes = 0;
    for (const record of attendanceRecords) {
      console.log(
        `📋 [calculateTotalDuration] Record duration: ${record.duration}`
      );

      if (record.duration) {
        // Parse duration (assuming it's in format like "8h 30m" or "480m")
        const durationStr = record.duration.toString();
        if (durationStr.includes("h")) {
          const hours = parseInt(durationStr.match(/(\d+)h/)?.[1] || "0");
          const minutes = parseInt(durationStr.match(/(\d+)m/)?.[1] || "0");
          totalMinutes += hours * 60 + minutes;
        } else if (durationStr.includes("m")) {
          totalMinutes += parseInt(durationStr.match(/(\d+)m/)?.[1] || "0");
        }
      } else {
        // If no duration data, assume 8 hours per day
        console.log(
          `📋 [calculateTotalDuration] No duration data, assuming 8 hours per day`
        );
        totalMinutes += 8 * 60; // 8 hours = 480 minutes
      }
    }

    // If no duration data at all, provide a default
    if (totalMinutes === 0 && attendanceRecords.length > 0) {
      totalMinutes = attendanceRecords.length * 8 * 60; // 8 hours per day
    }

    // Convert back to hours and minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const result = `${hours}h ${minutes}m`;

    console.log(`📊 [calculateTotalDuration] Calculated duration: ${result}`);
    return result;
  } catch (error) {
    console.error(`Error calculating duration: ${error.message}`);
    return "0h 0m";
  }
}

module.exports = {
  // Event services
  addEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  updateEventStatus,

  // Attendance Table services
  addAttendanceTable,
  getAttendanceTablesByEvent,
  getAttendanceTableByDay,
  generateAttendanceTableQRCode,
  generateAMOutAttendanceQRCode,
  generatePMInAttendanceQRCode,
  generatePMOutAttendanceQRCode,

  // Meal Attendance Table services
  addMealAttendanceTable,
  getMealAttendanceTablesByEvent,
  getMealAttendanceTableByDay,
  generateMealAttendanceTableQRCode,

  // Event Participation services
  joinEvent,
  unjoinEvent,
  getUserEventParticipations,
  checkUserEventParticipation,
  getEventParticipants,

  // Email Code services
  // generateEmailCode,
  // validateEmailCode,

  // // QR Code services
  // generateEventQRCodeData,
  // joinEventWithQRCode,

  // Template services
  addTemplate,
  getAllTemplates,
  getTemplateById,
  getTemplatesByEventId,
  updateTemplate,
  deleteTemplate,

  // Individual Attendance services
  addIndividualAttendance,
  updateIndividualAttendance,
  getAttendanceById,
  getAttendanceByUserAndDay,
  getAttendanceByUserAndEvent,
  getAttendanceByEvent,

  // User services
  getUserById,

  // Attendance services
  getAttendanceByDay,
  recordAttendanceFromQRScan,
  recordAttendancePhase,

  // Duration services
  getAttendanceDurations,
  getEventDurationStats,

  // Validation services
  validateAttendanceRecord,
  rejectAttendanceRecord,

  // Fund Source and PD Program services
  getAllFundSources,
  getAllPDPrograms,

  // Designation, Unit, and School services
  getAllDesignations,
  getAllUnits,
  getAllSchools,

  // Event Participation services
  joinEvent,
  unjoinEvent,
  getUserEventParticipations,
  checkUserEventParticipation,
  getEventParticipants,

  // Email Code services
  generateEmailCodeService,
  validateEmailCodeService,

  // QR Code services
  generateEventQRCodeDataService,
  joinEventWithQRCodeService,

  // Automatic Attendance Recording services
  recordAttendanceOnJoin,
  recordAttendancePhase,

  // Certificate services
  generateCertificatesForEvent,
  generateIndividualCertificate,
  getCertificatesByEvent,
  getAllCertificates,
  getCertificateById,
};
