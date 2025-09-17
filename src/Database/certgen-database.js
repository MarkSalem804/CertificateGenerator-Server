const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addDesignation(designationName) {
  try {
    const newDesignation = await prisma.designation.create({
      data: {
        name: designationName,
      },
    });
    return newDesignation;
  } catch (error) {
    throw new Error("Error adding designation: " + error.message);
  }
}

async function pdProgram(pdProgramName) {
  try {
    const newPdProgram = await prisma.pdPrograms.create({
      data: {
        name: pdProgramName,
      },
    });
    return newPdProgram;
  } catch (error) {
    throw new Error("Error adding pd program: " + error.message);
  }
}

async function addFundSource(fundSourceName) {
  try {
    const newFundSource = await prisma.fundSource.create({
      data: {
        name: fundSourceName,
      },
    });
    return newFundSource;
  } catch (error) {
    throw new Error("Error adding fund source: " + error.message);
  }
}

async function getAllFundSources() {
  try {
    const fundSources = await prisma.fundSource.findMany();
    return fundSources;
  } catch (error) {
    throw new Error("Error getting all fund sources: " + error.message);
  }
}

async function getAllPdPrograms() {
  try {
    const pdPrograms = await prisma.pdPrograms.findMany();
    return pdPrograms;
  } catch (error) {
    throw new Error("Error getting all pd programs: " + error.message);
  }
}

async function getAllDesignations() {
  try {
    const designations = await prisma.designation.findMany();
    return designations;
  } catch (error) {
    throw new Error("Error getting all designations: " + error.message);
  }
}

async function addUnit(unitName, designationId) {
  try {
    // Convert designationId to integer and validate
    const designationIdInt = parseInt(designationId);

    if (isNaN(designationIdInt)) {
      throw new Error("Invalid designation ID: must be a valid number");
    }

    // First get the designation name from the designationId
    const designation = await prisma.designation.findUnique({
      where: { id: designationIdInt },
      select: { name: true },
    });

    if (!designation) {
      throw new Error(`Designation with ID ${designationIdInt} not found`);
    }

    const newUnit = await prisma.unit.create({
      data: {
        name: unitName,
        designationId: designationIdInt,
        designationName: designation.name,
      },
    });
    return newUnit;
  } catch (error) {
    throw new Error("Error adding unit: " + error.message);
  }
}

async function getAllUnits() {
  try {
    const units = await prisma.unit.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return units;
  } catch (error) {
    throw new Error("Error fetching units: " + error.message);
  }
}

async function addSchool(schoolName, designationId) {
  try {
    // Convert designationId to integer and validate
    const designationIdInt = parseInt(designationId);

    if (isNaN(designationIdInt)) {
      throw new Error("Invalid designation ID: must be a valid number");
    }

    // Get the designation name from the designationId
    const designation = await prisma.designation.findUnique({
      where: { id: designationIdInt },
      select: { name: true },
    });

    if (!designation) {
      throw new Error(`Designation with ID ${designationIdInt} not found`);
    }

    const newSchool = await prisma.school.create({
      data: {
        name: schoolName,
        designationId: designationIdInt,
        designationName: designation.name,
      },
    });
    return newSchool;
  } catch (error) {
    throw new Error("Error adding school: " + error.message);
  }
}

async function getAllSchools() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return schools;
  } catch (error) {
    throw new Error("Error getting all schools: " + error.message);
  }
}

// ==================== EVENTS DATABASE FUNCTIONS ====================

async function addEvent(eventData) {
  try {
    const newEvent = await prisma.event.create({
      data: {
        name: eventData.name,
        description: eventData.description || null,
        date: new Date(eventData.date),
        location: eventData.location,
        venue: eventData.venue || null,
        eventLatitude: eventData.eventLatitude || null,
        eventLongitude: eventData.eventLongitude || null,
        geofencingRadius: eventData.geofencingRadius || 50,
        maxAttendees: eventData.maxAttendees || 50,
        currentAttendees: 0, // Always start with 0 attendees
        status: eventData.status || "Draft",
        templateId: eventData.templateId || null,
        duration: eventData.duration || null,
        numberOfDays: eventData.numberOfDays || 1,
        startTime: eventData.startTime || null,
        endTime: eventData.endTime || null,
        createdBy: eventData.createdBy || null,
        fundSourceId: eventData.fundSourceId || null,
        pdProgramId: eventData.pdProgramId || null,
        totalApprovedBudget: eventData.totalApprovedBudget || null,
        cpdUnits: eventData.cpdUnits || false,
        cpdUnitsCount: eventData.cpdUnitsCount || 0,
      },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            position: true,
            designationId: true,
            designationName: true,
            unitId: true,
            unitName: true,
            schoolId: true,
            schoolName: true,
            isPasswordChanged: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        templates: {
          select: {
            id: true,
            name: true,
            fileName: true,
          },
        },
        fundSource: {
          select: {
            id: true,
            name: true,
          },
        },
        pdProgram: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            attendance: true,
            certificates: true,
          },
        },
      },
    });

    // Return the created event (no need to update currentAttendees since it starts at 0)
    return newEvent;
  } catch (error) {
    throw new Error("Error adding event: " + error.message);
  }
}

