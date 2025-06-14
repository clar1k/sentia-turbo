import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { ChatInterface } from "@/components/chat-interface";
import { Home } from "@/pages/home";

export const Route = createFileRoute("/")({ component: HomeComponent });

function HomeComponent() {
  return <Home />;
}
