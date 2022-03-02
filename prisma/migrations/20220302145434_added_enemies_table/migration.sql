/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `cards` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `enemies` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `type` VARCHAR(200) NULL,
    `category` VARCHAR(200) NOT NULL,
    `life` INTEGER NOT NULL DEFAULT 0,
    `min_attack` INTEGER NOT NULL DEFAULT 0,
    `max_attach` INTEGER NOT NULL DEFAULT 0,
    `act_id` INTEGER NULL,

    UNIQUE INDEX `enemies_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `cards_name_key` ON `cards`(`name`);