async function getAllEvents() {
  try {
    const events = await prisma.event.findMany({
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            position: true,
            designationId: true,
            designationName: true,
            unitId: true,
            unitName: true,
            schoolId: true,
            schoolName: true,
            isPasswordChanged: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        templates: {
          select: {
            id: true,
            name: true,
            fileName: true,
          },
        },
        _count: {
          select: {
            attendance: true,
            certificates: true,
            eventParticipations: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Update currentAttendees for each event
    const eventsWithUpdatedCounts = await Promise.all(
      events.map(async (event) => {
        // Count only joined participations
        const joinedCount = await prisma.eventParticipation.count({
          where: {
            eventId: event.id,
            status: "joined",
          },
        });

        const updatedEvent = await prisma.event.update({
          where: { id: event.id },
          data: { currentAttendees: joinedCount },
        });
        return { ...event, currentAttendees: updatedEvent.currentAttendees };
      })
    );

    return eventsWithUpdatedCounts;
  } catch (error) {
    throw new Error("Error getting all events: " + error.message);
  }
}

async function getEventById(eventId) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            position: true,
            designationId: true,
            designationName: true,
            unitId: true,
            unitName: true,
            schoolId: true,
            schoolName: true,
            isPasswordChanged: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        templates: {
          select: {
            id: true,
            name: true,
            fileName: true,
            filePath: true,
          },
        },
        attendance: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        certificates: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
            issuer: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
            template: {
              select: {
                id: true,
                name: true,
                fileName: true,
              },
            },
          },
        },
        _count: {
          select: {
            attendance: true,
            certificates: true,
          },
        },
      },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    // Count only joined participations
    const joinedCount = await prisma.eventParticipation.count({
      where: {
        eventId: eventId,
        status: "joined",
      },
    });

    // Update currentAttendees count
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { currentAttendees: joinedCount },
    });

    return { ...event, currentAttendees: updatedEvent.currentAttendees };
  } catch (error) {
    throw new Error("Error getting event by ID: " + error.message);
  }
}

async function updateEvent(eventId, updateData) {
  try {
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        name: updateData.name,
        description: updateData.description,
        date: updateData.date ? new Date(updateData.date) : undefined,
        location: updateData.location,
        venue: updateData.venue,
        eventLatitude: updateData.eventLatitude,
        eventLongitude: updateData.eventLongitude,
        geofencingRadius: updateData.geofencingRadius,
        maxAttendees: updateData.maxAttendees,
        status: updateData.status,
        templateId: updateData.templateId,
        duration: updateData.duration,
        numberOfDays: updateData.numberOfDays,
        startTime: updateData.startTime,
        endTime: updateData.endTime,
        fundSourceId: updateData.fundSourceId,
        pdProgramId: updateData.pdProgramId,
        totalApprovedBudget: updateData.totalApprovedBudget,
        cpdUnits: updateData.cpdUnits,
        cpdUnitsCount: updateData.cpdUnitsCount,
      },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            position: true,
            designationId: true,
            designationName: true,
            unitId: true,
            unitName: true,
            schoolId: true,
            schoolName: true,
            isPasswordChanged: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        templates: {
          select: {
            id: true,
            name: true,
            fileName: true,
          },
        },
        fundSource: {
          select: {
            id: true,
            name: true,
          },
        },
        pdProgram: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            attendance: true,
            certificates: true,
          },
        },
      },
    });

    // Count only joined participations
    const joinedCount = await prisma.eventParticipation.count({
      where: {
        eventId: eventId,
        status: "joined",
      },
    });

    // Update currentAttendees count
    const finalEvent = await prisma.event.update({
      where: { id: eventId },
      data: { currentAttendees: joinedCount },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        templates: {
          select: {
            id: true,
            name: true,
            fileName: true,
          },
        },
        fundSource: {
          select: {
            id: true,
            name: true,
          },
        },
        pdProgram: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            attendance: true,
            certificates: true,
          },
        },
      },
    });

    return finalEvent;
  } catch (error) {
    throw new Error("Error updating event: " + error.message);
  }
}

