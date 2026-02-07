import { Header } from '@/components/layout/Header';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <ChatInterface />
    </main>
  );
}
