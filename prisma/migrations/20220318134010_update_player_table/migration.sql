/*
  Warnings:

  - You are about to alter the column `current_act` on the `Player` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Int`.
  - You are about to alter the column `current_node` on the `Player` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Int`.
  - You are about to alter the column `exprience` on the `Player` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Int`.
  - You are about to alter the column `fief` on the `Player` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Player` MODIFY `current_act` INTEGER NOT NULL,
    MODIFY `current_node` INTEGER NOT NULL,
    MODIFY `experience` INTEGER NOT NULL DEFAULT 0,
    MODIFY `fief` INTEGER NOT NULL DEFAULT 0,
    MODIFY `coins` INTEGER NOT NULL DEFAULT 0;
