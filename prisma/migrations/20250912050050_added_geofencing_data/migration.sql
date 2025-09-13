-- AlterTable
ALTER TABLE `event` ADD COLUMN `geofencingRadius` INTEGER NOT NULL DEFAULT 50;

-- AlterTable
ALTER TABLE `mealattendance` ADD COLUMN `mealAttendanceTableId` INTEGER NULL;
