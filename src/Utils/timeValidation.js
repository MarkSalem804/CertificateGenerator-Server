/**
 * Time validation utilities for event attendance and participation
 */

/**
 * Check if the current time is within the event's daily time range
 * @param {Date} eventDate - The base event date
 * @param {number} dayNumber - The day number (1, 2, 3, etc.)
 * @param {string} startTime - Start time string (e.g., "08:00")
 * @param {string} endTime - End time string (e.g., "17:00")
 * @returns {boolean} - True if current time is within the allowed range
 */
function isWithinEventTimeRange(eventDate, dayNumber, startTime, endTime) {
  try {
    const now = new Date();

    // Calculate the specific day's date
    const dayDate = new Date(eventDate);
    dayDate.setDate(dayDate.getDate() + (dayNumber - 1));

    // Set the time to start of day for comparison
    const dayStart = new Date(dayDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayDate);
    dayEnd.setHours(23, 59, 59, 999);

    // Check if current date is the same as the event day
    const currentDate = new Date(now);
    currentDate.setHours(0, 0, 0, 0);
    const eventDayDate = new Date(dayDate);
    eventDayDate.setHours(0, 0, 0, 0);

    if (currentDate.getTime() !== eventDayDate.getTime()) {
      return false; // Not the same day
    }

    // Parse start and end times
    const [startHour, startMinute] = startTime
      ? startTime.split(":").map(Number)
      : [8, 0];
    const [endHour, endMinute] = endTime
      ? endTime.split(":").map(Number)
      : [17, 0];

    // Create time range for the day
    const dayStartTime = new Date(dayDate);
    dayStartTime.setHours(startHour, startMinute, 0, 0);

    const dayEndTime = new Date(dayDate);
    dayEndTime.setHours(endHour, endMinute, 0, 0);

    // Check if current time is within the allowed range
    return now >= dayStartTime && now <= dayEndTime;
  } catch (error) {
    console.error("Error in isWithinEventTimeRange:", error);
    return false;
  }
}

/**
 * Check if the event has ended (past the last day)
 * @param {Date} eventDate - The base event date
 * @param {number} numberOfDays - Total number of event days
 * @param {string} endTime - End time string for the last day
 * @returns {boolean} - True if the event has completely ended
 */
function isEventEnded(eventDate, numberOfDays, endTime) {
  try {
    const now = new Date();

    // Calculate the last day's date
    const lastDayDate = new Date(eventDate);
    lastDayDate.setDate(lastDayDate.getDate() + (numberOfDays - 1));

    // Parse end time
    const [endHour, endMinute] = endTime
      ? endTime.split(":").map(Number)
      : [17, 0];

    // Create end time for the last day
    const eventEndTime = new Date(lastDayDate);
    eventEndTime.setHours(endHour, endMinute, 0, 0);

    return now > eventEndTime;
  } catch (error) {
    console.error("Error in isEventEnded:", error);
    return true; // Assume ended if error
  }
}

/**
 * Check if a specific day has passed
 * @param {Date} eventDate - The base event date
 * @param {number} dayNumber - The day number (1, 2, 3, etc.)
 * @param {string} endTime - End time string for that day
 * @returns {boolean} - True if the day has passed
 */
function isDayPassed(eventDate, dayNumber, endTime) {
  try {
    const now = new Date();

    // Calculate the specific day's date
    const dayDate = new Date(eventDate);
    dayDate.setDate(dayDate.getDate() + (dayNumber - 1));

    // Parse end time
    const [endHour, endMinute] = endTime
      ? endTime.split(":").map(Number)
      : [17, 0];

    // Create end time for the day
    const dayEndTime = new Date(dayDate);
    dayEndTime.setHours(endHour, endMinute, 0, 0);

    return now > dayEndTime;
  } catch (error) {
    console.error("Error in isDayPassed:", error);
    return true; // Assume passed if error
  }
}

/**
 * Check if a user can join an event (after event starts)
 * @param {Date} eventDate - The base event date
 * @param {string} startTime - Start time string for the first day
 * @returns {boolean} - True if user can join (after event starts)
 */
function canJoinEvent(eventDate, startTime) {
  try {
    const now = new Date();

    // Parse start time
    const [startHour, startMinute] = startTime
      ? startTime.split(":").map(Number)
      : [8, 0];

    // Create start time for the first day
    const eventStartTime = new Date(eventDate);
    eventStartTime.setHours(startHour, startMinute, 0, 0);

    return now >= eventStartTime;
  } catch (error) {
    console.error("Error in canJoinEvent:", error);
    return false; // Assume cannot join if error
  }
}

/**
 * Get the status of an event day
 * @param {Date} eventDate - The base event date
 * @param {number} dayNumber - The day number (1, 2, 3, etc.)
 * @param {string} startTime - Start time string
 * @param {string} endTime - End time string
 * @returns {string} - 'upcoming', 'active', 'ended', or 'passed'
 */
function getDayStatus(eventDate, dayNumber, startTime, endTime) {
  try {
    const now = new Date();

    // Calculate the specific day's date
    const dayDate = new Date(eventDate);
    dayDate.setDate(dayDate.getDate() + (dayNumber - 1));

    // Parse times
    const [startHour, startMinute] = startTime
      ? startTime.split(":").map(Number)
      : [8, 0];
    const [endHour, endMinute] = endTime
      ? endTime.split(":").map(Number)
      : [17, 0];

    // Create time boundaries
    const dayStartTime = new Date(dayDate);
    dayStartTime.setHours(startHour, startMinute, 0, 0);

    const dayEndTime = new Date(dayDate);
    dayEndTime.setHours(endHour, endMinute, 0, 0);

    if (now < dayStartTime) {
      return "upcoming";
    } else if (now >= dayStartTime && now <= dayEndTime) {
      return "active";
    } else {
      return "ended";
    }
  } catch (error) {
    console.error("Error in getDayStatus:", error);
    return "passed";
  }
}

/**
 * Format time for display
 * @param {string} timeString - Time string (e.g., "08:00")
 * @returns {string} - Formatted time (e.g., "8:00 AM")
 */
function formatTime(timeString) {
  try {
    if (!timeString) return "8:00 AM";

    const [hour, minute] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error in formatTime:", error);
    return "8:00 AM";
  }
}

module.exports = {
  isWithinEventTimeRange,
  isEventEnded,
  isDayPassed,
  canJoinEvent,
  getDayStatus,
  formatTime,
};
