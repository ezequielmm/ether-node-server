/*
  Warnings:

  - You are about to drop the column `deckId` on the `cards` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `cards` DROP FOREIGN KEY `cards_deckId_fkey`;

-- AlterTable
ALTER TABLE `cards` DROP COLUMN `deckId`,
    MODIFY `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);