async function deleteEvent(eventId) {
  try {
    await prisma.event.delete({
      where: { id: eventId },
    });
  } catch (error) {
    throw new Error("Error deleting event: " + error.message);
  }
}

async function updateEventStatus(eventId, status) {
  try {
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { status: status },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            position: true,
            designationId: true,
            designationName: true,
            unitId: true,
            unitName: true,
            schoolId: true,
            schoolName: true,
            isPasswordChanged: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        templates: {
          select: {
            id: true,
            name: true,
            fileName: true,
          },
        },
        _count: {
          select: {
            attendance: true,
            certificates: true,
          },
        },
      },
    });

    return updatedEvent;
  } catch (error) {
    throw new Error("Error updating event status: " + error.message);
  }
}

// ==================== TEMPLATES DATABASE FUNCTIONS ====================

async function addTemplate(templateData) {
  try {
    const newTemplate = await prisma.templates.create({
      data: {
        name: templateData.name,
        fileName: templateData.fileName,
        filePath: templateData.filePath,
        fileSize: templateData.fileSize,
        eventId: templateData.eventId,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return newTemplate;
  } catch (error) {
    throw new Error("Error adding template: " + error.message);
  }
}

async function getAllTemplates() {
  try {
    const templates = await prisma.templates.findMany({
      include: {
        event: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return templates;
  } catch (error) {
    throw new Error("Error getting all templates: " + error.message);
  }
}

async function getTemplateById(templateId) {
  try {
    const template = await prisma.templates.findUnique({
      where: { id: templateId },
      include: {
        event: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!template) {
      throw new Error("Template not found");
    }

    return template;
  } catch (error) {
    throw new Error("Error getting template by ID: " + error.message);
  }
}

async function getTemplatesByEventId(eventId) {
  try {
    const templates = await prisma.templates.findMany({
      where: { eventId: eventId },
      include: {
        event: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return templates;
  } catch (error) {
    throw new Error("Error getting templates by event ID: " + error.message);
  }
}

async function updateTemplate(templateId, updateData) {
  try {
    const updatedTemplate = await prisma.templates.update({
      where: { id: templateId },
      data: {
        name: updateData.name,
        fileName: updateData.fileName,
        filePath: updateData.filePath,
        fileSize: updateData.fileSize,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedTemplate;
  } catch (error) {
    throw new Error("Error updating template: " + error.message);
  }
}

async function deleteTemplate(templateId) {
  try {
    await prisma.templates.delete({
      where: { id: templateId },
    });
  } catch (error) {
    throw new Error("Error deleting template: " + error.message);
  }
}

// Individual Attendance Database Functions
async function addIndividualAttendance(attendanceData) {
  try {
    const newAttendance = await prisma.attendance.create({
      data: attendanceData,
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
            venue: true,
            eventLatitude: true,
            eventLongitude: true,
          },
        },
      },
    });
    return newAttendance;
  } catch (error) {
    throw new Error("Error adding individual attendance: " + error.message);
  }
}

async function updateIndividualAttendance(attendanceId, updateData) {
  try {
    const updatedAttendance = await prisma.attendance.update({
      where: { id: parseInt(attendanceId) },
      data: updateData,
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
            venue: true,
            eventLatitude: true,
            eventLongitude: true,
          },
        },
      },
    });
    return updatedAttendance;
  } catch (error) {
    throw new Error("Error updating individual attendance: " + error.message);
  }
}

async function getAttendanceById(attendanceId) {
  try {
    const attendance = await prisma.attendance.findUnique({
      where: { id: parseInt(attendanceId) },
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
            venue: true,
            eventLatitude: true,
            eventLongitude: true,
          },
        },
      },
    });
    return attendance;
  } catch (error) {
    throw new Error("Error getting attendance by ID: " + error.message);
  }
}

async function getAttendanceByUserAndDay(eventId, userId, dayNumber) {
  try {
    const attendance = await prisma.attendance.findFirst({
      where: {
        eventId: parseInt(eventId),
        userId: parseInt(userId),
        dayNumber: parseInt(dayNumber),
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
            venue: true,
            eventLatitude: true,
            eventLongitude: true,
          },
        },
      },
    });
    return attendance;
  } catch (error) {
    throw new Error(
      "Error getting attendance by user and day: " + error.message
    );
  }
}

async function getUserById(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        designationName: true,
        unitName: true,
        schoolName: true,
        isPasswordChanged: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
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
  pdProgram,
  getAllPdPrograms,
  deleteTemplate,
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

// ==================== ATTENDANCE FUNCTIONS ====================

// Add Attendance
async function addAttendance(attendanceData) {
  try {
    const newAttendance = await prisma.attendance.create({
      data: {
        userId: attendanceData.userId,
        eventId: attendanceData.eventId,
        dayNumber: attendanceData.dayNumber,
        dayName: attendanceData.dayName,
        date: new Date(attendanceData.date),
        checkInTime: attendanceData.checkInTime,
        checkOutTime: attendanceData.checkOutTime,
        duration: attendanceData.duration,
        status: attendanceData.status || "Present",
        notes: attendanceData.notes,
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
          },
        },
      },
    });
    return newAttendance;
  } catch (error) {
    throw new Error(`Error adding attendance: ${error.message}`);
  }
}

// Get Attendance by Event
async function getAttendanceByEvent(eventId) {
  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        eventId: parseInt(eventId),
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
          },
        },
      },
      orderBy: [{ dayNumber: "asc" }, { user: { fullName: "asc" } }],
    });
    return attendance;
  } catch (error) {
    throw new Error(`Error fetching attendance: ${error.message}`);
  }
}

