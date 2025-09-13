-- DropForeignKey
ALTER TABLE `unit` DROP FOREIGN KEY `unit_designationId_fkey`;

-- DropIndex
DROP INDEX `unit_designationId_fkey` ON `unit`;

-- AlterTable
ALTER TABLE `unit` MODIFY `designationId` INTEGER NULL,
    MODIFY `designationName` TEXT NULL;

-- AddForeignKey
ALTER TABLE `unit` ADD CONSTRAINT `unit_designationId_fkey` FOREIGN KEY (`designationId`) REFERENCES `designation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
