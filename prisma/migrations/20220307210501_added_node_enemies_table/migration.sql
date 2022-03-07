-- CreateTable
CREATE TABLE `node_enemies` (
    `id` VARCHAR(191) NOT NULL,
    `node_id` VARCHAR(191) NOT NULL,
    `enemy_id` VARCHAR(191) NOT NULL,
    `quantity` SMALLINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `node_enemies` ADD CONSTRAINT `node_enemies_enemy_id_fkey` FOREIGN KEY (`enemy_id`) REFERENCES `enemies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `node_enemies` ADD CONSTRAINT `node_enemies_node_id_fkey` FOREIGN KEY (`node_id`) REFERENCES `nodes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
