const validateRegistration = (req, res, next) => {
  const { email, password, schoolId, officeId, role, designation, positionId } =
    req.body;

  // Check required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format",
    });
  }

  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 6 characters long",
    });
  }

  // Validate numeric fields if provided
  if (schoolId && isNaN(parseInt(schoolId))) {
    return res.status(400).json({
      success: false,
      error: "School ID must be a valid number",
    });
  }

  if (officeId && isNaN(parseInt(officeId))) {
    return res.status(400).json({
      success: false,
      error: "Office ID must be a valid number",
    });
  }

  if (positionId && isNaN(parseInt(positionId))) {
    return res.status(400).json({
      success: false,
      error: "Position ID must be a valid number",
    });
  }

  // Role is optional during registration - will default to "participant" in the database
  // Role selection happens during login, not registration

  // If all validations pass, proceed to next middleware
  next();
};

module.exports = {
  validateRegistration,
};
