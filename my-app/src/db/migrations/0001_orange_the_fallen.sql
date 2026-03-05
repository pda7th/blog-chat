ALTER TABLE `comment` ADD `reply_to_comment_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `comment` ADD CONSTRAINT `comment_reply_to_comment_id_comment_comment_id_fk` FOREIGN KEY (`reply_to_comment_id`) REFERENCES `comment`(`comment_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_comment_reply_to_comment_id` ON `comment` (`reply_to_comment_id`);