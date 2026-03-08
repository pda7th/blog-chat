CREATE TABLE `notification` (
	`notification_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`post_id` bigint unsigned NOT NULL,
	`comment_id` bigint unsigned NOT NULL,
	`post_title` varchar(200) NOT NULL,
	`commenter_name` varchar(100) NOT NULL,
	`comment_preview` varchar(100) NOT NULL,
	`is_read` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notification_notification_id` PRIMARY KEY(`notification_id`)
);
--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_post_id_post_post_id_fk` FOREIGN KEY (`post_id`) REFERENCES `post`(`post_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_comment_id_comment_comment_id_fk` FOREIGN KEY (`comment_id`) REFERENCES `comment`(`comment_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_notification_user_id` ON `notification` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_notification_is_read` ON `notification` (`is_read`);