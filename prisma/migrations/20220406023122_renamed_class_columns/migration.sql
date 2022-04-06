/*
  Warnings:

  - You are about to drop the column `class` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `class` on the `characters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cards` DROP COLUMN `class`,
    ADD COLUMN `card_class` ENUM('knight') NULL;

-- AlterTable
ALTER TABLE `characters` DROP COLUMN `class`,
    ADD COLUMN `character_class` ENUM('knight', 'rogue') NOT NULL DEFAULT 'knight';
