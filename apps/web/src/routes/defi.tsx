import { createFileRoute } from "@tanstack/react-router";
import { useMarketData } from "@/hooks/use-market-data";
import { usePrices } from "@/hooks/use-prices";
import { useBtcDominance } from "@/hooks/use-btc-dominance";
import { useGlobalVolume } from "@/hooks/use-volume";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
  TrendingUp,
  DollarSign,
  Bitcoin,
  Globe,
  AlertCircle,
  Brain,
  Coins,
  Zap,
  PieChart,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { FinanceMetricCard, ChartCard } from "@/components/finance/custom-card";
import { CustomDashboardSidebar } from "@/components/custom-dashboard-sidebar";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/defi")({
  component: RouteComponent,
});

function RouteComponent() {
  const prices = usePrices();
  const marketData = useMarketData();
  const btcDominance = useBtcDominance();
  const volume = useGlobalVolume();

  // AI Summary hook integrated directly in component
  const {
    data: aiSummaryData,
    isLoading: aiSummaryLoading,
    error: aiSummaryError,
  } = useQuery(trpc.finance.getAiSummary.queryOptions());

  const formatVolume = (volume: number | null) => {
    if (!volume) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(volume);
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Create chart data for DeFi prices
  const defiPriceChartData = prices.prices
    ? Object.entries(prices.prices)
        .filter(([symbol]) =>
          // Filter for major DeFi tokens
          ["eth", "uni", "aave", "comp", "mkr", "snx", "crv", "1inch"].includes(
            symbol.toLowerCase(),
          ),
        )
        .map(([symbol, price]) => ({
          symbol,
          price: typeof price === "number" ? price : 0,
          name: symbol.toUpperCase(),
        }))
    : [];

  // Create DeFi TVL simulation data (in a real app, this would come from a DeFi-specific hook)
  const tvlData = [
    { protocol: "Uniswap V3", tvl: 3.2, color: "#FF007A" },
    { protocol: "Aave", tvl: 5.8, color: "#B6509E" },
    { protocol: "Compound", tvl: 2.1, color: "#00D395" },
    { protocol: "MakerDAO", tvl: 7.4, color: "#1AAB9B" },
    { protocol: "Curve", tvl: 3.9, color: "#40E0D0" },
  ];

  // Create pie chart data for market dominance
  const dominanceData =
    btcDominance.btcDominance && typeof btcDominance.btcDominance === "number"
      ? [
          {
            name: "Bitcoin",
            value: btcDominance.btcDominance,
            color: "#f7931a",
          },
          {
            name: "DeFi & Others",
            value: 100 - btcDominance.btcDominance,
            color: "#6366f1",
          },
        ]
      : [];

  const COLORS = ["#f7931a", "#6366f1"];

  return (
    <SidebarProvider>
      <CustomDashboardSidebar />
      <SidebarInset>
        <div className="space-y-8 overflow-auto p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                DeFi Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Decentralized Finance protocols and market insights
              </p>
            </div>
          </div>

          {/* Error Alerts */}
          {(prices.error ||
            marketData.error ||
            btcDominance.error ||
            volume.error ||
            aiSummaryError) && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Some data failed to load. Please refresh the page.
              </AlertDescription>
            </Alert>
          )}

          {/* Key DeFi Metrics Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total DeFi TVL Card */}
            <FinanceMetricCard
              title="Total DeFi TVL"
              value="$42.8B"
              description="Total Value Locked in DeFi"
              icon={Coins}
              iconColor="text-purple-500"
              loading={false}
              trend={{
                value: 3.2,
                isPositive: true,
              }}
            />

            {/* DeFi Dominance Card */}
            <FinanceMetricCard
              title="DeFi Market Share"
              value={
                btcDominance.btcDominance &&
                typeof btcDominance.btcDominance === "number"
                  ? `${(100 - btcDominance.btcDominance).toFixed(2)}%`
                  : "N/A"
              }
              description="Non-Bitcoin market cap"
              icon={PieChart}
              iconColor="text-indigo-500"
              loading={btcDominance.loading}
            />

            {/* DeFi Volume Card */}
            <FinanceMetricCard
              title="DeFi Volume"
              value={
                volume.volumeUsd ? formatVolume(volume.volumeUsd * 0.35) : "N/A"
              }
              description="24h DeFi trading volume (est.)"
              icon={BarChart3}
              iconColor="text-blue-500"
              loading={volume.loading}
            />

            {/* ETH Price Card (key for DeFi) */}
            <FinanceMetricCard
              title="ETH Price"
              value={
                prices.prices?.eth && typeof prices.prices.eth === "number"
                  ? formatPrice(prices.prices.eth)
                  : "N/A"
              }
              description="Ethereum price (DeFi backbone)"
              icon={Zap}
              iconColor="text-blue-600"
              loading={prices.loading}
            />
          </div>

          {/* AI Summary Section */}
          <ChartCard
            title="DeFi Market Analysis"
            description="AI-powered insights on DeFi protocols and trends"
            loading={aiSummaryLoading}
          >
            {aiSummaryData?.message && aiSummaryData.message.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Brain className="h-4 w-4 text-purple-500" />
                  <span>
                    Generated on{" "}
                    {aiSummaryData.message[0].createdAt
                      ? new Date(
                          aiSummaryData.message[0].createdAt,
                        ).toLocaleString()
                      : "Unknown date"}
                  </span>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="leading-relaxed whitespace-pre-wrap text-gray-700">
                    {aiSummaryData.message[0].messages}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-gray-500">
                <div className="text-center">
                  <Brain className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  <p>No DeFi analysis available</p>
                </div>
              </div>
            )}
          </ChartCard>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* DeFi Token Prices Chart */}
            <ChartCard
              title="Major DeFi Token Prices"
              description="Real-time prices of leading DeFi protocols"
              loading={prices.loading}
            >
              {defiPriceChartData.length > 0 ? (
                <ChartContainer
                  config={{
                    price: {
                      label: "Price",
                      color: "#6366f1",
                    },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={defiPriceChartData}>
                      <XAxis
                        dataKey="name"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) => [`$${value}`, "Price"]}
                            labelFormatter={(label) => `${label} Price`}
                          />
                        }
                      />
                      <Bar
                        dataKey="price"
                        fill="#6366f1"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex h-64 items-center justify-center text-gray-500">
                  <p>No DeFi price data available</p>
                </div>
              )}
            </ChartCard>

            {/* TVL Distribution Chart */}
            <ChartCard
              title="DeFi TVL Distribution"
              description="Total Value Locked across major protocols"
              loading={false}
            >
              <ChartContainer
                config={{
                  tvl: {
                    label: "TVL",
                    color: "#6366f1",
                  },
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={tvlData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="tvl"
                      label={({ protocol, tvl }) => `${protocol}: $${tvl}B`}
                    >
                      {tvlData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => [`$${value}B`, "TVL"]}
                          labelFormatter={(label) => `${label}`}
                        />
                      }
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </ChartCard>

            {/* Market Dominance Chart */}
            <ChartCard
              title="Crypto Market Breakdown"
              description="Bitcoin vs DeFi/Alt market distribution"
              loading={btcDominance.loading}
            >
              {dominanceData.length > 0 ? (
                <ChartContainer
                  config={{
                    value: {
                      label: "Dominance",
                      color: "#f7931a",
                    },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={dominanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) =>
                          `${name}: ${value.toFixed(1)}%`
                        }
                      >
                        {dominanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) => [`${value}%`, "Dominance"]}
                            labelFormatter={(label) => `${label}`}
                          />
                        }
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex h-64 items-center justify-center text-gray-500">
                  <p>No market dominance data available</p>
                </div>
              )}
            </ChartCard>

            {/* DeFi Protocols Table */}
            <ChartCard
              title="Top DeFi Protocols"
              description="Leading protocols by Total Value Locked"
              loading={false}
            >
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Protocol</TableHead>
                      <TableHead>TVL</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">24h Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tvlData.map((protocol, index) => (
                      <TableRow key={protocol.protocol}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: protocol.color }}
                            />
                            {protocol.protocol}
                          </div>
                        </TableCell>
                        <TableCell>${protocol.tvl}B</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {protocol.protocol === "Uniswap V3"
                              ? "DEX"
                              : protocol.protocol === "Aave" ||
                                  protocol.protocol === "Compound"
                                ? "Lending"
                                : protocol.protocol === "MakerDAO"
                                  ? "CDP"
                                  : "AMM"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn(
                              "font-medium",
                              Math.random() > 0.5
                                ? "text-green-600"
                                : "text-red-600",
                            )}
                          >
                            {Math.random() > 0.5 ? "+" : "-"}
                            {(Math.random() * 10).toFixed(2)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ChartCard>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