// Get Attendance by Day
async function getAttendanceByDay(eventId, dayNumber) {
  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        eventId: parseInt(eventId),
        dayNumber: parseInt(dayNumber),
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
          },
        },
      },
      orderBy: {
        user: { fullName: "asc" },
      },
    });
    return attendance;
  } catch (error) {
    throw new Error(`Error fetching attendance by day: ${error.message}`);
  }
}

// Update Attendance
async function updateAttendance(attendanceId, updateData) {
  try {
    const updatedAttendance = await prisma.attendance.update({
      where: {
        id: parseInt(attendanceId),
      },
      data: {
        checkInTime: updateData.checkInTime,
        checkOutTime: updateData.checkOutTime,
        duration: updateData.duration,
        status: updateData.status,
        notes: updateData.notes,
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
          },
        },
      },
    });
    return updatedAttendance;
  } catch (error) {
    throw new Error(`Error updating attendance: ${error.message}`);
  }
}

// Delete Attendance
async function deleteAttendance(attendanceId) {
  try {
    const deletedAttendance = await prisma.attendance.delete({
      where: {
        id: parseInt(attendanceId),
      },
    });
    return deletedAttendance;
  } catch (error) {
    throw new Error(`Error deleting attendance: ${error.message}`);
  }
}

// ==================== MEAL ATTENDANCE FUNCTIONS ====================

// Add Meal Attendance
async function addMealAttendance(mealAttendanceData) {
  try {
    const newMealAttendance = await prisma.mealAttendance.create({
      data: {
        userId: mealAttendanceData.userId,
        eventId: mealAttendanceData.eventId,
        dayNumber: mealAttendanceData.dayNumber,
        date: new Date(mealAttendanceData.date),
        breakfast: mealAttendanceData.breakfast || false,
        amSnack: mealAttendanceData.amSnack || false,
        lunch: mealAttendanceData.lunch || false,
        pmSnack: mealAttendanceData.pmSnack || false,
        dinner: mealAttendanceData.dinner || false,
        notes: mealAttendanceData.notes,
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
          },
        },
      },
    });
    return newMealAttendance;
  } catch (error) {
    throw new Error(`Error adding meal attendance: ${error.message}`);
  }
}

// Get Meal Attendance by Event
async function getMealAttendanceByEvent(eventId) {
  try {
    const mealAttendance = await prisma.mealAttendance.findMany({
      where: {
        eventId: parseInt(eventId),
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
          },
        },
      },
      orderBy: [{ dayNumber: "asc" }, { user: { fullName: "asc" } }],
    });
    return mealAttendance;
  } catch (error) {
    throw new Error(`Error fetching meal attendance: ${error.message}`);
  }
}

