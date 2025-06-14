import * as React from "react";
import { MessageSquare, MoreHorizontal, Edit3, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface Chat {
  id: string;
  title: string;
  messages: any[];
  lastMessage: Date;
}

interface ChatTabItemProps {
  chat: Chat;
  isActive: boolean;
  onChatSelect: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat?: (chatId: string) => void;
}

export function ChatTabItem({
  chat,
  isActive,
  onChatSelect,
  onDeleteChat,
  onRenameChat,
}: ChatTabItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={cn(
          "group rounded-xl px-2 transition-all duration-300 ease-in-out hover:bg-gray-400/25",
          isActive && "bg-gray-400/25",
        )}
      >
        <button
          onClick={() => onChatSelect(chat.id)}
          className="flex w-full items-center gap-2 text-left"
        >
          <MessageSquare className="h-4 w-4 shrink-0" />
          <span className="truncate">{chat.title}</span>
        </button>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="ml-6 transition-all duration-300 ease-in-out"
          asChild
        >
          <SidebarMenuAction>
            <MoreHorizontal className="h-4 w-4" />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="-mt-2 ml-1 flex flex-col gap-1 rounded-xl"
          side="right"
          align="start"
        >
          {onRenameChat && (
            <DropdownMenuItem
              className="text-black duration-300 ease-in hover:bg-gray-100"
              onClick={() => onRenameChat(chat.id)}
            >
              <Edit3 className="h-4 w-4" />
              Rename
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-black duration-300 ease-in focus:bg-gray-100"
            onClick={() => onDeleteChat(chat.id)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
