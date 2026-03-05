interface CursorPayload {
  createdAt: string; // ISO string
  commentId: number;
}

export function encodeCursor(createdAt: Date, commentId: number): string {
  const payload: CursorPayload = { createdAt: createdAt.toISOString(), commentId };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

export function decodeCursor(cursor: string): { createdAt: Date; commentId: number } | null {
  try {
    const payload: CursorPayload = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
    return { createdAt: new Date(payload.createdAt), commentId: payload.commentId };
  } catch {
    return null;
  }
}
