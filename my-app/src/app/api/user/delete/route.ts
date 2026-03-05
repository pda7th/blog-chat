import { auth } from '@/lib/auth';
import { db } from '@/db';
import { user as userTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || !session.user) {
            return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
        }

        const userId = session.user.id;

        // DB에서 사용자 삭제 (Drizzle + MySQL)
        // BetterAuth의 drizzleAdapter를 사용하고 있으므로 직접 Drizzle로 삭제 처리
        await db.delete(userTable).where(eq(userTable.id, userId));

        return NextResponse.json({ message: '회원 탈퇴가 완료되었습니다.' });
    } catch (error: any) {
        console.error('회원 탈퇴 처리 중 오류:', error);
        return NextResponse.json({ error: '회원 탈퇴 처리 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
