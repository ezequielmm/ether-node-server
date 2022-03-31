/*
  Warnings:

  - You are about to drop the `Trinket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Trinket`;

-- CreateTable
CREATE TABLE `Player` (
    `id` VARCHAR(191) NOT NULL,
    `royal_house` VARCHAR(50) NOT NULL,
    `class` ENUM('knight', 'rogue') NOT NULL,
    `current_act` VARCHAR(50) NOT NULL,
    `current_node` VARCHAR(50) NOT NULL,
    `exprience` VARCHAR(50) NOT NULL,
    `fief` VARCHAR(50) NOT NULL,
    `coins` INTEGER NOT NULL,
    `status` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `Player_royal_house_key`(`royal_house`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
