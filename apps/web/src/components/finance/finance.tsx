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
import {
  TrendingUp,
  DollarSign,
  Bitcoin,
  Globe,
  AlertCircle,
  Brain,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { FinanceMetricCard, ChartCard } from "./custom-card";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

export function FinanceTab() {
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

  // Create chart data for prices
  const priceChartData = prices.prices
    ? Object.entries(prices.prices).map(([symbol, price]) => ({
        symbol,
        price: typeof price === "number" ? price : 0,
        name: symbol.toUpperCase(),
      }))
    : [];

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
            name: "Others",
            value: 100 - btcDominance.btcDominance,
            color: "#6b7280",
          },
        ]
      : [];

  const COLORS = ["#f7931a", "#6b7280"];

  return (
    <div className="space-y-8 overflow-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Finance Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Real-time cryptocurrency and market data
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

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* BTC Dominance Card */}
        <FinanceMetricCard
          title="BTC Dominance"
          value={
            btcDominance.btcDominance &&
            typeof btcDominance.btcDominance === "number"
              ? `${btcDominance.btcDominance.toFixed(2)}%`
              : "N/A"
          }
          description="Bitcoin market dominance"
          icon={Bitcoin}
          iconColor="text-orange-500"
          loading={btcDominance.loading}
        />

        {/* Global Volume Card */}
        <FinanceMetricCard
          title="Global Volume"
          value={formatVolume(volume.volumeUsd)}
          description="24h trading volume"
          icon={Globe}
          iconColor="text-blue-500"
          loading={volume.loading}
        />

        {/* S&P 500 Card */}
        <FinanceMetricCard
          title="S&P 500"
          value={
            marketData.marketData?.stockRealtimeSPX?.stockMarket?.price
              ? formatPrice(
                  marketData.marketData.stockRealtimeSPX.stockMarket.price,
                )
              : "N/A"
          }
          description="Stock index price"
          icon={TrendingUp}
          iconColor="text-green-500"
          loading={marketData.loading}
          trend={
            marketData.marketData?.stockRealtimeSPX?.change
              ? {
                  value: marketData.marketData.stockRealtimeSPX.change,
                  isPositive:
                    marketData.marketData.stockRealtimeSPX.change >= 0,
                }
              : undefined
          }
        />

        {/* Gold Price Card */}
        <FinanceMetricCard
          title="Gold Price"
          value={
            marketData.marketData?.stockRealtimeGOLD?.stockMarket?.price
              ? formatPrice(
                  marketData.marketData.stockRealtimeGOLD.stockMarket.price,
                )
              : "N/A"
          }
          description="Gold spot price"
          icon={DollarSign}
          iconColor="text-yellow-500"
          loading={marketData.loading}
          trend={
            marketData.marketData?.stockRealtimeGOLD?.change
              ? {
                  value: marketData.marketData.stockRealtimeGOLD.change,
                  isPositive:
                    marketData.marketData.stockRealtimeGOLD.change >= 0,
                }
              : undefined
          }
        />
      </div>

      {/* AI Summary Section */}
      <ChartCard
        title="AI Market Summary"
        description="Latest AI-generated insights and market analysis"
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
              <p>No AI summary available</p>
            </div>
          </div>
        )}
      </ChartCard>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Cryptocurrency Prices Chart */}
        <ChartCard
          title="Cryptocurrency Prices"
          description="Current prices of major cryptocurrencies"
          loading={prices.loading}
        >
          {priceChartData.length > 0 ? (
            <ChartContainer
              config={{
                price: {
                  label: "Price",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceChartData}>
                  <XAxis
                    dataKey="symbol"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value) => [formatPrice(Number(value)), "Price"]}
                  />
                  <Bar dataKey="price" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex h-64 items-center justify-center text-gray-500">
              No price data available
            </div>
          )}
        </ChartCard>

        {/* Market Dominance Chart */}
        <ChartCard
          title="Market Dominance"
          description="Bitcoin vs. rest of the market"
          loading={btcDominance.loading}
        >
          {dominanceData.length > 0 ? (
            <ChartContainer
              config={{
                btc: {
                  label: "Bitcoin",
                  color: "#f7931a",
                },
                others: {
                  label: "Others",
                  color: "#6b7280",
                },
              }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dominanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dominanceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value) => [
                      `${Number(value).toFixed(2)}%`,
                      "Dominance",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex h-64 items-center justify-center text-gray-500">
              No dominance data available
            </div>
          )}
        </ChartCard>
      </div>

      {/* Detailed Price Table */}
      {prices.prices && Object.keys(prices.prices).length > 0 && (
        <ChartCard
          title="Detailed Price Information"
          description="Complete list of cryptocurrency prices"
          loading={prices.loading}
        >
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100">
                <TableHead className="text-left font-semibold text-gray-900">
                  Symbol
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-900">
                  Price
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(prices.prices).map(([symbol, price]) => (
                <TableRow key={symbol} className="border-b border-gray-200">
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-gray-200 bg-white text-gray-700"
                    >
                      {symbol.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium text-gray-900">
                    {typeof price === "number" ? formatPrice(price) : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ChartCard>
      )}
    </div>
  );
}
