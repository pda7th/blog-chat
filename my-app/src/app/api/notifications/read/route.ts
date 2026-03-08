import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { markNotificationsAsRead } from '@/features/notifications/notification.service';

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ success: false, error: { message: '로그인이 필요합니다.' } }, { status: 401 });
  }

  const { ids } = await req.json();
  if (!Array.isArray(ids)) {
    return NextResponse.json({ success: false, error: { message: 'ids 배열이 필요합니다.' } }, { status: 400 });
  }

  await markNotificationsAsRead(session.user.id, ids);
  return NextResponse.json({ success: true });
}
