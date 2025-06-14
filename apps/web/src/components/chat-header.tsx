import { SidebarTrigger } from "@/components/ui/sidebar";

interface ChatHeaderProps {
  currentChatTitle?: string;
}

export function ChatHeader({ currentChatTitle }: ChatHeaderProps) {
  return (
    <header className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-2">
      <SidebarTrigger className="cursor-pointer rounded-2xl text-gray-600 duration-300 ease-in hover:bg-gray-100" />
      <div className="flex items-center gap-2"></div>
    </header>
  );
}
