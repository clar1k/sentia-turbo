import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";

import {
  DynamicContextProvider,
  getAuthToken,
} from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider } from "wagmi";
import { http } from "viem";
import { base, mainnet } from "viem/chains";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import { queryClient, trpc } from "./utils/trpc";
import type React from "react";
import { toast } from "sonner";
import { ThemeProvider } from "next-themes";

const config = createConfig({
  chains: [base],
  multiInjectedProviderDiscovery: false,
  transports: {
    [base.id]: http(),
  },
});

const dynamicQueryClient = new QueryClient();

function Providers({ children }: React.PropsWithChildren) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: import.meta.env.VITE_DYNAMIC_API_KEY || "",
        walletConnectors: [EthereumWalletConnectors],
        events: {
          onAuthSuccess: (params) => {
            console.log(params);
          },
        }
      }}
      theme="light"
    >
      <WagmiProvider config={config}>
          <DynamicWagmiConnector>
            {children}
          </DynamicWagmiConnector>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPendingComponent: () => <Loader />,
  context: { trpc, queryClient },
  Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={dynamicQueryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      
      </QueryClientProvider>
    );
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
