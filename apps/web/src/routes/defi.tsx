import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/defi")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/defi"!</div>;
}
