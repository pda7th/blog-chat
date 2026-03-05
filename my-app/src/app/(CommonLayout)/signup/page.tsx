import SignUpForm from "@/components/auth/SignUpForm";

export default function SignupPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
                <h1 className="mb-8 text-center text-3xl font-extrabold text-gray-900 text-black">회원가입</h1>

                <SignUpForm />

                <p className="mt-6 text-center text-sm text-gray-500">
                    이미 계정이 있으신가요?{' '}
                    <a href="/login" className="font-bold text-green-600 hover:underline">
                        로그인하기
                    </a>
                </p>
            </div>
        </main>
    );
}
