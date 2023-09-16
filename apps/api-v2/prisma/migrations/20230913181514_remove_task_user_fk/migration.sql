-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_userId_fkey`;

-- RenameIndex
ALTER TABLE `Task` RENAME INDEX `Task_userId_fkey` TO `owner_id_idx`;
