import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CustomDashboardSidebar } from "@/components/custom-dashboard-sidebar";
import { Link } from "@tanstack/react-router";

export const Home = () => {
  return (
    <SidebarProvider>
      <div className="flex w-full bg-white">
        <CustomDashboardSidebar />
        <SidebarInset className="flex-1 bg-white">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4">
            <SidebarTrigger className="-ml-1 text-gray-900 hover:bg-gray-100 hover:text-blue-500" />
            <div className="h-6 w-px bg-gray-300" />
            <h2 className="font-semibold text-gray-900">Dashboard</h2>
          </header>
          <div className="bg-white p-6">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              Welcome to Sentia Dashboard
            </h1>
            <p className="mb-8 text-blue-500">
              Your AI-powered finance and news intelligence platform
            </p>

            <div className="grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
              <Link
                to="/defi"
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                      DeFi Dashboard
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Explore decentralized finance protocols, TVL data, and
                      DeFi market insights
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 text-blue-500 transition-colors group-hover:text-blue-600">
                    →
                  </div>
                </div>
              </Link>

              <Link
                to="/finance"
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                      Finance Dashboard
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Access comprehensive financial data, market analysis, and
                      trading insights
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 text-blue-500 transition-colors group-hover:text-blue-600">
                    →
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
