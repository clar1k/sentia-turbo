import { SidebarTrigger } from "@/components/ui/sidebar";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

interface ChatHeaderProps {
  currentChatTitle?: string;
}

export function ChatHeader({ currentChatTitle }: ChatHeaderProps) {
  return (
    <header className="z-10 flex w-full items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 py-2">
      <div>
        <SidebarTrigger className="cursor-pointer rounded-2xl text-gray-600 duration-300 ease-in hover:bg-gray-100" />
        <div className="flex items-center gap-2"></div>
      </div>
      <div>
        <DynamicWidget />
      </div>
    </header>
  );
}
