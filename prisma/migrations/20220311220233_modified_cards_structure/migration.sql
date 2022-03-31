/*
  Warnings:

  - You are about to drop the column `character_class_id` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `coin_cost` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `keyword` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `cards` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `cards` DROP FOREIGN KEY `cards_character_class_id_fkey`;

-- AlterTable
ALTER TABLE `cardpools` MODIFY `visibility` ENUM('visible', 'hidden') NOT NULL DEFAULT 'visible';

-- AlterTable
ALTER TABLE `cards` DROP COLUMN `character_class_id`,
    DROP COLUMN `coin_cost`,
    DROP COLUMN `cost`,
    DROP COLUMN `keyword`,
    DROP COLUMN `status`,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `cardpool_id` VARCHAR(191) NULL,
    ADD COLUMN `class` ENUM('knight') NULL,
    ADD COLUMN `coins_max` INTEGER NULL,
    ADD COLUMN `coins_min` INTEGER NULL,
    ADD COLUMN `energy` SMALLINT NULL,
    MODIFY `type` ENUM('attack', 'skill', 'power', 'status', 'curse') NOT NULL DEFAULT 'attack';

-- AddForeignKey
ALTER TABLE `cards` ADD CONSTRAINT `cards_cardpool_id_fkey` FOREIGN KEY (`cardpool_id`) REFERENCES `cardpools`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
