import LogInForm from "@/components/auth/LogInForm";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-100">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00C471] to-emerald-400" />

        <div className="p-8">
          <div className="mb-8 flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-[#00C471]">싹심기</span>
              <span>🌱</span>
            </div>
            <p className="text-xs text-gray-400">프로디지털아카데미 학습 커뮤니티</p>
          </div>

          <h1 className="mb-6 text-center text-xl font-bold text-gray-800">로그인</h1>

          <LogInForm />

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400">또는 소셜 계정으로 로그인</span>
              </div>
            </div>

            <div className="mt-5">
              <SocialLoginButtons />
            </div>

            <p className="mt-7 text-center text-sm text-gray-400">
              아직 계정이 없으신가요?{' '}
              <a href="/signup" className="font-bold text-[#00C471] hover:underline">
                회원가입하기
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
