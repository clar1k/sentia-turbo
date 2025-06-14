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
    <div className="border-t p-4">
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
          className="flex-1 rounded-xl bg-white"
          disabled={!activeChat || isTyping || isPending}
        />
        <Button
          onClick={onSendMessage}
          disabled={!input.trim() || !activeChat || isTyping || isPending}
          size="icon"
          variant="outline"
          className="bg-white hover:bg-gray-100"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
