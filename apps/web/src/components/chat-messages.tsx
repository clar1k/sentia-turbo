import * as React from "react";
import { Bot, User, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InlineRouter } from "./inline-components/inlineRouter";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastMessage: Date;
}

interface ChatMessagesProps {
  currentChat: Chat | undefined;
  isTyping: boolean;
  isPending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onCreateNewChat: () => void;
}

export function ChatMessages({
  currentChat,
  isTyping,
  isPending,
  messagesEndRef,
  onCreateNewChat,
}: ChatMessagesProps) {
  return (
    <ScrollArea className="mb-[150px] flex-1 bg-white p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        {!currentChat ? (
          <div className="flex h-full flex-col items-center justify-center py-12 text-center">
            <Bot className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Welcome to Sentia AI Agent
            </h3>
            <p className="mb-4 text-gray-600">
              Start a new conversation or select an existing chat from the
              sidebar.
            </p>
            <Button
              onClick={onCreateNewChat}
              className="mx-2 cursor-pointer justify-start gap-2 rounded-xl border border-gray-200 bg-white text-gray-700 duration-300 hover:bg-gray-50"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              Start New Chat
            </Button>
          </div>
        ) : (
          <>
            {currentChat.messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bot className="mb-3 h-8 w-8 text-gray-400" />
                <p className="text-gray-600">
                  Start the conversation by typing a message below.
                </p>
              </div>
            )}

            {currentChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 shrink-0 bg-gray-100">
                    <AvatarFallback className="bg-gray-100">
                      <Bot className="h-4 w-4 text-gray-600" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "ml-12 bg-blue-500 text-white"
                      : "bg-gray-50 text-gray-900"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    <InlineRouter message={message.content} />
                  </div>
                  <div
                    className={`mt-1 text-xs opacity-70 ${
                      message.role === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8 shrink-0 bg-blue-100">
                    <AvatarFallback className="bg-blue-100">
                      <User className="h-4 w-4 text-blue-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {(isTyping || isPending) && (
              <div className="flex justify-start gap-3">
                <Avatar className="h-8 w-8 shrink-0 bg-gray-100">
                  <AvatarFallback className="bg-gray-100">
                    <Bot className="h-4 w-4 text-gray-600" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg bg-gray-50 px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </ScrollArea>
  );
}
