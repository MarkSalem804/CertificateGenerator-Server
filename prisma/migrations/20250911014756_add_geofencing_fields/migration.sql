-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `participantLatitude` TEXT NULL,
    ADD COLUMN `participantLongitude` TEXT NULL;

-- AlterTable
ALTER TABLE `event` ADD COLUMN `eventLatitude` TEXT NULL,
    ADD COLUMN `eventLongitude` TEXT NULL;
