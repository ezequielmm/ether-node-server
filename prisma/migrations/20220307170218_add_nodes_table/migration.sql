-- CreateTable
CREATE TABLE `nodes` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `type` ENUM('combat', 'royal_house', 'encounter', 'merchant', 'treasure', 'camp') NOT NULL,

    UNIQUE INDEX `nodes_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
