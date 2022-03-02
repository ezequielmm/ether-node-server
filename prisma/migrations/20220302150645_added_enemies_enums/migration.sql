/*
  Warnings:

  - You are about to alter the column `type` on the `enemies` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `Enum("enemies_type")`.
  - You are about to alter the column `category` on the `enemies` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `Enum("enemies_category")`.

*/
-- AlterTable
ALTER TABLE `enemies` MODIFY `type` ENUM('basic', 'elite', 'boss') NULL,
    MODIFY `category` ENUM('beast', 'fey', 'undead', 'clockwork', 'eldritch') NOT NULL;
