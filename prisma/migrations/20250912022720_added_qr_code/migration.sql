-- AlterTable
ALTER TABLE `attendancetables` ADD COLUMN `qrCodeData` TEXT NULL,
    ADD COLUMN `qrCodeImage` TEXT NULL;

-- AlterTable
ALTER TABLE `mealattendancetables` ADD COLUMN `qrCodeData` TEXT NULL,
    ADD COLUMN `qrCodeImage` TEXT NULL;
