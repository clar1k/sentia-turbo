import { createFileRoute } from "@tanstack/react-router";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CustomDashboardSidebar } from "@/components/custom-dashboard-sidebar";
import {
  Newspaper,
  Clock,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/news")({
  component: RouteComponent,
});

function RouteComponent() {
  const newsQuery = useQuery(trpc.news.list.queryOptions({}));

  return (
    <SidebarProvider>
      <CustomDashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4">
          <SidebarTrigger className="-ml-1 text-gray-900 hover:bg-gray-100 hover:text-blue-500" />
          <div className="h-6 w-px bg-gray-300" />
          <h2 className="font-semibold text-gray-900">News Feed</h2>
        </header>
        <div className="min-h-screen space-y-8 overflow-auto bg-gray-50 p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">News Feed</h1>
              <p className="mt-2 text-gray-600">
                Stay updated with the latest news and trending topics
              </p>
            </div>
            {newsQuery.isLoading && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading news...</span>
              </div>
            )}
          </div>

          {/* Error Alert */}
          {newsQuery.error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Failed to load news. Please try refreshing the page.
              </AlertDescription>
            </Alert>
          )}

          {/* News Categories */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Newspaper className="h-6 w-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Latest News
                </h3>
              </div>
              <p className="text-gray-600">
                Breaking news and recent updates from around the world
              </p>
              {newsQuery.data && (
                <div className="mt-3">
                  <Badge variant="outline" className="text-xs">
                    {newsQuery.data.length} articles
                  </Badge>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Trending Topics
                </h3>
              </div>
              <p className="text-gray-600">
                Most discussed topics and viral stories
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Clock className="h-6 w-6 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  AI Analysis
                </h3>
              </div>
              <p className="text-gray-600">
                AI-powered insights and analysis of current events
              </p>
            </div>
          </div>

          {/* News Articles */}
          {newsQuery.isLoading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <div className="text-center">
                <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-500" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Loading News
                </h3>
                <p className="text-gray-600">
                  Fetching the latest news articles for you...
                </p>
              </div>
            </div>
          ) : newsQuery.data && newsQuery.data.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Latest Articles
              </h2>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {newsQuery.data.map((article) => (
                  <div
                    key={article.id}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
                          News Article #{article.id}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs whitespace-nowrap"
                        >
                          News
                        </Badge>
                      </div>

                      {article.summary && (
                        <p className="line-clamp-3 text-sm text-gray-600">
                          {article.summary}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>
                            {article.createdAt
                              ? new Date(article.createdAt).toLocaleDateString()
                              : "Unknown date"}
                          </span>
                        </div>
                      </div>

                      {article.originalData !== null &&
                        article.originalData !== undefined && (
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">
                              Source Data Available
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !newsQuery.isLoading && !newsQuery.error ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <div className="text-center">
                <Newspaper className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No News Available
                </h3>
                <p className="text-gray-600">
                  No news articles found at the moment. Please check back later.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
