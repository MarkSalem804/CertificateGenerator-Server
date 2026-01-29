const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userORM = require("./user-database");
const sendEmail = require("../Middlewares/sendEmail");

async function authenticateUser(email, password) {
  try {
    // First, find the user by email
    const user = await userORM.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Then compare the provided password with the hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Update last login timestamp
    const updatedUser = await userORM.updateLastLogin(user.id);

    // Return user data without password for security
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  } catch (error) {
    throw new Error("Error authenticating user: " + error.message);
  }
}

async function registerUser(userData) {
  try {
    // Validate required fields
    const { email, password, fullName } = userData;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Validate password strength
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Create user through ORM
    const newUser = await userORM.createUser(userData);

    // Send password via email
    let emailSent = false;
    try {
      const emailSubject =
        "Welcome to SDOIC eCertificate Generator - Your Login Credentials";
      const emailHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">SDOIC eCertificate Generator</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Welcome to the system!</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin-top: 0;">Hello ${
              fullName || "User"
            }!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your account has been successfully created in the SDOIC eCertificate Generation and Management System.
            </p>
            
                         <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #0d9488; margin: 20px 0;">
               <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">🔐 Your Default Password</h3>
               <div style="text-align: center; margin: 20px 0;">
                 <p style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 2px; color: #333;">${password}</p>
               </div>
             </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
              <h4 style="color: #856404; margin-top: 0; margin-bottom: 10px;">⚠️ Important Security Notice</h4>
              <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
                For security reasons, please change your password after your first login. 
                Your current password is temporary and should be updated immediately.
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              You can now access the system using the credentials above. If you have any questions or need assistance, 
              please contact your system administrator.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="#" style="background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Access System
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; 2025 SDOIC eCertificate Generator. All rights reserved.</p>
          </div>
        </div>
      `;

      await sendEmail(email, emailSubject, emailHTML);
      emailSent = true;
      console.log(`✅ Password email sent successfully to ${email}`);
    } catch (emailError) {
      console.error(`❌ Error sending password email to ${email}:`, emailError);
      // Don't fail the registration if email fails, just log the error
    }

    return {
      success: true,
      message: "User registered successfully",
      user: newUser,
      emailSent: emailSent,
    };
  } catch (error) {
    throw new Error("Error registering user: " + error.message);
  }
}

async function getAllUsers(userRole = null, userSchoolName = null) {
  try {
    const users = await userORM.getAllUsers(userRole, userSchoolName);
    return {
      success: true,
      message: "Users fetched successfully",
      users: users,
    };
  } catch (error) {
    throw new Error("Error getting all users: " + error.message);
  }
}

async function changePassword(userId, currentPassword, newPassword) {
  try {
    // Validate password strength
    if (newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // First, verify the current password
    const user = await userORM.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and set isPasswordChanged to true
    const updatedUser = await userORM.updateUserPassword(
      userId,
      hashedPassword
    );

    return {
      success: true,
      message: "Password changed successfully",
      user: updatedUser,
    };
  } catch (error) {
    throw new Error("Error changing password: " + error.message);
  }
}

async function resetPassword(userId, adminId) {
  try {
    // Verify that the admin exists and has admin role
    const admin = await userORM.findUserById(adminId);
    if (!admin || admin.role !== "administrator") {
      throw new Error("Unauthorized: Administrator privileges required");
    }

    // Generate a new random password (8 characters with requirements)
    const newPassword = generateRandomPassword();

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and set isPasswordChanged to false (user needs to change it)
    const updatedUser = await userORM.updateUserPassword(
      userId,
      hashedPassword,
      false // isPasswordChanged = false
    );

    // Send the new password via email
    let emailSent = false;
    try {
      const emailSubject =
        "Your Password Has Been Reset - SDOIC eCertificate Generator";
      const emailHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">SDOIC eCertificate Generator</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Password Reset Notification</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin-top: 0;">Hello ${updatedUser.fullName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your password has been reset by an administrator. Please use the new password below to log in.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #0d9488; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">🔐 Your New Password</h3>
              <div style="text-align: center; margin: 20px 0;">
                <p style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 2px; color: #333;">${newPassword}</p>
              </div>
            </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
              <h4 style="color: #856404; margin-top: 0; margin-bottom: 10px;">⚠️ Important Security Notice</h4>
              <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
                For security reasons, please change your password after your first login. 
                Your current password is temporary and should be updated immediately.
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              You can now access the system using the credentials above. If you have any questions or need assistance, 
              please contact your system administrator.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="#" style="background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Access System
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; 2025 SDOIC eCertificate Generator. All rights reserved.</p>
          </div>
        </div>
      `;

      await sendEmail(updatedUser.email, emailSubject, emailHTML);
      emailSent = true;
      console.log(
        `✅ Password reset email sent successfully to ${updatedUser.email}`
      );
    } catch (emailError) {
      console.error(
        `❌ Error sending password reset email to ${updatedUser.email}:`,
        emailError
      );
      // Don't fail the reset if email fails, just log the error
    }

    return {
      success: true,
      message: "Password reset successfully",
      user: updatedUser,
      newPassword: newPassword, // Return plain password for admin reference
      emailSent: emailSent,
    };
  } catch (error) {
    throw new Error("Error resetting password: " + error.message);
  }
}

