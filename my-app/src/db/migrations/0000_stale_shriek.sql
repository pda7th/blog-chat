CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp,
	`refresh_token_expires_at` timestamp,
	`scope` text,
	`password` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jwks` (
	`id` varchar(36) NOT NULL,
	`public_key` text NOT NULL,
	`private_key` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `jwks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`nickname` varchar(50),
	`user_profile_image_url` text,
	`level` varchar(30) NOT NULL DEFAULT 'BEGINNER',
	`status` enum('ACTIVE','INACTIVE','DELETED') NOT NULL DEFAULT 'ACTIVE',
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comment` (
	`comment_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`post_id` bigint unsigned NOT NULL,
	`parent_id` bigint unsigned,
	`content` varchar(1000) NOT NULL,
	`status` enum('ACTIVE','INACTIVE','DELETED') NOT NULL DEFAULT 'ACTIVE',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comment_comment_id` PRIMARY KEY(`comment_id`)
);
--> statement-breakpoint
CREATE TABLE `post` (
	`post_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`title` varchar(200) NOT NULL,
	`content` text NOT NULL,
	`category` varchar(50) NOT NULL,
	`image_1` text,
	`image_2` text,
	`image_3` text,
	`status` enum('ACTIVE','INACTIVE','DELETED') NOT NULL DEFAULT 'ACTIVE',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `post_post_id` PRIMARY KEY(`post_id`)
);
--> statement-breakpoint
CREATE TABLE `post_likes` (
	`post_like_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`post_id` bigint unsigned NOT NULL,
	`status` enum('ACTIVE','INACTIVE','DELETED') NOT NULL DEFAULT 'ACTIVE',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `post_likes_post_like_id` PRIMARY KEY(`post_like_id`),
	CONSTRAINT `uk_post_likes_user_post` UNIQUE(`user_id`,`post_id`)
);
--> statement-breakpoint
CREATE TABLE `chat` (
	`chat_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`room_id` bigint unsigned NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`content` text NOT NULL,
	`status` enum('ACTIVE','INACTIVE','DELETED') NOT NULL DEFAULT 'ACTIVE',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_chat_id` PRIMARY KEY(`chat_id`)
);
--> statement-breakpoint
CREATE TABLE `room` (
	`room_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`title` varchar(100) NOT NULL,
	`status` enum('ACTIVE','INACTIVE','DELETED') NOT NULL DEFAULT 'ACTIVE',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `room_room_id` PRIMARY KEY(`room_id`)
);
--> statement-breakpoint
CREATE TABLE `room_participant` (
	`room_participant_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`room_id` bigint unsigned NOT NULL,
	`status` enum('ACTIVE','INACTIVE','DELETED') NOT NULL DEFAULT 'ACTIVE',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `room_participant_room_participant_id` PRIMARY KEY(`room_participant_id`),
	CONSTRAINT `uk_room_participant_user_room` UNIQUE(`user_id`,`room_id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comment` ADD CONSTRAINT `comment_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comment` ADD CONSTRAINT `comment_post_id_post_post_id_fk` FOREIGN KEY (`post_id`) REFERENCES `post`(`post_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comment` ADD CONSTRAINT `comment_parent_id_comment_comment_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `comment`(`comment_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post` ADD CONSTRAINT `post_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_likes` ADD CONSTRAINT `post_likes_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_likes` ADD CONSTRAINT `post_likes_post_id_post_post_id_fk` FOREIGN KEY (`post_id`) REFERENCES `post`(`post_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat` ADD CONSTRAINT `chat_room_id_room_room_id_fk` FOREIGN KEY (`room_id`) REFERENCES `room`(`room_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat` ADD CONSTRAINT `chat_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `room_participant` ADD CONSTRAINT `room_participant_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `room_participant` ADD CONSTRAINT `room_participant_room_id_room_room_id_fk` FOREIGN KEY (`room_id`) REFERENCES `room`(`room_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_user_email` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `idx_comment_user_id` ON `comment` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_comment_post_id` ON `comment` (`post_id`);--> statement-breakpoint
CREATE INDEX `idx_comment_parent_id` ON `comment` (`parent_id`);--> statement-breakpoint
CREATE INDEX `idx_post_user_id` ON `post` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_post_category` ON `post` (`category`);--> statement-breakpoint
CREATE INDEX `idx_post_likes_user_id` ON `post_likes` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_post_likes_post_id` ON `post_likes` (`post_id`);--> statement-breakpoint
CREATE INDEX `idx_chat_room_id` ON `chat` (`room_id`);--> statement-breakpoint
CREATE INDEX `idx_chat_user_id` ON `chat` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_room_participant_user_id` ON `room_participant` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_room_participant_room_id` ON `room_participant` (`room_id`);