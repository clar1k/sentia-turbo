import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { ChatInterface } from "@/components/chat-interface";

const fileRoute = createFileRoute("/");
export const Route = fileRoute({ component: HomeComponent });

function HomeComponent() {
  return <ChatInterface />;
}
