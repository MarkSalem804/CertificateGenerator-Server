/**
 * Socket.io utility functions for real-time communication
 */

/**
 * Broadcast event creation to all connected clients
 * @param {Object} io - Socket.io instance
 * @param {Object} eventData - Event data to broadcast
 */
const broadcastEventCreated = (io, eventData) => {
  try {
    io.emit("event-created", {
      type: "event-created",
      data: eventData,
      timestamp: new Date().toISOString(),
    });
    console.log(
      `📢 Broadcasted event creation: ${eventData?.name || "Unknown Event"}`
    );
  } catch (error) {
    console.error("Error broadcasting event creation:", error);
  }
};

/**
 * Broadcast event creation to both HTTP and HTTPS clients
 * @param {Object} req - Express request object
 * @param {Object} eventData - Event data to broadcast
 */
const broadcastEventCreatedBoth = (req, eventData) => {
  const io = req.app.get("io");
  const httpsIO = req.app.get("httpsIO");

  if (io) broadcastEventCreated(io, eventData);
  if (httpsIO) broadcastEventCreated(httpsIO, eventData);
};

/**
 * Broadcast event update to specific event room
 * @param {Object} io - Socket.io instance
 * @param {string} eventId - Event ID
 * @param {Object} eventData - Updated event data
 */
const broadcastEventUpdated = (io, eventId, eventData) => {
  try {
    io.to(`event-${eventId}`).emit("event-updated", {
      type: "event-updated",
      eventId: eventId,
      data: eventData,
      timestamp: new Date().toISOString(),
    });
    console.log(`📢 Broadcasted event update for event: ${eventId}`);
  } catch (error) {
    console.error("Error broadcasting event update:", error);
  }
};

/**
 * Broadcast attendance table creation to event room
 * @param {Object} io - Socket.io instance
 * @param {string} eventId - Event ID
 * @param {Object} tableData - Table data to broadcast
 */
const broadcastTableCreated = (io, eventId, tableData) => {
  try {
    io.to(`event-${eventId}`).emit("table-created", {
      type: "table-created",
      eventId: eventId,
      data: tableData,
      timestamp: new Date().toISOString(),
    });
    console.log(`📢 Broadcasted table creation for event: ${eventId}`);
  } catch (error) {
    console.error("Error broadcasting table creation:", error);
  }
};

/**
 * Broadcast participant join/unjoin to event room
 * @param {Object} io - Socket.io instance
 * @param {string} eventId - Event ID
 * @param {Object} participantData - Participant data
 * @param {string} action - 'joined' or 'left'
 */
const broadcastParticipantAction = (io, eventId, participantData, action) => {
  try {
    io.to(`event-${eventId}`).emit("participant-action", {
      type: "participant-action",
      eventId: eventId,
      action: action,
      data: participantData,
      timestamp: new Date().toISOString(),
    });
    console.log(`📢 Broadcasted participant ${action} for event: ${eventId}`);
  } catch (error) {
    console.error("Error broadcasting participant action:", error);
  }
};

/**
 * Broadcast general notification to all clients
 * @param {Object} io - Socket.io instance
 * @param {string} message - Notification message
 * @param {string} type - Notification type (info, success, warning, error)
 */
const broadcastNotification = (io, message, type = "info") => {
  try {
    io.emit("notification", {
      type: "notification",
      message: message,
      notificationType: type,
      timestamp: new Date().toISOString(),
    });
    console.log(`📢 Broadcasted notification: ${message}`);
  } catch (error) {
    console.error("Error broadcasting notification:", error);
  }
};

/**
 * Broadcast event update to both HTTP and HTTPS clients
 * @param {Object} req - Express request object
 * @param {string} eventId - Event ID
 * @param {Object} eventData - Updated event data
 */
const broadcastEventUpdatedBoth = (req, eventId, eventData) => {
  const io = req.app.get("io");
  const httpsIO = req.app.get("httpsIO");

  if (io) broadcastEventUpdated(io, eventId, eventData);
  if (httpsIO) broadcastEventUpdated(httpsIO, eventId, eventData);
};

/**
 * Broadcast table creation to both HTTP and HTTPS clients
 * @param {Object} req - Express request object
 * @param {string} eventId - Event ID
 * @param {Object} tableData - Table data to broadcast
 */
const broadcastTableCreatedBoth = (req, eventId, tableData) => {
  const io = req.app.get("io");
  const httpsIO = req.app.get("httpsIO");

  if (io) broadcastTableCreated(io, eventId, tableData);
  if (httpsIO) broadcastTableCreated(httpsIO, eventId, tableData);
};

/**
 * Broadcast participant action to both HTTP and HTTPS clients
 * @param {Object} req - Express request object
 * @param {string} eventId - Event ID
 * @param {Object} participantData - Participant data
 * @param {string} action - 'joined' or 'left'
 */
const broadcastParticipantActionBoth = (
  req,
  eventId,
  participantData,
  action
) => {
  const io = req.app.get("io");
  const httpsIO = req.app.get("httpsIO");

  if (io) broadcastParticipantAction(io, eventId, participantData, action);
  if (httpsIO)
    broadcastParticipantAction(httpsIO, eventId, participantData, action);
};

/**
 * Broadcast notification to both HTTP and HTTPS clients
 * @param {Object} req - Express request object
 * @param {string} message - Notification message
 * @param {string} type - Notification type (info, success, warning, error)
 */
const broadcastNotificationBoth = (req, message, type = "info") => {
  const io = req.app.get("io");
  const httpsIO = req.app.get("httpsIO");

  if (io) broadcastNotification(io, message, type);
  if (httpsIO) broadcastNotification(httpsIO, message, type);
};

module.exports = {
  broadcastEventCreated,
  broadcastEventUpdated,
  broadcastTableCreated,
  broadcastParticipantAction,
  broadcastNotification,
  // Both HTTP and HTTPS versions
  broadcastEventCreatedBoth,
  broadcastEventUpdatedBoth,
  broadcastTableCreatedBoth,
  broadcastParticipantActionBoth,
  broadcastNotificationBoth,
};
