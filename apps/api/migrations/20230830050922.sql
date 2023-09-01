-- Create "supernova_tasks" table
CREATE TABLE `supernova_tasks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `done` bool NOT NULL,
  `expected_duration` bigint unsigned NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` datetime(3) NULL,
  `updated_at` datetime(3) NULL,
  `deleted_at` datetime(3) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_users_tasks` (`user_id`),
  CONSTRAINT `fk_users_tasks` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
