import * as React from "react";
import { Bot } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatHeader } from "@/components/chat-header";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInput } from "@/components/chat-input";
import { useChatInterface } from "@/hooks/use-chat-interface";

export function ChatInterface() {
  const {
    chats,
    activeChat,
    input,
    isTyping,
    isLoading,
    currentChat,
    messagesEndRef,
    isPending,
    setActiveChat,
    setInput,
    createNewChat,
    deleteChat,
    sendMessage,
    handleKeyPress,
  } = useChatInterface();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 animate-spin text-gray-600" />
          <span className="text-gray-700">Loading chats...</span>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onChatSelect={setActiveChat}
        onCreateNewChat={createNewChat}
        onDeleteChat={deleteChat}
      />

      <SidebarInset className="relative flex h-screen flex-col overflow-auto bg-white">
        <ChatHeader currentChatTitle={currentChat?.title} />

        <ChatMessages
          currentChat={currentChat}
          isTyping={isTyping}
          isPending={isPending}
          messagesEndRef={messagesEndRef}
          onCreateNewChat={createNewChat}
        />

        <ChatInput
          input={input}
          activeChat={activeChat}
          isTyping={isTyping}
          isPending={isPending}
          onInputChange={setInput}
          onSendMessage={sendMessage}
          onKeyPress={handleKeyPress}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
