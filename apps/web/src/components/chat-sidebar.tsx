import * as React from "react";
import { Bot, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChatTabItem } from "@/components/chat-tab-item";
import { CustomButton } from "@/components/shared/button";

interface Chat {
  id: string;
  title: string;
  messages: any[];
  lastMessage: Date;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string;
  onChatSelect: (chatId: string) => void;
  onCreateNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatSidebar({
  chats,
  activeChat,
  onChatSelect,
  onCreateNewChat,
  onDeleteChat,
}: ChatSidebarProps) {
  return (
    <Sidebar className="border-r duration-200 ease-in-out">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Bot className="h-6 w-6" />
          <span className="font-semibold">sentia</span>
        </div>
        <CustomButton
          onClick={onCreateNewChat}
          className="mx-2 cursor-pointer justify-start gap-2 rounded-xl duration-300 hover:bg-gray-100"
        >
          <Plus className="h-4 w-4" />
          Create New Chat
        </CustomButton>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.length === 0 ? (
                <div className="text-muted-foreground px-2 py-4 text-center text-sm">
                  No chats yet. Start a new conversation!
                </div>
              ) : (
                chats.map((chat) => (
                  <ChatTabItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChat === chat.id}
                    onChatSelect={onChatSelect}
                    onDeleteChat={onDeleteChat}
                  />
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
