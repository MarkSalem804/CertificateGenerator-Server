const certORM = require("../Database/certgen-database");

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

module.exports = {
  addDesignation,
  getAllDesignations,
  addUnit,
  getAllUnits,
  addSchool,
  getAllSchools,
  addEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  addTemplate,
  getAllTemplates,
  getTemplateById,
  getTemplatesByEventId,
  updateTemplate,
  deleteTemplate,
  addPDProgram,
  getAllPDPrograms,
  addFundSource,
  getAllFundSources,
  addIndividualAttendance,
  updateIndividualAttendance,
  getAttendanceById,
  getAttendanceByUserAndDay,
  getUserById,
  // Attendance functions
  addAttendance,
  getAttendanceByEvent,
  getAttendanceByDay,
  updateAttendance,
  deleteAttendance,
  // Meal Attendance functions
  addMealAttendance,
  getMealAttendanceByEvent,
  getMealAttendanceByDay,
  updateMealAttendance,
  deleteMealAttendance,
  // Attendance Tables functions
  addAttendanceTable,
  getAttendanceTablesByEvent,
  getAttendanceTableByDay,
  // Meal Attendance Tables functions
  addMealAttendanceTable,
  getMealAttendanceTablesByEvent,
  getMealAttendanceTableByDay,
  // QR Code Generation functions
  generateAttendanceTableQRCode,
  generateMealAttendanceTableQRCode,
  // Event Participation functions
  joinEvent,
  unjoinEvent,
  getUserEventParticipations,
  checkUserEventParticipation,
  getEventParticipants,
};

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

// Event Participation Service Functions
async function joinEvent(userId, eventId) {
  try {
    return await certORM.joinEvent(userId, eventId);
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
    return await certORM.joinEventWithQRCode(eventId, userId, qrData);
  } catch (error) {
    throw new Error(`Error joining event with QR code: ${error.message}`);
  }
}

module.exports = {
  // Designation services
  addDesignation,
  getAllDesignations,

  // Unit services
  addUnit,
  getAllUnits,

  // School services
  addSchool,
  getAllSchools,

  // PD Program services
  addPDProgram,
  getAllPDPrograms,

  // Fund Source services
  addFundSource,
  getAllFundSources,

  // Event services
  addEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  updateEventStatus,

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

  // User services
  getUserById,

  // Attendance services
  addAttendance,
  getAttendanceByEvent,
  getAttendanceByDay,
  updateAttendance,
  deleteAttendance,

  // Meal Attendance services
  addMealAttendance,
  getMealAttendanceByEvent,
  getMealAttendanceByDay,
  updateMealAttendance,
  deleteMealAttendance,

  // Attendance Table services
  addAttendanceTable,
  getAttendanceTablesByEvent,
  getAttendanceTableByDay,
  generateAttendanceTableQRCode,

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
  generateEmailCodeService,
  validateEmailCodeService,

  // QR Code services
  generateEventQRCodeDataService,
  joinEventWithQRCodeService,
};
