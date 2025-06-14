import * as React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  input: string;
  activeChat: string;
  isTyping: boolean;
  isPending: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export function ChatInput({
  input,
  activeChat,
  isTyping,
  isPending,
  onInputChange,
  onSendMessage,
  onKeyPress,
}: ChatInputProps) {
  return (
    <div className="fixed bottom-0 w-full border-t border-gray-200 bg-white p-4">
      <div className="mx-auto flex max-w-3xl gap-2">
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyUp={onKeyPress}
          placeholder={
            activeChat
              ? "Type your message here..."
              : "Create a new chat to start messaging"
          }
          className="flex-1 rounded-xl border-gray-200 bg-white text-gray-900 placeholder:text-gray-500"
          disabled={!activeChat || isTyping || isPending}
        />
        <Button
          onClick={onSendMessage}
          disabled={!input.trim() || !activeChat || isTyping || isPending}
          size="icon"
          variant="outline"
          className="border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
