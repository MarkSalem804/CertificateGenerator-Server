/*
  Warnings:

  - You are about to drop the column `certificateTemplate` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `templates` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `templates` DROP FOREIGN KEY `templates_eventId_fkey`;

-- DropIndex
DROP INDEX `templates_eventId_fkey` ON `templates`;

-- AlterTable
ALTER TABLE `event` DROP COLUMN `certificateTemplate`,
    ADD COLUMN `templateId` INTEGER NULL;

-- AlterTable
ALTER TABLE `templates` DROP COLUMN `eventId`;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `templates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
