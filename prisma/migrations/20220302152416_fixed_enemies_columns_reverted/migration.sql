/*
  Warnings:

  - The values [basic,elite,boss] on the enum `enemies_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `category` on the `enemies` table. The data in that column could be lost. The data in that column will be cast from `Enum("enemies_category")` to `Enum("enemies_category")`.

*/
-- AlterTable
ALTER TABLE `enemies` MODIFY `type` ENUM('beast', 'fey', 'undead', 'clockwork', 'eldritch') NULL,
    MODIFY `category` ENUM('basic', 'elite', 'boss') NOT NULL DEFAULT 'basic';
