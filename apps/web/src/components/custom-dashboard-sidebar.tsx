import * as React from "react";
import {
  Bot,
  Newspaper,
  TrendingUp,
  Crown,
  Home,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { motion } from "motion/react";

export function CustomDashboardSidebar() {
  return (
    <Sidebar className="border-r border-gray-200 bg-white duration-200 ease-in-out">
      <SidebarHeader className="border-b border-gray-200 bg-white pb-0">
        <div className="flex items-center gap-2 px-4 py-3 pb-[11px]">
          <Bot className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold text-gray-900">Sentia</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-900 transition-colors hover:bg-gray-100 hover:text-blue-500">
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Sentia Supreme Section */}
        <motion.div
          animate={{
            boxShadow: [
              "0 0 20px rgba(59, 130, 246, 0.3)",
              "0 0 30px rgba(59, 130, 246, 0.6)",
              "0 0 20px rgba(59, 130, 246, 0.3)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative mx-2 rounded-lg border border-blue-500/30 bg-gradient-to-r from-blue-50/80 to-slate-50/80 backdrop-blur-sm"
        >
          <motion.div
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10"
          />
          <SidebarGroup className="relative z-10">
            <SidebarGroupLabel className="font-semibold text-blue-600 drop-shadow-lg">
              Sentia Supreme
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="ml-4 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600">
                    Premium Features
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="ml-4 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600">
                    Advanced AI
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="ml-4 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600">
                    Exclusive Insights
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="ml-4 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600">
                    VIP Support
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </motion.div>
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold text-blue-600">
            News Feed
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="ml-4 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-500">
                  Latest News
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="ml-4 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-500">
                  Trending Topics
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="ml-4 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-500">
                  AI Analysis
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold text-blue-600">
            DeFi Feed
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="ml-4 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-500">
                  Market Trends
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="ml-4 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-500">
                  Protocol Updates
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="ml-4 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-500">
                  DeFi News
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="ml-4 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-500">
                  Yield Farming
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-gray-900 transition-colors hover:bg-gray-100 hover:text-blue-500">
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
