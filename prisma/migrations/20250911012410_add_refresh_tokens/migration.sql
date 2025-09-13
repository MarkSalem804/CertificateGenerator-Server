-- AlterTable
ALTER TABLE `user` ADD COLUMN `refreshToken` TEXT NULL,
    ADD COLUMN `refreshTokenExpiry` DATETIME(3) NULL;
