'use client';

import { useState, useRef, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isProcessing: boolean;
}

export function ChatInput({ onSend, isProcessing }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isProcessing) return;
    onSend(trimmed);
    setInput('');
    textareaRef.current?.focus();
  }, [input, isProcessing, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="relative flex items-end gap-2">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe your DeFi intent... (e.g., 'Swap 1 ETH for USDC on Base with maximum privacy')"
        className="min-h-[52px] max-h-[200px] resize-none bg-gray-900/50 border-violet-900/30 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl pr-12"
        disabled={isProcessing}
        rows={1}
      />
      <Button
        onClick={handleSend}
        disabled={!input.trim() || isProcessing}
        size="icon"
        className="absolute right-2 bottom-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg h-8 w-8"
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
