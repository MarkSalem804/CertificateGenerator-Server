/*
  Warnings:

  - You are about to alter the column `cpdUnitsCount` on the `event` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `eventDates` TEXT NULL,
    MODIFY `cpdUnitsCount` DOUBLE NULL DEFAULT 0;
