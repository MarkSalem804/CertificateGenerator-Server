const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function findUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        designation: {
          select: {
            id: true,
            name: true,
          },
        },
        unit: {
          select: {
            id: true,
            name: true,
          },
        },
        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) return null;

    // Map the user to include designationName, unitName, and schoolName
    return {
      ...user,
      designationName: user.designation?.name || null,
      unitName: user.unit?.name || null,
      schoolName: user.school?.name || null,
      designation: null, // Remove the full designation object
      unit: null, // Remove the full unit object
      school: null, // Remove the full school object
    };
  } catch (error) {
    throw new Error("Error finding user: " + error.message);
  }
}

async function findUserById(id) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        designation: {
          select: {
            id: true,
            name: true,
          },
        },
        unit: {
          select: {
            id: true,
            name: true,
          },
        },
        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) return null;

    // Map the user to include designationName, unitName, and schoolName
    return {
      ...user,
      designationName: user.designation?.name || null,
      unitName: user.unit?.name || null,
      schoolName: user.school?.name || null,
      designation: null, // Remove the full designation object
      unit: null, // Remove the full unit object
      school: null, // Remove the full school object
    };
  } catch (error) {
    throw new Error("Error finding user by ID: " + error.message);
  }
}

async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        designation: {
          select: {
            id: true,
            name: true,
          },
        },
        unit: {
          select: {
            id: true,
            name: true,
          },
        },
        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Map the users to include designationName, unitName, and schoolName
    const usersWithNames = users.map((user) => ({
      ...user,
      designationName: user.designation?.name || null,
      unitName: user.unit?.name || null,
      schoolName: user.school?.name || null,
      designation: null, // Remove the full designation object
      unit: null, // Remove the full unit object
      school: null, // Remove the full school object
    }));

    return usersWithNames;
  } catch (error) {
    throw new Error("Error getting all users: " + error.message);
  }
}

async function createUser(userData) {
  try {
    const {
      fullName,
      email,
      password,
      schoolId,
      unitId,
      role,
      designationId,
      position,
    } = userData;

    console.log("🔍 Creating user with data:", {
      fullName,
      email,
      schoolId,
      unitId,
      role,
      designationId,
      position,
    });

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Validate foreign key relationships if provided
    if (designationId) {
      const designation = await prisma.designation.findUnique({
        where: { id: parseInt(designationId) },
      });
      if (!designation) {
        throw new Error(`Designation with ID ${designationId} does not exist`);
      }
      console.log("✅ Designation found:", designation.name);
    }

    if (unitId) {
      const unit = await prisma.unit.findUnique({
        where: { id: parseInt(unitId) },
      });
      if (!unit) {
        throw new Error(`Unit with ID ${unitId} does not exist`);
      }
      console.log("✅ Unit found:", unit.name);
    }

    if (schoolId) {
      const school = await prisma.school.findUnique({
        where: { id: parseInt(schoolId) },
      });
      if (!school) {
        throw new Error(`School with ID ${schoolId} does not exist`);
      }
      console.log("✅ School found:", school.name);
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Get the names before creating the user
    let designationName = null;
    let unitName = null;
    let schoolName = null;

    if (designationId) {
      const designation = await prisma.designation.findUnique({
        where: { id: parseInt(designationId) },
        select: { name: true },
      });
      designationName = designation?.name || null;
    }

    if (unitId) {
      const unit = await prisma.unit.findUnique({
        where: { id: parseInt(unitId) },
        select: { name: true },
      });
      unitName = unit?.name || null;
    }

    if (schoolId) {
      const school = await prisma.school.findUnique({
        where: { id: parseInt(schoolId) },
        select: { name: true },
      });
      schoolName = school?.name || null;
    }

    // Create the user with the names included
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        schoolId: schoolId ? parseInt(schoolId) : null,
        unitId: unitId ? parseInt(unitId) : null,
        role:
          role &&
          [
            "administrator",
            "participant",
            "proponent",
            "unit_section_head",
            "supervisor",
            "school_head",
          ].includes(role)
            ? role
            : "participant", // Default to participant if no valid role specified
        designationId: designationId ? parseInt(designationId) : null,
        position: position || null,
        isPasswordChanged: false, // New users haven't changed their password yet
        designationName, // Save the name directly
        unitName, // Save the name directly
        schoolName, // Save the name directly
      },
    });

    // Names are now fetched via Prisma include, no need for separate queries

    // Return user data with names already included
    const { password: _, ...userWithoutPassword } = newUser;

    console.log("✅ User created successfully with data:", {
      id: userWithoutPassword.id,
      fullName: userWithoutPassword.fullName,
      email: userWithoutPassword.email,
      designationName: userWithoutPassword.designationName,
      unitName: userWithoutPassword.unitName,
      schoolName: userWithoutPassword.schoolName,
    });

    return userWithoutPassword;
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
}

