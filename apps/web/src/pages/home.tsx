import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CustomDashboardSidebar } from "@/components/custom-dashboard-sidebar";

export const Home = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-white">
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
            <p className="text-blue-500">
              Your AI-powered finance and news intelligence platform
            </p>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
