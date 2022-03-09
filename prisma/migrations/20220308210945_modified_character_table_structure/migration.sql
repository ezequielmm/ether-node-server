/*
  Warnings:

  - You are about to drop the column `class_id` on the `characters` table. All the data in the column will be lost.
  - Added the required column `visibility` to the `cardpools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class` to the `characters` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `characters` DROP FOREIGN KEY `characters_class_id_fkey`;

-- AlterTable
ALTER TABLE `cardpools` ADD COLUMN `visibility` ENUM('visible', 'hidden') NOT NULL;

-- AlterTable
ALTER TABLE `characters` DROP COLUMN `class_id`,
    ADD COLUMN `class` ENUM('knight', 'rogue') NOT NULL;