async function updateUserPassword(
  userId,
  hashedPassword,
  isPasswordChanged = true
) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        password: hashedPassword,
        isPasswordChanged: isPasswordChanged,
        updatedAt: new Date(),
      },
      include: {
        designation: {
          select: {
            id: true,
            name: true,
          },
        },
        unit: {
          select: {
            id: true,
            name: true,
          },
        },
        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Map the user to include designationName, unitName, and schoolName
    return {
      ...updatedUser,
      designationName: updatedUser.designation?.name || null,
      unitName: updatedUser.unit?.name || null,
      schoolName: updatedUser.school?.name || null,
      designation: null, // Remove the full designation object
      unit: null, // Remove the full unit object
      school: null, // Remove the full school object
    };
  } catch (error) {
    throw new Error("Error updating user password: " + error.message);
  }
}

async function updateUser(userId, updateData) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        designation: {
          select: { name: true },
        },
        unit: {
          select: { name: true },
        },
        school: {
          select: { name: true },
        },
      },
    });

    // Return user data with names included
    return {
      ...updatedUser,
      designationName: updatedUser.designation?.name || null,
      unitName: updatedUser.unit?.name || null,
      schoolName: updatedUser.school?.name || null,
      designation: null, // Remove the full designation object
      unit: null, // Remove the full unit object
      school: null, // Remove the full school object
    };
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
}

async function updateExistingUsersWithNames() {
  try {
    console.log(
      "🔄 Updating existing users with designation, unit, and school names..."
    );

    // Get all users without include to see the raw data
    const allUsers = await prisma.user.findMany();

    for (const user of allUsers) {
      try {
        // Fetch related data for each user
        let designationName = null;
        let unitName = null;
        let schoolName = null;

        if (user.designationId) {
          const designation = await prisma.designation.findUnique({
            where: { id: user.designationId },
            select: { name: true },
          });
          designationName = designation?.name || null;
        }

        if (user.unitId) {
          const unit = await prisma.unit.findUnique({
            where: { id: user.unitId },
            select: { name: true },
          });
          unitName = unit?.name || null;
        }

        if (user.schoolId) {
          const school = await prisma.school.findUnique({
            where: { id: user.schoolId },
            select: { name: true },
          });
          schoolName = school?.name || null;
        }

        // Update the user with the names
        await prisma.user.update({
          where: { id: user.id },
          data: {
            designationName,
            unitName,
            schoolName,
          },
        });

        console.log(`✅ Updated user ${user.fullName} with names:`, {
          designationName,
          unitName,
          schoolName,
        });
      } catch (userError) {
        console.error(`❌ Error updating user ${user.id}:`, userError);
      }
    }

    console.log("✅ Finished updating existing users with names");
  } catch (error) {
    console.error("❌ Error updating existing users:", error);
    throw new Error("Error updating existing users: " + error.message);
  }
}

async function deleteUser(userId) {
  try {
    await prisma.user.delete({
      where: { id: parseInt(userId) },
    });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    throw new Error("Error deleting user: " + error.message);
  }
}

async function updateLastLogin(userId) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
      include: {
        designation: {
          select: { name: true },
        },
        unit: {
          select: { name: true },
        },
        school: {
          select: { name: true },
        },
      },
    });

    // Return user data with names included
    return {
      ...updatedUser,
      designationName: updatedUser.designation?.name || null,
      unitName: updatedUser.unit?.name || null,
      schoolName: updatedUser.school?.name || null,
      designation: null, // Remove the full designation object
      unit: null, // Remove the full unit object
      school: null, // Remove the full school object
    };
  } catch (error) {
    throw new Error("Error updating last login: " + error.message);
  }
}

async function saveRefreshToken(userId, refreshToken, expiryDate) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: refreshToken,
        refreshTokenExpiry: expiryDate,
      },
    });
    return true;
  } catch (error) {
    throw new Error("Error saving refresh token: " + error.message);
  }
}

async function findUserByRefreshToken(refreshToken) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        refreshToken: refreshToken,
        refreshTokenExpiry: {
          gt: new Date(), // Token hasn't expired yet
        },
      },
      include: {
        designation: {
          select: {
            id: true,
            name: true,
          },
        },
        unit: {
          select: {
            id: true,
            name: true,
          },
        },
        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) return null;

    // Map the user to include designationName, unitName, and schoolName
    return {
      ...user,
      designationName: user.designation?.name || null,
      unitName: user.unit?.name || null,
      schoolName: user.school?.name || null,
      designation: null,
      unit: null,
      school: null,
    };
  } catch (error) {
    throw new Error("Error finding user by refresh token: " + error.message);
  }
}

async function revokeRefreshToken(userId) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
        refreshTokenExpiry: null,
      },
    });
    return true;
  } catch (error) {
    throw new Error("Error revoking refresh token: " + error.message);
  }
}

module.exports = {
  findUserByEmail,
  findUserById,
  getAllUsers,
  createUser,
  updateUser,
  updateUserPassword,
  updateLastLogin,
  updateExistingUsersWithNames,
  deleteUser,
  saveRefreshToken,
  findUserByRefreshToken,
  revokeRefreshToken,
};
