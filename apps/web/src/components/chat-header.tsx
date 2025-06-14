import { SidebarTrigger } from "@/components/ui/sidebar";

interface ChatHeaderProps {
  currentChatTitle?: string;
}

export function ChatHeader({ currentChatTitle }: ChatHeaderProps) {
  return (
    <header className="flex items-center gap-2 border-b px-4 py-2">
      <SidebarTrigger className="cursor-pointer rounded-2xl duration-300 ease-in hover:bg-gray-400" />
      <div className="flex items-center gap-2"></div>
    </header>
  );
}
