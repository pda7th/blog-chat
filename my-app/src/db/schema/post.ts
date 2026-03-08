import type { AnyMySqlColumn } from 'drizzle-orm/mysql-core';
import { bigint, boolean, index, mysqlTable, text, timestamp, unique, varchar } from 'drizzle-orm/mysql-core';
import { auditColumns } from './common';
import { user } from './auth';

export const post = mysqlTable(
  'post',
  {
    postId: bigint('post_id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
    userId: varchar('user_id', { length: 36 }) // 기존 bigint → varchar(36) (user.id 참조)
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 200 }).notNull(),
    content: text('content').notNull(),
    category: varchar('category', { length: 50 }).notNull(),
    image1: text('image_1'),
    image2: text('image_2'),
    image3: text('image_3'),
    ...auditColumns,
  },
  (t) => ({
    userIdx: index('idx_post_user_id').on(t.userId),
    categoryIdx: index('idx_post_category').on(t.category),
  }),
);

export const postLikes = mysqlTable(
  'post_likes',
  {
    postLikeId: bigint('post_like_id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    postId: bigint('post_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => post.postId, { onDelete: 'cascade' }),
    ...auditColumns,
  },
  (t) => ({
    ukUserPost: unique('uk_post_likes_user_post').on(t.userId, t.postId),
    userIdx: index('idx_post_likes_user_id').on(t.userId),
    postIdx: index('idx_post_likes_post_id').on(t.postId),
  }),
);

export const comment = mysqlTable(
  'comment',
  {
    commentId: bigint('comment_id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    postId: bigint('post_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => post.postId, { onDelete: 'cascade' }),
    parentId: bigint('parent_id', { mode: 'number', unsigned: true }).references(
      (): AnyMySqlColumn => comment.commentId,
    ),
    replyToCommentId: bigint('reply_to_comment_id', { mode: 'number', unsigned: true }).references(
      (): AnyMySqlColumn => comment.commentId,
    ),
    content: varchar('content', { length: 1000 }).notNull(),
    ...auditColumns,
  },
  (t) => ({
    userIdx: index('idx_comment_user_id').on(t.userId),
    postIdx: index('idx_comment_post_id').on(t.postId),
    parentIdx: index('idx_comment_parent_id').on(t.parentId),
    replyToIdx: index('idx_comment_reply_to_comment_id').on(t.replyToCommentId),
  }),
);

export const notification = mysqlTable(
  'notification',
  {
    notificationId: bigint('notification_id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    postId: bigint('post_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => post.postId, { onDelete: 'cascade' }),
    commentId: bigint('comment_id', { mode: 'number', unsigned: true })
      .notNull()
      .references((): AnyMySqlColumn => comment.commentId, { onDelete: 'cascade' }),
    postTitle: varchar('post_title', { length: 200 }).notNull(),
    commenterName: varchar('commenter_name', { length: 100 }).notNull(),
    commentPreview: varchar('comment_preview', { length: 100 }).notNull(),
    isRead: boolean('is_read').notNull().default(false),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('idx_notification_user_id').on(t.userId),
    isReadIdx: index('idx_notification_is_read').on(t.isRead),
  }),
);
