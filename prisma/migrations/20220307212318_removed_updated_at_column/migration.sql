/*
  Warnings:

  - You are about to drop the column `updated_at` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `character_classes` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `characters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cards` DROP COLUMN `updated_at`;

-- AlterTable
ALTER TABLE `character_classes` DROP COLUMN `updated_at`;

-- AlterTable
ALTER TABLE `characters` DROP COLUMN `updated_at`;

-- AlterTable
ALTER TABLE `enemies` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `node_enemies` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `nodes` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `rooms` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
