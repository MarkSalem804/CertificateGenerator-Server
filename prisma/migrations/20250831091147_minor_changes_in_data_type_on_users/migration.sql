-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_schoolId_fkey`;

-- DropIndex
DROP INDEX `user_schoolId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `user` MODIFY `position` TEXT NULL,
    MODIFY `schoolId` INTEGER NULL,
    MODIFY `schoolName` TEXT NULL;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
