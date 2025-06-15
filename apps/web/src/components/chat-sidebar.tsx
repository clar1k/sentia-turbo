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
import { CustomButton } from "@/components/shared/custom-button";
import { useNavigate } from "@tanstack/react-router";

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
  const navigate = useNavigate();
  return (
    <Sidebar className="border-r border-gray-200 bg-white duration-200 ease-in-out">
      <SidebarHeader className="bg-white">
        <div className="flex items-center gap-2 px-2 py-2 cursor-pointer" onClick={() => navigate({ to: "/" })}>
          <Bot className="h-6 w-6 text-blue-500" />
          <span className="font-semibold text-gray-900">Sentia Supreme</span>
        </div>
        <CustomButton
          onClick={onCreateNewChat}
          className="mx-2 cursor-pointer justify-start gap-2 rounded-xl border border-gray-200 bg-white duration-300 hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 text-gray-600" />
          <span className="text-gray-700">Create New Chat</span>
        </CustomButton>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600">
            Recent Chats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.length === 0 ? (
                <div className="px-2 py-4 text-center text-sm text-gray-500">
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

      <SidebarFooter className="border-t border-gray-200 bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
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