// Get Meal Attendance by Day
async function getMealAttendanceByDay(eventId, dayNumber) {
  try {
    const mealAttendance = await prisma.mealAttendance.findMany({
      where: {
        eventId: parseInt(eventId),
        dayNumber: parseInt(dayNumber),
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
          },
        },
      },
      orderBy: {
        user: { fullName: "asc" },
      },
    });
    return mealAttendance;
  } catch (error) {
    throw new Error(`Error fetching meal attendance by day: ${error.message}`);
  }
}

// Update Meal Attendance
async function updateMealAttendance(mealAttendanceId, updateData) {
  try {
    const updatedMealAttendance = await prisma.mealAttendance.update({
      where: {
        id: parseInt(mealAttendanceId),
      },
      data: {
        breakfast: updateData.breakfast,
        amSnack: updateData.amSnack,
        lunch: updateData.lunch,
        pmSnack: updateData.pmSnack,
        dinner: updateData.dinner,
        notes: updateData.notes,
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
          },
        },
      },
    });
    return updatedMealAttendance;
  } catch (error) {
    throw new Error(`Error updating meal attendance: ${error.message}`);
  }
}

// Delete Meal Attendance
async function deleteMealAttendance(mealAttendanceId) {
  try {
    const deletedMealAttendance = await prisma.mealAttendance.delete({
      where: {
        id: parseInt(mealAttendanceId),
      },
    });
    return deletedMealAttendance;
  } catch (error) {
    throw new Error(`Error deleting meal attendance: ${error.message}`);
  }
}

// ==================== ATTENDANCE TABLES FUNCTIONS ====================

// Add Attendance Table
async function addAttendanceTable(attendanceTableData) {
  try {
    // First create the attendance table
    const newAttendanceTable = await prisma.attendanceTables.create({
      data: {
        eventId: attendanceTableData.eventId,
        dayNumber: attendanceTableData.dayNumber,
      },
    });

    // Then automatically generate QR code for this table
    const updatedTable = await generateAttendanceTableQRCode(
      attendanceTableData.eventId,
      attendanceTableData.dayNumber
    );

    return updatedTable;
  } catch (error) {
    throw new Error(`Error adding attendance table: ${error.message}`);
  }
}

// Get Attendance Tables by Event
async function getAttendanceTablesByEvent(eventId) {
  try {
    const attendanceTables = await prisma.attendanceTables.findMany({
      where: {
        eventId: parseInt(eventId),
      },
      orderBy: {
        dayNumber: "asc",
      },
    });
    return attendanceTables;
  } catch (error) {
    throw new Error(`Error fetching attendance tables: ${error.message}`);
  }
}

// Get Attendance Table by Day
async function getAttendanceTableByDay(eventId, dayNumber) {
  try {
    const attendanceTable = await prisma.attendanceTables.findFirst({
      where: {
        eventId: parseInt(eventId),
        dayNumber: parseInt(dayNumber),
      },
    });
    return attendanceTable;
  } catch (error) {
    throw new Error(`Error fetching attendance table by day: ${error.message}`);
  }
}

// ==================== MEAL ATTENDANCE TABLES FUNCTIONS ====================

// Add Meal Attendance Table
async function addMealAttendanceTable(mealAttendanceTableData) {
  try {
    // First create the meal attendance table
    const newMealAttendanceTable = await prisma.mealAttendanceTables.create({
      data: {
        eventId: mealAttendanceTableData.eventId,
        dayNumber: mealAttendanceTableData.dayNumber,
      },
    });

    // Then automatically generate QR code for this table
    const updatedTable = await generateMealAttendanceTableQRCode(
      mealAttendanceTableData.eventId,
      mealAttendanceTableData.dayNumber
    );

    return updatedTable;
  } catch (error) {
    throw new Error(`Error adding meal attendance table: ${error.message}`);
  }
}

// Get Meal Attendance Tables by Event
async function getMealAttendanceTablesByEvent(eventId) {
  try {
    const mealAttendanceTables = await prisma.mealAttendanceTables.findMany({
      where: {
        eventId: parseInt(eventId),
      },
      orderBy: {
        dayNumber: "asc",
      },
    });
    return mealAttendanceTables;
  } catch (error) {
    throw new Error(`Error fetching meal attendance tables: ${error.message}`);
  }
}

