import LogInForm from "@/components/auth/LogInForm";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <h1 className="mb-8 text-center text-3xl font-extrabold text-gray-900 text-black">로그인</h1>

        <LogInForm />

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">또는 소셜 계정으로 로그인</span>
            </div>
          </div>

          <div className="mt-6">
            <SocialLoginButtons />
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            아직 계정이 없으신가요?{' '}
            <a href="/signup" className="font-bold text-green-500 hover:underline">
              회원가입하기
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
