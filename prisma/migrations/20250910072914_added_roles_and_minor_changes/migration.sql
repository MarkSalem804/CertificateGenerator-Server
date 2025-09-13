/*
  Warnings:

  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `amInTime` DATETIME(3) NULL,
    ADD COLUMN `amOutTime` DATETIME(3) NULL,
    ADD COLUMN `duration` TEXT NULL,
    ADD COLUMN `notes` TEXT NULL,
    ADD COLUMN `pmInTime` DATETIME(3) NULL,
    ADD COLUMN `pmOutTime` DATETIME(3) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'Present';

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('administrator', 'participant', 'proponent', 'unit_section_head', 'supervisor', 'school_head') NOT NULL DEFAULT 'participant';

-- CreateTable
CREATE TABLE `mealAttendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `eventId` INTEGER NOT NULL,
    `dayNumber` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `breakfast` BOOLEAN NOT NULL DEFAULT false,
    `amSnack` BOOLEAN NOT NULL DEFAULT false,
    `lunch` BOOLEAN NOT NULL DEFAULT false,
    `pmSnack` BOOLEAN NOT NULL DEFAULT false,
    `dinner` BOOLEAN NOT NULL DEFAULT false,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `mealAttendance_id_key`(`id`),
    UNIQUE INDEX `mealAttendance_userId_eventId_dayNumber_key`(`userId`, `eventId`, `dayNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mealAttendance` ADD CONSTRAINT `mealAttendance_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mealAttendance` ADD CONSTRAINT `mealAttendance_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
