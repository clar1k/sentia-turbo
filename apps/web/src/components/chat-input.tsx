import * as React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  input: string;
  activeChat: string;
  isTyping: boolean;
  isPending: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function ChatInput({
  input,
  activeChat,
  isTyping,
  isPending,
  inputRef,
  onInputChange,
  onSendMessage,
  onKeyPress,
}: ChatInputProps) {
  const isDisabled = !activeChat || isTyping || isPending;
  const testRef = React.useRef(null);

  return (
    <div className="w-full border-t border-border bg-background p-4">
      <div className="mx-auto flex w-full max-w-4xl items-center gap-2 justify-center">
        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyUp={onKeyPress}
          placeholder={
            activeChat
              ? "Type your message..."
              : "Create a new chat to start messaging"
          }
          className="flex-1 resize-none rounded-xl border-border max-h-32 overflow-auto"
          disabled={isDisabled}
          rows={1}
        />
        <Button
          onClick={onSendMessage}
          disabled={!input.trim() || isDisabled}
          size="icon"
          variant="default"
          className="bg-blue-600 hover:bg-blue-700 border-blue-700"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send Message</span>
        </Button>
      </div>
    </div>
  );
}