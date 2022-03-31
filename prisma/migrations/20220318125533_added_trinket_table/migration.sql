-- CreateTable
CREATE TABLE `Trinket` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(250) NOT NULL,
    `rarity` ENUM('common', 'uncommon', 'rare') NOT NULL,
    `coin_cost` INTEGER NOT NULL,
    `effect` VARCHAR(250) NOT NULL,
    `trigger` VARCHAR(250) NOT NULL,

    UNIQUE INDEX `Trinket_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
