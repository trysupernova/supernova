/*
  Warnings:

  - Added the required column `originalBuildText` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Task` ADD COLUMN `originalBuildText` VARCHAR(191) NOT NULL;
