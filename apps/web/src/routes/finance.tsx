import { createFileRoute } from "@tanstack/react-router";
import { FinancePage } from "@/pages/finance";

export const Route = createFileRoute("/finance")({
  component: Finance,
});

function Finance() {
  return <FinancePage />;
}
