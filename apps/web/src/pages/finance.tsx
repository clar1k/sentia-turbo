import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CustomDashboardSidebar } from "@/components/custom-dashboard-sidebar";
import { FinanceTab } from "@/components/finance";

export const FinancePage = () => {
  return (
    <SidebarProvider>
      <div className="flex w-full bg-white">
        <CustomDashboardSidebar />
        <SidebarInset className="flex-1 bg-white">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4">
            <SidebarTrigger className="-ml-1 text-gray-900 hover:bg-gray-100 hover:text-blue-500" />
            <div className="h-6 w-px bg-gray-300" />
            <h2 className="font-semibold text-gray-900">Finance Dashboard</h2>
          </header>
          <div className="min-h-screen overflow-auto bg-gray-50 p-6">
            <FinanceTab />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