// Get Meal Attendance Table by Day
async function getMealAttendanceTableByDay(eventId, dayNumber) {
  try {
    const mealAttendanceTable = await prisma.mealAttendanceTables.findFirst({
      where: {
        eventId: parseInt(eventId),
        dayNumber: parseInt(dayNumber),
      },
    });
    return mealAttendanceTable;
  } catch (error) {
    throw new Error(
      `Error fetching meal attendance table by day: ${error.message}`
    );
  }
}

// ==================== QR CODE GENERATION FUNCTIONS ====================

// Generate QR Code for Attendance Table
async function generateAttendanceTableQRCode(eventId, dayNumber) {
  try {
    // Get event and attendance table data
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
    });

    const attendanceTable = await prisma.attendanceTables.findFirst({
      where: {
        eventId: parseInt(eventId),
        dayNumber: parseInt(dayNumber),
      },
    });

    if (!event || !attendanceTable) {
      throw new Error("Event or attendance table not found");
    }

    // Calculate the date for this day
    const eventDate = new Date(event.date);
    const dayDate = new Date(
      eventDate.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000
    );

    // Create QR code data
    const qrCodeData = {
      type: "attendance",
      eventId: event.id,
      eventName: event.name,
      dayNumber: dayNumber,
      date: dayDate.toISOString().split("T")[0],
      location: event.location,
      latitude: event.eventLatitude,
      longitude: event.eventLongitude,
      geofencingRadius: event.geofencingRadius || 50,
      startTime: event.startTime,
      endTime: event.endTime,
      tableId: attendanceTable.id,
      timestamp: new Date().toISOString(),
    };

    // Generate QR code image (we'll use a simple text representation for now)
    // In production, you'd use a QR code library like 'qrcode'
    const qrCodeImage = `data:image/svg+xml;base64,${Buffer.from(
      `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="12">
          Attendance Day ${dayNumber}
        </text>
        <text x="100" y="120" text-anchor="middle" font-family="Arial" font-size="10">
          ${event.name}
        </text>
      </svg>
    `
    ).toString("base64")}`;

    // Update the attendance table with QR code data
    const updatedTable = await prisma.attendanceTables.update({
      where: { id: attendanceTable.id },
      data: {
        qrCodeData: JSON.stringify(qrCodeData),
        qrCodeImage: qrCodeImage,
      },
    });

    return updatedTable;
  } catch (error) {
    throw new Error(`Error generating attendance QR code: ${error.message}`);
  }
}

// Generate QR Code for Meal Attendance Table
async function generateMealAttendanceTableQRCode(eventId, dayNumber) {
  try {
    // Get event and meal attendance table data
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
    });

    const mealAttendanceTable = await prisma.mealAttendanceTables.findFirst({
      where: {
        eventId: parseInt(eventId),
        dayNumber: parseInt(dayNumber),
      },
    });

    if (!event || !mealAttendanceTable) {
      throw new Error("Event or meal attendance table not found");
    }

    // Calculate the date for this day
    const eventDate = new Date(event.date);
    const dayDate = new Date(
      eventDate.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000
    );

    // Create QR code data
    const qrCodeData = {
      type: "meal_attendance",
      eventId: event.id,
      eventName: event.name,
      dayNumber: dayNumber,
      date: dayDate.toISOString().split("T")[0],
      location: event.location,
      latitude: event.eventLatitude,
      longitude: event.eventLongitude,
      geofencingRadius: event.geofencingRadius || 50,
      startTime: event.startTime,
      endTime: event.endTime,
      tableId: mealAttendanceTable.id,
      timestamp: new Date().toISOString(),
    };

    // Generate QR code image (we'll use a simple text representation for now)
    const qrCodeImage = `data:image/svg+xml;base64,${Buffer.from(
      `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="12">
          Meal Day ${dayNumber}
        </text>
        <text x="100" y="120" text-anchor="middle" font-family="Arial" font-size="10">
          ${event.name}
        </text>
      </svg>
    `
    ).toString("base64")}`;

    // Update the meal attendance table with QR code data
    const updatedTable = await prisma.mealAttendanceTables.update({
      where: { id: mealAttendanceTable.id },
      data: {
        qrCodeData: JSON.stringify(qrCodeData),
        qrCodeImage: qrCodeImage,
      },
    });

    return updatedTable;
  } catch (error) {
    throw new Error(
      `Error generating meal attendance QR code: ${error.message}`
    );
  }
}

