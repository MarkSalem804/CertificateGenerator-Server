const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function fixSpecificRecord() {
  try {
    console.log("🔍 Looking for attendance records that need fixing...");

    // Find all attendance records with AM IN times
    const records = await prisma.attendance.findMany({
      where: {
        amInTime: {
          not: null,
        },
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startTime: true,
            date: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    console.log(
      `📊 Found ${records.length} attendance records with AM IN times`
    );

    let fixedCount = 0;

    for (const record of records) {
      // Parse event start time
      let eventStartMinutes = null;
      if (record.event.startTime) {
        const timeParts = record.event.startTime.split(":");
        if (timeParts.length >= 2) {
          const hour = parseInt(timeParts[0]);
          const minute = parseInt(timeParts[1]);
          eventStartMinutes = hour * 60 + minute;
        }
      }

      // Check if this record needs fixing
      if (eventStartMinutes && eventStartMinutes >= 13 * 60) {
        // Event starts at 1:00 PM or later
        const amInTime = new Date(record.amInTime);
        const amInHour = amInTime.getHours();
        const amInMinute = amInTime.getMinutes();
        const amInTimeInMinutes = amInHour * 60 + amInMinute;

        // If AM IN time is in the afternoon (1:00 PM or later), it should be PM IN
        if (amInTimeInMinutes >= 13 * 60) {
          console.log(`🔧 Fixing record ${record.id}:`);
          console.log(
            `   Event: ${record.event.name} (starts at ${record.event.startTime})`
          );
          console.log(
            `   User: ${record.user.fullName} (${record.user.email})`
          );
          console.log(
            `   AM IN time: ${amInTime.toLocaleTimeString()} -> Moving to PM IN`
          );

          // Update the record
          await prisma.attendance.update({
            where: { id: record.id },
            data: {
              amInTime: null, // Clear AM IN
              pmInTime: record.amInTime, // Set PM IN
            },
          });

          console.log(`   ✅ Fixed!`);
          fixedCount++;
        }
      }
    }

    console.log(`\n🎉 Fixed ${fixedCount} attendance records!`);
  } catch (error) {
    console.error("❌ Error fixing attendance records:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixSpecificRecord();
