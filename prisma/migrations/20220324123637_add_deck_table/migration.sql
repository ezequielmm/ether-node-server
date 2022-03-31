-- AlterTable
ALTER TABLE `cards` ADD COLUMN `deckId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Deck` (
    `id` VARCHAR(191) NOT NULL,
    `character_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cards` ADD CONSTRAINT `cards_deckId_fkey` FOREIGN KEY (`deckId`) REFERENCES `decks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