// Event Participation Functions
async function joinEvent(userId, eventId) {
  try {
    // Check if user is already participating
    const existingParticipation = await prisma.eventParticipation.findUnique({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: eventId,
        },
      },
    });

    if (existingParticipation) {
      // Update status to joined if previously unjoined
      if (existingParticipation.status === "unjoined") {
        const updatedParticipation = await prisma.eventParticipation.update({
          where: {
            userId_eventId: {
              userId: userId,
              eventId: eventId,
            },
          },
          data: {
            status: "joined",
            joinedAt: new Date(),
            updatedAt: new Date(),
          },
        });
        return updatedParticipation;
      } else {
        throw new Error("User is already participating in this event");
      }
    }

    // Create new participation
    const newParticipation = await prisma.eventParticipation.create({
      data: {
        userId: userId,
        eventId: eventId,
        status: "joined",
        joinedAt: new Date(),
      },
    });

    return newParticipation;
  } catch (error) {
    throw new Error(`Error joining event: ${error.message}`);
  }
}

async function unjoinEvent(userId, eventId) {
  try {
    const existingParticipation = await prisma.eventParticipation.findUnique({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: eventId,
        },
      },
    });

    if (!existingParticipation) {
      throw new Error("User is not participating in this event");
    }

    // Update status to unjoined
    const updatedParticipation = await prisma.eventParticipation.update({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: eventId,
        },
      },
      data: {
        status: "unjoined",
        updatedAt: new Date(),
      },
    });

    return updatedParticipation;
  } catch (error) {
    throw new Error(`Error unjoining event: ${error.message}`);
  }
}

async function getUserEventParticipations(userId) {
  try {
    const participations = await prisma.eventParticipation.findMany({
      where: {
        userId: userId,
      },
      include: {
        event: {
          include: {
            creator: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                position: true,
                designationId: true,
                designationName: true,
                unitId: true,
                unitName: true,
                schoolId: true,
                schoolName: true,
                isPasswordChanged: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    return participations;
  } catch (error) {
    throw new Error(
      `Error getting user event participations: ${error.message}`
    );
  }
}

async function checkUserEventParticipation(userId, eventId) {
  try {
    const participation = await prisma.eventParticipation.findUnique({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: eventId,
        },
      },
    });

    return participation;
  } catch (error) {
    throw new Error(
      `Error checking user event participation: ${error.message}`
    );
  }
}

async function getEventParticipants(eventId) {
  try {
    const participants = await prisma.eventParticipation.findMany({
      where: {
        eventId: eventId,
        status: "joined",
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            position: true,
            designationName: true,
            unitName: true,
            schoolName: true,
          },
        },
      },
    });

    return participants;
  } catch (error) {
    throw new Error(`Error getting event participants: ${error.message}`);
  }
}

// Generate Email Code for Event Joining
async function generateEmailCode(eventId, userId) {
  try {
    // Convert eventId to integer
    const eventIdInt = parseInt(eventId);
    const userIdInt = parseInt(userId);

    // Generate a 6-digit random code
    const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated email code:", emailCode, "Type:", typeof emailCode);

    // Store the code in database with expiration (5 minutes)
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // For now, we'll store it in a simple way. In production, you might want a separate table
    // We'll use the eventParticipation table to store the email code temporarily
    await prisma.eventParticipation.upsert({
      where: {
        userId_eventId: {
          userId: userIdInt,
          eventId: eventIdInt,
        },
      },
      update: {
        emailCode: emailCode,
        emailCodeExpires: expirationTime,
        status: "pending_email_code",
      },
      create: {
        userId: userIdInt,
        eventId: eventIdInt,
        emailCode: emailCode,
        emailCodeExpires: expirationTime,
        status: "pending_email_code",
      },
    });

    return emailCode;
  } catch (error) {
    throw new Error(`Error generating email code: ${error.message}`);
  }
}

// Validate Email Code for Event Joining
async function validateEmailCode(eventId, userId, emailCode) {
  try {
    // Convert parameters to integers
    const eventIdInt = parseInt(eventId);
    const userIdInt = parseInt(userId);

    const participation = await prisma.eventParticipation.findUnique({
      where: {
        userId_eventId: {
          userId: userIdInt,
          eventId: eventIdInt,
        },
      },
    });

    if (!participation || !participation.emailCode) {
      return { valid: false, message: "No email code found for this event" };
    }

    if (participation.emailCodeExpires < new Date()) {
      return { valid: false, message: "Email code has expired" };
    }

    // Debug logging
    console.log("Email code validation debug:");
    console.log(
      "Stored code:",
      participation.emailCode,
      "Type:",
      typeof participation.emailCode
    );
    console.log("Provided code:", emailCode, "Type:", typeof emailCode);
    console.log("Codes match:", participation.emailCode === emailCode);

    if (participation.emailCode !== emailCode) {
      return { valid: false, message: "Invalid email code" };
    }

    // Update status to joined
    await prisma.eventParticipation.update({
      where: {
        userId_eventId: {
          userId: userIdInt,
          eventId: eventIdInt,
        },
      },
      data: {
        status: "joined",
        joinedAt: new Date(),
        emailCode: null, // Clear the code after successful validation
        emailCodeExpires: null,
      },
    });

    return { valid: true, message: "Email code validated successfully" };
  } catch (error) {
    throw new Error(`Error validating email code: ${error.message}`);
  }
}

// Generate QR Code Data for Event
async function generateEventQRCodeData(eventId) {
  try {
    // Convert eventId to integer
    const eventIdInt = parseInt(eventId);

    const event = await prisma.event.findUnique({
      where: { id: eventIdInt },
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true,
            position: true,
            unitName: true,
          },
        },
      },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    // Create QR code data with event information
    const qrData = {
      type: "event_join",
      eventId: event.id,
      eventName: event.name,
      eventDate: event.startDate,
      eventLocation: {
        name: event.eventLocation,
        latitude: event.eventLatitude,
        longitude: event.eventLongitude,
      },
      creator: event.creator,
      timestamp: new Date().toISOString(),
    };

    return qrData;
  } catch (error) {
    throw new Error(`Error generating QR code data: ${error.message}`);
  }
}

