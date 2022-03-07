/*
  Warnings:

  - You are about to alter the column `name` on the `characters` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(250)`.
  - Added the required column `cardpool_id` to the `characters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `characters` ADD COLUMN `cardpool_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `initial_gold` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `initial_health` INTEGER NOT NULL DEFAULT 0,
    MODIFY `name` VARCHAR(250) NOT NULL;

-- CreateTable
CREATE TABLE `cardpools` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(250) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `cardpools_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `characters` ADD CONSTRAINT `characters_cardpool_id_fkey` FOREIGN KEY (`cardpool_id`) REFERENCES `cardpools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
