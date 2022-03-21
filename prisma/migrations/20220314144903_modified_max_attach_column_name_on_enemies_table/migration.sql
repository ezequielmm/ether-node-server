/*
  Warnings:

  - You are about to drop the column `max_attach` on the `enemies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `enemies` DROP COLUMN `max_attach`,
    ADD COLUMN `max_attack` INTEGER NOT NULL DEFAULT 0;
