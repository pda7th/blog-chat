import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUnreadNotifications } from '@/features/notifications/notification.service';

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ success: false, error: { message: '로그인이 필요합니다.' } }, { status: 401 });
  }

  const data = await getUnreadNotifications(session.user.id);
  return NextResponse.json({ success: true, data });
}
