import {
  useAccount,
  useBalance,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useChains,
  useChainId,
} from "wagmi";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { formatEther } from "viem";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Wallet,
  Loader2,
  CheckCircle,
  XCircle,
  ArrowRight,
  Link2,
  AlertTriangle,
} from "lucide-react";

export interface TransactionData {
  to: `0x${string}`;
  value: string; // Value in WEI as a string
  data?: `0x${string}`;
}

interface TransactionCardProps {
  txData: TransactionData;
}

const truncateAddress = (address: string) => {
  if (address.endsWith(".eth")) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function TransactionCard({ txData }: TransactionCardProps) {
  const { address, isConnected } = useAccount();
  const { setShowAuthFlow } = useDynamicContext();

  const { data: balanceData } = useBalance({ address });
  const { data: hash, error, isPending, sendTransaction } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const chainId = useChainId();
  const chains = useChains();
  const currentChain = chains.find((chain) => chain.id === chainId);
  const explorerUrl = currentChain?.blockExplorers?.default.url;

  const txValue = BigInt(txData.value);
  const hasSufficientBalance = balanceData ? balanceData.value >= txValue : false;

  const handleSign = () => {
    sendTransaction({
      to: txData.to,
      value: txValue,
      data: txData.data,
    });
  };

  return (
    <Card className="w-full max-w-sm border-blue-500/40 bg-blue-500/5 min-w-[280px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
          <Wallet className="h-5 w-5 text-blue-500" />
          Transaction Request
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Amount</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatEther(txValue)} ETH
          </div>
        </div>
        <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
          <div className="text-sm font-medium text-gray-500">To</div>
          <div className="flex items-center gap-2 font-mono text-sm text-gray-700">
            {truncateAddress(txData.to)}
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        {isConnected && balanceData && (
          <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
            <div className="text-sm font-medium text-gray-500">Balance</div>
            <div className="text-sm font-semibold text-gray-700">
              {parseFloat(balanceData.formatted).toFixed(4)} {balanceData.symbol}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch">
        {!isConnected ? (
          <Button
            onClick={() => setShowAuthFlow(true)}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            <Link2 className="mr-2 h-4 w-4" />
            Connect Wallet to Sign
          </Button>
        ) : isPending ? (
          <Button disabled className="w-full bg-blue-500/80">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Pending in Wallet...
          </Button>
        ) : isConfirming ? (
          <Button disabled className="w-full bg-blue-500/80">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Transaction...
          </Button>
        ) : isConfirmed ? (
          <div className="text-center text-sm text-green-600">
            <CheckCircle className="mx-auto mb-2 h-8 w-8" />
            <p>Transaction Successful!</p>
            {explorerUrl && (
              <a
                href={`${explorerUrl}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View on Block Explorer
              </a>
            )}
          </div>
        ) : (
          <Button
            onClick={handleSign}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300"
          >
            Sign Transaction
          </Button>
        )}

        {isConnected && !hasSufficientBalance && !isConfirmed && (
          <div className="mt-2 flex items-center justify-center text-xs text-yellow-600">
            <AlertTriangle className="mr-1 h-4 w-4" />
            Insufficient balance
          </div>
        )}

        {error && (
          <div className="mt-2 text-center text-xs text-red-500">
            <p>Error: {error.message}</p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}