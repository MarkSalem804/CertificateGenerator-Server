const express = require("express");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
const userService = require("./user-services");
const { validateRegistration } = require("../Middlewares/validation");

// JWT Secret - should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET;

userRouter.post("/register", validateRegistration, async (req, res) => {
  try {
    console.log("📧 Starting user registration process...");
    const result = await userService.registerUser(req.body);

    // Check if email was sent successfully
    if (result.emailSent) {
      console.log(
        `✅ User registered and password email sent to ${req.body.email}`
      );
    } else {
      console.log(
        `⚠️ User registered but password email failed to send to ${req.body.email}`
      );
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("❌ User registration failed:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password, loginAsRole } = req.body;
  try {
    const user = await userService.authenticateUser(email, password);

    // Validate that the user can log in as the selected role
    if (loginAsRole && loginAsRole !== user.role) {
      // Check if user has permission to log in as this role
      // For now, we'll allow any role selection, but you can add validation logic here
      console.log(
        `🎭 [Login] User ${user.email} logging in as ${loginAsRole} (actual role: ${user.role})`
      );

      // Override the user's role for this session
      user.sessionRole = loginAsRole;
      user.originalRole = user.role;
    }

    // Generate JWT access token
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.sessionRole || user.role, // Use session role if available
        originalRole: user.originalRole || user.role, // Store original role for reference
      },
      JWT_SECRET,
      { expiresIn: "4h" } // Access token expires in 4 hours
    );

    // Generate refresh token
    const refreshToken = await userService.generateRefreshToken();
    await userService.saveRefreshToken(user.id, refreshToken);

    console.log(
      "🔑 [Login] JWT access token and refresh token generated for user:",
      user.email
    );

    // Set HTTP-only cookies
    res.cookie("token", accessToken, {
      httpOnly: true, // Can't be accessed by JavaScript (XSS protection)
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // CSRF protection
      maxAge: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
      path: "/", // Available for all routes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: "/",
    });

    console.log("🍪 [Login] HTTP-only cookies set for user:", user.email);

    // Prepare user data for response
    const userResponse = {
      ...user,
      role: user.sessionRole || user.role, // Use session role for the response
      originalRole: user.originalRole || user.role, // Include original role for reference
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userResponse,
      // Don't send token in response body for security
    });
  } catch (error) {
    console.error("❌ [Login] Authentication failed:", error.message);
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
});

// Logout route - Clear HTTP-only cookie
userRouter.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: "Refresh token required",
      });
    }

    const result = await userService.refreshAccessToken(refreshToken);

    // Set new access token cookie
    res.cookie("token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
      path: "/",
    });

    console.log(
      "🔄 [Refresh] New access token generated for user:",
      result.user.email
    );

    res.json({
      success: true,
      message: "Token refreshed successfully",
      user: result.user,
    });
  } catch (error) {
    console.error("❌ [Refresh] Token refresh failed:", error.message);
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
});

userRouter.post("/logout", async (req, res) => {
  try {
    console.log("🚪 [Logout] Clearing authentication cookies");

    // Get user ID from token if available
    const token = req.cookies?.token;
    let userId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // Token is invalid, but we still want to clear cookies
        console.log("⚠️ [Logout] Invalid token during logout");
      }
    }

    // Revoke refresh token if user ID is available
    if (userId) {
      await userService.revokeRefreshToken(userId);
      console.log("🔄 [Logout] Refresh token revoked for user:", userId);
    }

    // Clear both cookies
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("❌ [Logout] Error clearing cookies:", error.message);
    res.status(500).json({
      success: false,
      error: "Logout failed",
    });
  }
});

userRouter.get("/getAllUsers", async (req, res) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Change Password - PATCH for partial update
userRouter.patch("/changePassword", async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "User ID, current password, and new password are required",
      });
    }

    const result = await userService.changePassword(
      userId,
      currentPassword,
      newPassword
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Reset Password - POST for action (admin-initiated reset)
userRouter.post("/resetPassword", async (req, res) => {
  try {
    const { userId, adminId } = req.body;

    if (!userId || !adminId) {
      return res.status(400).json({
        success: false,
        error: "User ID and admin ID are required",
      });
    }

    const result = await userService.resetPassword(userId, adminId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

userRouter.post("/updateExistingUsersWithNames", async (req, res) => {
  try {
    console.log("🔄 Starting bulk update of existing users with names...");
    await userService.updateExistingUsersWithNames();

    res.status(200).json({
      success: true,
      message:
        "Existing users updated with designation, unit, and school names",
    });
  } catch (error) {
    console.error("❌ Error updating existing users:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Forced Password Change - PATCH (for users who must change password)
userRouter.patch("/forcedPasswordChange/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        error: "New password is required",
      });
    }

    // Convert id to integer since Prisma expects Int
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID provided",
      });
    }

    const result = await userService.forcedPasswordChange(userId, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Update User - PUT for full update (excluding password)
userRouter.put("/updateUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove password from update data to keep existing password
    delete updateData.password;

    // Convert id to integer since Prisma expects Int
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID provided",
      });
    }

    const result = await userService.updateUser(userId, updateData);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

userRouter.delete("/deleteUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Convert id to integer since Prisma expects Int
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID provided",
      });
    }

    const result = await userService.deleteUser(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = userRouter;
