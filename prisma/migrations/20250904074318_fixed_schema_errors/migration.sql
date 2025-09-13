-- AlterTable
ALTER TABLE `templates` ADD COLUMN `eventId` INTEGER NULL,
    MODIFY `name` TEXT NULL,
    MODIFY `fileName` TEXT NULL,
    MODIFY `filePath` TEXT NULL,
    MODIFY `fileSize` INTEGER NULL;
