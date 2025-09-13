-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `attendanceTableId` INTEGER NULL,
    MODIFY `dayNumber` INTEGER NULL,
    MODIFY `dayName` TEXT NULL;
