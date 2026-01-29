-- AlterTable
ALTER TABLE `event` ADD COLUMN `amInEndTime` VARCHAR(10) NULL,
    ADD COLUMN `amInStartTime` VARCHAR(10) NULL,
    ADD COLUMN `amOutEndTime` VARCHAR(10) NULL,
    ADD COLUMN `amOutStartTime` VARCHAR(10) NULL,
    ADD COLUMN `attendanceTimeOption` VARCHAR(50) NOT NULL DEFAULT 'government',
    MODIFY `pmInStartTime` VARCHAR(10) NULL,
    MODIFY `pmInEndTime` VARCHAR(10) NULL,
    MODIFY `pmOutStartTime` VARCHAR(10) NULL,
    MODIFY `pmOutEndTime` VARCHAR(10) NULL;
