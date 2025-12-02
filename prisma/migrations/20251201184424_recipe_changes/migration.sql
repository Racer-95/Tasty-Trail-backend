/*
  Warnings:

  - Added the required column `category` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cusine` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `likes` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Recipe` ADD COLUMN `category` VARCHAR(191) NOT NULL,
    ADD COLUMN `cusine` VARCHAR(191) NOT NULL,
    ADD COLUMN `likes` INTEGER NOT NULL;
