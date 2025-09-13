/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `designation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `school` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `unit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `designation_id_key` ON `designation`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `school_id_key` ON `school`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `unit_id_key` ON `unit`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `user_id_key` ON `user`(`id`);
