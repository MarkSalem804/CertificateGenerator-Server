-- AlterTable
ALTER TABLE `eventparticipation` ADD COLUMN `emailCode` VARCHAR(6) NULL,
    ADD COLUMN `emailCodeExpires` DATETIME(3) NULL,
    MODIFY `joinedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);
