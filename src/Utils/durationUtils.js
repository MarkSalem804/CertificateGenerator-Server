/**
 * Utility functions for calculating attendance durations
 */

/**
 * Calculate duration between two times in minutes
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @returns {number} Duration in minutes
 */
function calculateDurationMinutes(startTime, endTime) {
  if (!startTime || !endTime) return 0;

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) return 0;

  return Math.round((end - start) / (1000 * 60)); // Convert to minutes
}

/**
 * Format duration in minutes to human-readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration (e.g., "2h 30m", "45m", "1h")
 */
function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return "0m";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${remainingMinutes}m`;
  }
}

/**
 * Calculate all durations for an attendance record
 * @param {Object} attendance - Attendance record with time fields
 * @returns {Object} Calculated durations
 */
function calculateAttendanceDurations(attendance) {
  const { amInTime, amOutTime, pmInTime, pmOutTime } = attendance;

  // Calculate individual session durations
  const morningDuration = calculateDurationMinutes(amInTime, amOutTime);
  const afternoonDuration = calculateDurationMinutes(pmInTime, pmOutTime);

  // Calculate break duration (time between AM Out and PM In)
  const breakDuration = calculateDurationMinutes(amOutTime, pmInTime);

  // Calculate total duration (morning + afternoon)
  const totalDuration = morningDuration + afternoonDuration;

  // Calculate total time span (from AM In to PM Out)
  const totalTimeSpan = calculateDurationMinutes(amInTime, pmOutTime);

  return {
    morningDuration,
    afternoonDuration,
    breakDuration,
    totalDuration,
    totalTimeSpan,
    morningDurationFormatted: formatDuration(morningDuration),
    afternoonDurationFormatted: formatDuration(afternoonDuration),
    breakDurationFormatted: formatDuration(breakDuration),
    totalDurationFormatted: formatDuration(totalDuration),
    totalTimeSpanFormatted: formatDuration(totalTimeSpan),
  };
}

/**
 * Generate duration summary string for display
 * @param {Object} durations - Calculated durations object
 * @returns {string} Summary string
 */
function generateDurationSummary(durations) {
  const {
    totalDurationFormatted,
    morningDurationFormatted,
    afternoonDurationFormatted,
  } = durations;

  if (durations.morningDuration > 0 && durations.afternoonDuration > 0) {
    return `Total: ${totalDurationFormatted} (AM: ${morningDurationFormatted}, PM: ${afternoonDurationFormatted})`;
  } else if (durations.morningDuration > 0) {
    return `Morning: ${morningDurationFormatted}`;
  } else if (durations.afternoonDuration > 0) {
    return `Afternoon: ${afternoonDurationFormatted}`;
  } else {
    return "No duration recorded";
  }
}

/**
 * Check if attendance meets minimum duration requirement
 * @param {Object} durations - Calculated durations object
 * @param {number} minimumMinutes - Minimum required minutes
 * @returns {Object} Validation result
 */
function validateMinimumDuration(durations, minimumMinutes = 0) {
  const { totalDuration } = durations;
  const meetsRequirement = totalDuration >= minimumMinutes;

  return {
    meetsRequirement,
    actualDuration: totalDuration,
    requiredDuration: minimumMinutes,
    difference: totalDuration - minimumMinutes,
    status: meetsRequirement ? "PASS" : "FAIL",
  };
}

module.exports = {
  calculateDurationMinutes,
  formatDuration,
  calculateAttendanceDurations,
  generateDurationSummary,
  validateMinimumDuration,
};
