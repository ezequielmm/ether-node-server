-- CreateTable
CREATE TABLE `character_classes` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `character_classes_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `characters` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(250) NOT NULL,
    `description` TEXT NULL,
    `class` ENUM('knight', 'rogue') NOT NULL,
    `initial_health` INTEGER NOT NULL DEFAULT 0,
    `initial_gold` INTEGER NOT NULL DEFAULT 0,
    `cardpool_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `characters_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cards` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(250) NOT NULL,
    `description` VARCHAR(250) NOT NULL,
    `class` ENUM('knight') NULL,
    `code` VARCHAR(255) NOT NULL,
    `rarity` ENUM('common', 'uncommon', 'special', 'rare', 'basic') NOT NULL,
    `energy` SMALLINT NULL,
    `type` ENUM('attack', 'skill', 'power', 'status', 'curse') NOT NULL DEFAULT 'attack',
    `coins_min` INTEGER NULL,
    `coins_max` INTEGER NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `cardpool_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deckId` VARCHAR(191) NULL,

    UNIQUE INDEX `cards_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enemies` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `type` ENUM('beast', 'fey', 'undead', 'clockwork', 'eldritch') NULL,
    `category` ENUM('basic', 'elite', 'boss') NOT NULL DEFAULT 'basic',
    `life` INTEGER NOT NULL DEFAULT 0,
    `min_attack` INTEGER NOT NULL DEFAULT 0,
    `max_attack` INTEGER NOT NULL DEFAULT 0,
    `act_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `enemies_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rooms` (
    `id` VARCHAR(191) NOT NULL,
    `player_id` VARCHAR(191) NOT NULL,
    `status` ENUM('in_progress', 'canceled', 'finished') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `refresh_token` TEXT NULL,

    UNIQUE INDEX `profiles_email_key`(`email`),
    UNIQUE INDEX `profiles_password_key`(`password`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nodes` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('combat', 'royal_house', 'encounter', 'merchant', 'treasure', 'camp') NOT NULL,

    UNIQUE INDEX `nodes_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `node_enemies` (
    `id` VARCHAR(191) NOT NULL,
    `node_id` VARCHAR(191) NOT NULL,
    `enemy_id` VARCHAR(191) NOT NULL,
    `quantity` SMALLINT NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cardpools` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(250) NOT NULL,
    `visibility` ENUM('visible', 'hidden') NOT NULL DEFAULT 'visible',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `cardpools_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trinkets` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(250) NOT NULL,
    `rarity` ENUM('common', 'uncommon', 'rare') NOT NULL,
    `coin_cost` INTEGER NOT NULL,
    `effect` VARCHAR(250) NOT NULL,
    `trigger` VARCHAR(250) NOT NULL,

    UNIQUE INDEX `trinkets_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `decks` (
    `id` VARCHAR(191) NOT NULL,
    `character_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `characters` ADD CONSTRAINT `characters_cardpool_id_fkey` FOREIGN KEY (`cardpool_id`) REFERENCES `cardpools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cards` ADD CONSTRAINT `cards_cardpool_id_fkey` FOREIGN KEY (`cardpool_id`) REFERENCES `cardpools`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cards` ADD CONSTRAINT `cards_deckId_fkey` FOREIGN KEY (`deckId`) REFERENCES `decks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `node_enemies` ADD CONSTRAINT `node_enemies_enemy_id_fkey` FOREIGN KEY (`enemy_id`) REFERENCES `enemies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `node_enemies` ADD CONSTRAINT `node_enemies_node_id_fkey` FOREIGN KEY (`node_id`) REFERENCES `nodes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
