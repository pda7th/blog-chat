import { mysqlEnum, timestamp } from 'drizzle-orm/mysql-core';

export const statusEnum = mysqlEnum('status', ['ACTIVE', 'INACTIVE', 'DELETED']);

export const auditColumns = {
  status: statusEnum.notNull().default('ACTIVE'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow().onUpdateNow(),
};
