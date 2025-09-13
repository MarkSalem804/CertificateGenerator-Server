/*
  Warnings:

  - You are about to drop the column `attendeeId` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `attendeeId` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the `attendee` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,eventId,dayNumber]` on the table `attendance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `certificate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `templateId` to the `certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `certificate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `attendance_attendeeId_fkey`;

-- DropForeignKey
ALTER TABLE `attendee` DROP FOREIGN KEY `attendee_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `attendee` DROP FOREIGN KEY `attendee_userId_fkey`;

-- DropForeignKey
ALTER TABLE `certificate` DROP FOREIGN KEY `certificate_attendeeId_fkey`;

-- DropIndex
DROP INDEX `attendance_attendeeId_eventId_dayNumber_key` ON `attendance`;

-- DropIndex
DROP INDEX `certificate_attendeeId_key` ON `certificate`;

-- AlterTable
ALTER TABLE `attendance` DROP COLUMN `attendeeId`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `certificate` DROP COLUMN `attendeeId`,
    ADD COLUMN `templateId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `attendee`;

-- CreateTable
CREATE TABLE `templates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,
    `fileName` TEXT NOT NULL,
    `filePath` TEXT NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `eventId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `templates_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `attendance_userId_eventId_dayNumber_key` ON `attendance`(`userId`, `eventId`, `dayNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `certificate_userId_key` ON `certificate`(`userId`);

-- AddForeignKey
ALTER TABLE `certificate` ADD CONSTRAINT `certificate_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `templates`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certificate` ADD CONSTRAINT `certificate_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `templates` ADD CONSTRAINT `templates_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
