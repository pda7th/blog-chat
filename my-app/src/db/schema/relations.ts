import { relations } from 'drizzle-orm';
import { user, session, account } from './auth';
import { post, postLikes, comment } from './blog';
import { room, chat, roomParticipant } from './chat';

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  posts: many(post),
  postLikes: many(postLikes),
  comments: many(comment),
  chats: many(chat),
  roomParticipants: many(roomParticipant),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const postRelations = relations(post, ({ one, many }) => ({
  author: one(user, { fields: [post.userId], references: [user.id] }),
  likes: many(postLikes),
  comments: many(comment),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  user: one(user, { fields: [postLikes.userId], references: [user.id] }),
  post: one(post, { fields: [postLikes.postId], references: [post.postId] }),
}));

export const commentRelations = relations(comment, ({ one, many }) => ({
  author: one(user, { fields: [comment.userId], references: [user.id] }),
  post: one(post, { fields: [comment.postId], references: [post.postId] }),
  parent: one(comment, { fields: [comment.parentId], references: [comment.commentId] }),
  children: many(comment),
}));

export const roomRelations = relations(room, ({ many }) => ({
  chats: many(chat),
  participants: many(roomParticipant),
}));

export const chatRelations = relations(chat, ({ one }) => ({
  room: one(room, { fields: [chat.roomId], references: [room.roomId] }),
  user: one(user, { fields: [chat.userId], references: [user.id] }),
}));

export const roomParticipantRelations = relations(roomParticipant, ({ one }) => ({
  room: one(room, { fields: [roomParticipant.roomId], references: [room.roomId] }),
  user: one(user, { fields: [roomParticipant.userId], references: [user.id] }),
}));
