import { ethers } from "ethers";
import { createPublicClient, http } from "viem";
import { getEnsAddress } from 'viem/ens';
import { base } from 'viem/chains'

interface GenerateTxForUserOptions {
  recipient: string;
  amount: number;
}

const client = createPublicClient({
  chain: base,
  transport: http(),
})

export class TransferModule {
  async generateTxForUser({ recipient, amount }: GenerateTxForUserOptions) {
    let receipientAddress: string | null = recipient;
    if (recipient.includes(".eth")) {
      receipientAddress = await getEnsAddress(client, { name: recipient });
    }
    if (!ethers.isAddress(receipientAddress)) {
      throw new Error('Invalid receipint address');
    }

    const valueInWei = ethers.parseEther(amount.toString());

    const txData = {
      to: recipient,
      value: valueInWei.toString(),
      gasLimit: '21000',
      chainId: base.id,  // Base for now
    }
    return txData;
  }
}