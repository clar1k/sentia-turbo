import { ethers } from "ethers";
import { createPublicClient, formatEther, http } from "viem";
import { getEnsAddress } from "viem/ens";
import { base, mainnet } from "viem/chains";

interface GenerateTxForUserOptions {
  recipient: `0x${string}`;
  amount: number;
  from?: `0x${string}`;
}

interface GetEtherBalanceOptions {
  address: `0x${string}`;
}

const ethereumClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const baseClient = createPublicClient({
  chain: base,
  transport: http(),
})

export class TransferModule {
  async getEtherBalance({ address }: GetEtherBalanceOptions) {
    const rawBalance = await baseClient.getBalance({ address });
    const userBalance = parseInt(formatEther(rawBalance));
    return userBalance;
  }

  async generateTxForUser({ recipient, amount, from }: GenerateTxForUserOptions) {
    let receipientAddress: string | null = recipient;
    if (from) {
      const userBalance = await this.getEtherBalance({ address: from });
      if (userBalance < amount) { 
        throw new Error("Insufficient balance!");
      }
    }
    if (recipient.includes(".eth")) {
      receipientAddress = await getEnsAddress(ethereumClient, { name: recipient });
    }
    if (!ethers.isAddress(receipientAddress)) {
      throw new Error("Invalid receipint address");
    }

    const valueInWei = ethers.parseEther(amount.toString());

    const txData = {
      to: recipient,
      from,
      value: valueInWei.toString(),
      gasLimit: '21000',
      chainId: base.id,  // Base for now
    }
    return txData;
  }
}
