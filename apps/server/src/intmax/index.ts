import {
  IntMaxNodeClient,
  type PrepareDepositTransactionRequest,
  type WithdrawRequest,
} from "intmax2-server-sdk";

export const getIntMaxClient = (privateKey: `0x${string}`) => {
  const intMaxClient = new IntMaxNodeClient({
    environment: "testnet", //  'mainnet' | 'devnet' | 'testnet'
    eth_private_key: process.env.PRIVATE_KEY as `0x${string}`,
    l1_rpc_url: process.env.L1_RPC_URL, // ethereum sepolia testnet rpc url
  });
  return intMaxClient;
};

export const getWalletBalance = async (privateKey: `0x${string}`) => {
  try {
    const client = getIntMaxClient(privateKey);
    const balances = client.fetchTokenBalances();
    return {
      balances,
      ok: true,
    };
  } catch (error) {
    return {
      error: `Fetching wallet balances failed with error: ${error}`,
      ok: false,
    };
  }
};

export const deposit = async (
  privateKey: `0x${string}`,
  params: PrepareDepositTransactionRequest,
) => {
  try {
    const client = getIntMaxClient(privateKey);
    const response = client.deposit(params);
    return {
      response,
      ok: true,
    };
  } catch (error) {
    return {
      error: `deposit failed with error: ${error}`,
      ok: false,
    };
  }
};

export const withdraw = async (
  privateKey: `0x${string}`,
  params: WithdrawRequest,
) => {
  try {
    const client = getIntMaxClient(privateKey);
    const response = client.withdraw(params);
    return {
      response,
      ok: true,
    };
  } catch (error) {
    return {
      error: `withdraw failed with error: ${error}`,
      ok: false,
    };
  }
};

export const getTokensList = async (
  privateKey: `0x${string}`,
  params: WithdrawRequest,
) => {
  try {
    const client = getIntMaxClient(privateKey);
    const response = client.getTokensList();
    return {
      response,
      ok: true,
    };
  } catch (error) {
    return {
      error: `withdraw failed with error: ${error}`,
      ok: false,
    };
  }
};
