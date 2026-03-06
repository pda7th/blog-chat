import { auth } from '@/lib/auth';

type Subscriber = {
  controller: ReadableStreamDefaultController;
  userId: string;
};

const subscribers = new Set<Subscriber>();

export function broadcast(data: object) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  subscribers.forEach((sub) => {
    try {
      sub.controller.enqueue(new TextEncoder().encode(payload));
    } catch {
      subscribers.delete(sub);
    }
  });
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: new Headers(request.headers) });
  if (!session) return new Response('Unauthorized', { status: 401 });

  const subscriber: Subscriber = {
    controller: null!,
    userId: session.user.id,
  };

  const stream = new ReadableStream({
    start(controller) {
      subscriber.controller = controller;
      subscribers.add(subscriber);

      // 연결 유지용 주기적 ping
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(': ping\n\n'));
        } catch {
          clearInterval(keepAlive);
        }
      }, 30000);

      request.signal.addEventListener('abort', () => {
        clearInterval(keepAlive);
        subscribers.delete(subscriber);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