// Join Event with QR Code
async function joinEventWithQRCode(eventId, userId, qrData) {
  try {
    // Convert parameters to integers
    const eventIdInt = parseInt(eventId);
    const userIdInt = parseInt(userId);

    // Validate QR code data
    if (
      !qrData ||
      qrData.type !== "event_join" ||
      qrData.eventId !== eventIdInt
    ) {
      throw new Error("Invalid QR code data");
    }

    // Check if user is already joined
    const existingParticipation = await prisma.eventParticipation.findUnique({
      where: {
        userId_eventId: {
          userId: userIdInt,
          eventId: eventIdInt,
        },
      },
    });

    if (existingParticipation && existingParticipation.status === "joined") {
      return {
        success: false,
        message: "You are already joined to this event",
      };
    }

    // Create or update participation record
    await prisma.eventParticipation.upsert({
      where: {
        userId_eventId: {
          userId: userIdInt,
          eventId: eventIdInt,
        },
      },
      update: {
        status: "joined",
        joinedAt: new Date(),
      },
      create: {
        userId: userIdInt,
        eventId: eventIdInt,
        status: "joined",
        joinedAt: new Date(),
      },
    });

    return { success: true, message: "Successfully joined event with QR code" };
  } catch (error) {
    throw new Error(`Error joining event with QR code: ${error.message}`);
  }
}

module.exports = {
  // Event functions
  addEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  updateEventStatus,

  // Attendance functions
  addAttendanceTable,
  getAttendanceTablesByEvent,
  getAttendanceTableByDay,
  generateAttendanceTableQRCode,

  // Meal Attendance functions
  addMealAttendanceTable,
  getMealAttendanceTablesByEvent,
  getMealAttendanceTableByDay,
  generateMealAttendanceTableQRCode,

  // Event Participation functions
  joinEvent,
  unjoinEvent,
  getUserEventParticipations,
  checkUserEventParticipation,
  getEventParticipants,

  // Email Code functions
  generateEmailCode,
  validateEmailCode,

  // QR Code functions
  generateEventQRCodeData,
  joinEventWithQRCode,

  getAllPdPrograms,
  getAllFundSources,
  getAllDesignations,
  getAllUnits,
  getAllSchools,
};
