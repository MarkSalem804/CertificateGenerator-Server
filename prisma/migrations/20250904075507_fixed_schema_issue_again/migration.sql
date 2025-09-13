/*
  Warnings:

  - Made the column `name` on table `templates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fileName` on table `templates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `filePath` on table `templates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fileSize` on table `templates` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `templates` MODIFY `name` TEXT NOT NULL,
    MODIFY `fileName` TEXT NOT NULL,
    MODIFY `filePath` TEXT NOT NULL,
    MODIFY `fileSize` INTEGER NOT NULL;