// Helper function to generate random password (same as frontend)
function generateRandomPassword() {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let password = "";

  // Ensure exactly 8 characters with required categories
  password += uppercase[Math.floor(Math.random() * uppercase.length)]; // 1 uppercase
  password += numbers[Math.floor(Math.random() * numbers.length)]; // 1 number
  password += specialChars[Math.floor(Math.random() * specialChars.length)]; // 1 special char
  password += lowercase[Math.floor(Math.random() * lowercase.length)]; // 1 lowercase

  // Fill remaining 4 characters randomly (total: 8 characters)
  const allChars = uppercase + lowercase + numbers + specialChars;
  for (let i = 4; i < 8; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to make it more random
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
}

async function updateExistingUsersWithNames() {
  try {
    console.log("🔄 Starting bulk update of existing users with names...");
    await userORM.updateExistingUsersWithNames();

    return {
      success: true,
      message:
        "Existing users updated with designation, unit, and school names",
    };
  } catch (error) {
    throw new Error("Error updating existing users: " + error.message);
  }
}

async function forcedPasswordChange(userId, newPassword) {
  try {
    // Validate password strength
    if (newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Hash the new password
    const bcrypt = require("bcryptjs");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password and set isPasswordChanged to true
    const updatedUser = await userORM.updateUserPassword(
      userId,
      hashedPassword,
      true
    );

    return {
      success: true,
      message: "Password changed successfully",
      user: updatedUser,
    };
  } catch (error) {
    throw new Error("Error changing password: " + error.message);
  }
}

async function updateUser(userId, updateData) {
  try {
    const updatedUser = await userORM.updateUser(userId, updateData);
    return {
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    };
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
}

async function deleteUser(userId) {
  try {
    await userORM.deleteUser(userId);
  } catch (error) {
    throw new Error("Error deleting user: " + error.message);
  }
}

async function generateRefreshToken() {
  return crypto.randomBytes(32).toString("hex");
}

async function saveRefreshToken(userId, refreshToken) {
  try {
    // Refresh token expires in 7 days
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

    await userORM.saveRefreshToken(userId, refreshToken, refreshTokenExpiry);
    return true;
  } catch (error) {
    throw new Error("Error saving refresh token: " + error.message);
  }
}

async function refreshAccessToken(refreshToken) {
  try {
    // Find user by refresh token
    const user = await userORM.findUserByRefreshToken(refreshToken);
    if (!user) {
      throw new Error("Invalid or expired refresh token");
    }

    // Generate new access token
    const jwt = require("jsonwebtoken");
    const JWT_SECRET = process.env.JWT_SECRET;

    const newAccessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "4h" } // New access token expires in 4 hours
    );

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      accessToken: newAccessToken,
    };
  } catch (error) {
    throw new Error("Error refreshing access token: " + error.message);
  }
}

async function revokeRefreshToken(userId) {
  try {
    await userORM.revokeRefreshToken(userId);
    return true;
  } catch (error) {
    throw new Error("Error revoking refresh token: " + error.message);
  }
}

module.exports = {
  authenticateUser,
  registerUser,
  getAllUsers,
  changePassword,
  resetPassword,
  forcedPasswordChange,
  updateExistingUsersWithNames,
  updateUser,
  deleteUser,
  generateRefreshToken,
  saveRefreshToken,
  refreshAccessToken,
  revokeRefreshToken,
};
