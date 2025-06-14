import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { ChatInterface } from "@/components/chat-interface";
import {FinanceTab} from "@/components/finance";

const fileRoute = createFileRoute("/finance");
export const Route = fileRoute({ component: Finance });

function Finance() {
  return <FinanceTab/>;
}
