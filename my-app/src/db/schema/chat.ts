import { bigint, index, mysqlTable, text, unique, varchar } from 'drizzle-orm/mysql-core';
import { auditColumns } from './common';
import { user } from './auth';

export const room = mysqlTable('room', {
  roomId: bigint('room_id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  ...auditColumns,
});

export const chat = mysqlTable(
  'chat',
  {
    chatId: bigint('chat_id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
    roomId: bigint('room_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => room.roomId, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    ...auditColumns,
  },
  (t) => ({
    roomIdx: index('idx_chat_room_id').on(t.roomId),
    userIdx: index('idx_chat_user_id').on(t.userId),
  }),
);

export const roomParticipant = mysqlTable(
  'room_participant',
  {
    roomParticipantId: bigint('room_participant_id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    roomId: bigint('room_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => room.roomId, { onDelete: 'cascade' }),
    ...auditColumns,
  },
  (t) => ({
    ukUserRoom: unique('uk_room_participant_user_room').on(t.userId, t.roomId),
    userIdx: index('idx_room_participant_user_id').on(t.userId),
    roomIdx: index('idx_room_participant_room_id').on(t.roomId),
  }),
);
