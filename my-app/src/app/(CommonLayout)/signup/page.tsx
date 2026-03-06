import SignUpForm from "@/components/auth/SignUpForm";

export default function SignupPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-100">
                <div className="h-1.5 w-full bg-gradient-to-r from-[#00C471] to-emerald-400" />

                <div className="p-8">
                    <div className="mb-6 flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black tracking-tight text-[#00C471]">싹심기</span>
                            <span>🌱</span>
                        </div>
                        <p className="text-xs text-gray-400">프로디지털아카데미 학습 커뮤니티</p>
                    </div>

                    <h1 className="mb-6 text-center text-xl font-bold text-gray-800">회원가입</h1>

                    <SignUpForm />

                    <p className="mt-6 text-center text-sm text-gray-400">
                        이미 계정이 있으신가요?{' '}
                        <a href="/login" className="font-bold text-[#00C471] hover:underline">
                            로그인하기
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}
