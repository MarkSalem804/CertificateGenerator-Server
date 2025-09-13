/**
 * Geofencing utility functions for attendance tracking
 */

// Default geofencing radius in meters (50 meters = ~164 feet)
const DEFAULT_RADIUS = 50;

// Geofencing radius options
const GEOFENCING_RADIUS_OPTIONS = {
  TIGHT: 20, // Tight control for specific venues
  DEFAULT: 50, // Good default for most venues
  LOOSE: 100, // Loose control for large venues
};

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // in metres
  return distance;
}

/**
 * Check if a participant is within the geofencing radius of an event
 * @param {number} eventLat - Event latitude
 * @param {number} eventLon - Event longitude
 * @param {number} participantLat - Participant latitude
 * @param {number} participantLon - Participant longitude
 * @param {number} radius - Allowed radius in meters (optional, defaults to DEFAULT_RADIUS)
 * @returns {Object} { isWithinRadius: boolean, distance: number, radius: number }
 */
function checkGeofencing(
  eventLat,
  eventLon,
  participantLat,
  participantLon,
  radius = DEFAULT_RADIUS
) {
  try {
    // Validate input coordinates
    if (!eventLat || !eventLon || !participantLat || !participantLon) {
      throw new Error("All coordinates are required for geofencing check");
    }

    // Convert string coordinates to numbers if needed
    const eventLatNum = parseFloat(eventLat);
    const eventLonNum = parseFloat(eventLon);
    const participantLatNum = parseFloat(participantLat);
    const participantLonNum = parseFloat(participantLon);

    // Validate coordinate ranges
    if (
      eventLatNum < -90 ||
      eventLatNum > 90 ||
      eventLonNum < -180 ||
      eventLonNum > 180 ||
      participantLatNum < -90 ||
      participantLatNum > 90 ||
      participantLonNum < -180 ||
      participantLonNum > 180
    ) {
      throw new Error("Invalid coordinate values");
    }

    const distance = calculateDistance(
      eventLatNum,
      eventLonNum,
      participantLatNum,
      participantLonNum
    );

    const isWithinRadius = distance <= radius;

    return {
      isWithinRadius,
      distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
      radius,
      eventLocation: { lat: eventLatNum, lon: eventLonNum },
      participantLocation: { lat: participantLatNum, lon: participantLonNum },
    };
  } catch (error) {
    console.error("❌ [Geofencing] Error checking geofencing:", error.message);
    throw new Error(`Geofencing check failed: ${error.message}`);
  }
}

/**
 * Validate if coordinates are within valid ranges
 * @param {number|string} lat - Latitude
 * @param {number|string} lon - Longitude
 * @returns {boolean} True if coordinates are valid
 */
function validateCoordinates(lat, lon) {
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);

  return (
    !isNaN(latNum) &&
    !isNaN(lonNum) &&
    latNum >= -90 &&
    latNum <= 90 &&
    lonNum >= -180 &&
    lonNum <= 180
  );
}

/**
 * Format distance for display
 * @param {number} distance - Distance in meters
 * @returns {string} Formatted distance string
 */
function formatDistance(distance) {
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  } else {
    return `${(distance / 1000).toFixed(2)}km`;
  }
}

/**
 * Get geofencing status message
 * @param {Object} geofencingResult - Result from checkGeofencing
 * @returns {string} Status message
 */
function getGeofencingStatusMessage(geofencingResult) {
  const { isWithinRadius, distance, radius } = geofencingResult;

  if (isWithinRadius) {
    return `✅ Within venue (${formatDistance(distance)} from event location)`;
  } else {
    return `❌ Outside venue (${formatDistance(
      distance
    )} from event location, max allowed: ${formatDistance(radius)})`;
  }
}

module.exports = {
  calculateDistance,
  checkGeofencing,
  validateCoordinates,
  formatDistance,
  getGeofencingStatusMessage,
  DEFAULT_RADIUS,
  GEOFENCING_RADIUS_OPTIONS,
};
