/*
  Warnings:

  - You are about to alter the column `rarity` on the `cards` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Enum("cards_rarity")`.
  - You are about to alter the column `type` on the `cards` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Enum("cards_type")`.
  - You are about to alter the column `keyword` on the `cards` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Enum("cards_keyword")`.
  - You are about to alter the column `status` on the `cards` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Enum("cards_status")`.
  - A unique constraint covering the columns `[code]` on the table `cards` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `cards` MODIFY `rarity` ENUM('common', 'uncommon', 'special', 'rare', 'basic') NOT NULL,
    MODIFY `type` ENUM('attack', 'skill', 'power', 'status', 'curse') NOT NULL,
    MODIFY `keyword` ENUM('exhaust', 'innate', 'ethereal', 'retain', 'unaplayable') NOT NULL,
    MODIFY `status` ENUM('active', 'inactive') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `cards_code_key` ON `cards`(`code`);
