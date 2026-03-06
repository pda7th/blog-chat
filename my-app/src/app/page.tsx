'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogoIcon } from '../../public/icon';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // 컴포넌트가 마운트되자마자 바로 /home으로 이동
    router.replace('/home');
  }, [router]);


  return (
    <main className="relative flex h-full w-full flex-col items-center pt-72">
      <LogoIcon />
    </main>
  );
}
