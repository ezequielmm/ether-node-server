/*
  Warnings:

  - A unique constraint covering the columns `[refresh_token]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refresh_token` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `profiles` ADD COLUMN `refresh_token` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `profiles_refresh_token_key` ON `profiles`(`refresh_token`);
