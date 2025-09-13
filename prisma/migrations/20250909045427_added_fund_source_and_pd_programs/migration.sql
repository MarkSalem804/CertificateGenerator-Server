-- AlterTable
ALTER TABLE `event` ADD COLUMN `fundSourceId` INTEGER NULL,
    ADD COLUMN `pdProgramId` INTEGER NULL;

-- CreateTable
CREATE TABLE `fundSource` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,

    UNIQUE INDEX `fundSource_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pdPrograms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,

    UNIQUE INDEX `pdPrograms_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_fundSourceId_fkey` FOREIGN KEY (`fundSourceId`) REFERENCES `fundSource`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_pdProgramId_fkey` FOREIGN KEY (`pdProgramId`) REFERENCES `pdPrograms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
