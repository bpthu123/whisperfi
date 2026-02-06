'use client';

import { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { IntentSuggestions } from './IntentSuggestions';
import { useIntentEngine } from '@/hooks/useIntentEngine';
import { Shield, Sparkles } from 'lucide-react';

export function ChatInterface() {
  const { messages, isProcessing, streamingStage, sendMessage, clearMessages } = useIntentEngine();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-violet-500/10 flex items-center justify-center">
                <Shield className="w-10 h-10 text-violet-400" />
              </div>
              <Sparkles className="w-5 h-5 text-purple-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to WhisperFi
              </h2>
              <p className="text-gray-400 max-w-md">
                Describe your DeFi intent in plain English. I&apos;ll analyze privacy
                risks and generate an optimized execution plan.
              </p>
            </div>
            <IntentSuggestions onSelect={sendMessage} />
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isProcessing && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-violet-400" />
            </div>
            <div className="bg-gray-900/50 border border-violet-900/30 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-gray-400">
                  {streamingStage || 'Analyzing intent & privacy risks...'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-violet-900/30 bg-black/30 backdrop-blur-xl p-4">
        {messages.length > 0 && (
          <div className="mb-3">
            <IntentSuggestions onSelect={sendMessage} compact />
          </div>
        )}
        <ChatInput onSend={sendMessage} isProcessing={isProcessing} />
      </div>
    </div>
  );
}
