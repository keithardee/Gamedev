const { ethers } = require("ethers");

class MonitorGateway {
  constructor({ rpcUrl, contractAddress, devWallet, eventAbi, blockLookback }) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.contractAddress = contractAddress;
    this.devWallet = devWallet;
    this.blockLookback = blockLookback;
    this.contract = null;

    if (ethers.isAddress(contractAddress) && eventAbi.length > 0) {
      this.contract = new ethers.Contract(contractAddress, eventAbi, this.provider);
    }
  }

  async resolveTransaction(rawTx) {
    if (!rawTx) {
      return null;
    }

    if (typeof rawTx === "string") {
      return this.provider.getTransaction(rawTx);
    }

    return rawTx;
  }

  async getNetworkInfo() {
    const network = await this.provider.getNetwork();
    const latestBlockNumber = await this.provider.getBlockNumber();

    return {
      chainId: Number(network.chainId),
      latestBlockNumber,
    };
  }

  async getBalances() {
    const contractBalanceWei = ethers.isAddress(this.contractAddress)
      ? await this.provider.getBalance(this.contractAddress)
      : 0n;

    const developerBalanceWei = ethers.isAddress(this.devWallet)
      ? await this.provider.getBalance(this.devWallet)
      : 0n;

    return {
      developerBalanceEth: Number(ethers.formatEther(developerBalanceWei)),
      contractBalanceEth: Number(ethers.formatEther(contractBalanceWei)),
    };
  }

  async getIncomingTransfers() {
    if (!ethers.isAddress(this.devWallet)) {
      return [];
    }

    const latestBlockNumber = await this.provider.getBlockNumber();
    const fromBlock = Math.max(0, latestBlockNumber - this.blockLookback);
    const transfers = [];

    for (let blockNumber = latestBlockNumber; blockNumber >= fromBlock; blockNumber -= 1) {
      const block = await this.provider.getBlock(blockNumber, true);
      if (!block || !Array.isArray(block.transactions)) {
        continue;
      }

      for (const rawTx of block.transactions) {
        const tx = await this.resolveTransaction(rawTx);
        if (!tx || !tx.to) {
          continue;
        }

        if (tx.to.toLowerCase() !== this.devWallet) {
          continue;
        }

        const valueEth = Number(ethers.formatEther(tx.value ?? 0n));
        if (valueEth <= 0) {
          continue;
        }

        transfers.push({
          txHash: tx.hash,
          from: tx.from,
          to: tx.to,
          amountEth: valueEth,
          blockNumber,
          timestamp: block.timestamp,
          source: "native-transfer",
        });
      }

      if (transfers.length >= 50) {
        break;
      }
    }

    return transfers.slice(0, 50);
  }

  async getSourceWalletDeductions(sourceWallet, contractAddress = "") {
    if (!ethers.isAddress(sourceWallet)) {
      return [];
    }

    const normalizedSource = sourceWallet.toLowerCase();
    const normalizedContract = ethers.isAddress(contractAddress)
      ? contractAddress.toLowerCase()
      : "";

    const latestBlockNumber = await this.provider.getBlockNumber();
    const fromBlock = Math.max(0, latestBlockNumber - this.blockLookback);
    const deductions = [];

    for (let blockNumber = latestBlockNumber; blockNumber >= fromBlock; blockNumber -= 1) {
      const block = await this.provider.getBlock(blockNumber, true);
      if (!block || !Array.isArray(block.transactions)) {
        continue;
      }

      for (const rawTx of block.transactions) {
        const tx = await this.resolveTransaction(rawTx);
        if (!tx || !tx.from) {
          continue;
        }

        if (tx.from.toLowerCase() !== normalizedSource) {
          continue;
        }

        if (normalizedContract && (!tx.to || tx.to.toLowerCase() !== normalizedContract)) {
          continue;
        }

        const valueEth = Number(ethers.formatEther(tx.value ?? 0n));
        if (valueEth <= 0) {
          continue;
        }

        deductions.push({
          txHash: tx.hash,
          from: tx.from,
          to: tx.to,
          player: tx.from,
          amountEth: valueEth,
          blockNumber,
          timestamp: block.timestamp,
          source: "source-deduction",
          eventName: "PurchaseDeduction",
          gemAmount: 0,
        });
      }

      if (deductions.length >= 100) {
        break;
      }
    }

    return deductions.slice(0, 100);
  }

  async getPurchaseEvents() {
    if (!this.contract) {
      return [];
    }

    const latestBlockNumber = await this.provider.getBlockNumber();
    const fromBlock = Math.max(0, latestBlockNumber - this.blockLookback);

    const allLogs = await this.queryEventLogs(fromBlock, latestBlockNumber);

    const sortedLogs = allLogs
      .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
      .slice(0, 100);

    const eventRows = [];
    for (const log of sortedLogs) {
      const args = log.args ?? [];
      const gemAmount = args.coinAmount ?? args.gemAmount ?? args.amount ?? 0n;
      const player = args.player ?? args.buyer ?? args.from ?? "unknown";

      let amountWei = args.paidWei ?? args.value ?? null;
      if (amountWei === null || amountWei === undefined) {
        const tx = await this.provider.getTransaction(log.transactionHash);
        amountWei = tx?.value ?? 0n;
      }

      eventRows.push({
        txHash: log.transactionHash,
        eventName: log.eventName,
        player,
        gemAmount: Number(gemAmount),
        amountEth: Number(ethers.formatEther(amountWei)),
        blockNumber: log.blockNumber,
        source: "contract-event",
      });
    }

    return eventRows;
  }

  async queryEventLogs(fromBlock, toBlock) {
    if (!this.contract) {
      return [];
    }

    const eventFragments = this.contract.interface.fragments.filter((fragment) => fragment.type === "event");
    const allLogs = [];

    for (const fragment of eventFragments) {
      const filter = this.contract.filters[fragment.name]?.();
      if (!filter) {
        continue;
      }

      const logs = await this.contract.queryFilter(filter, fromBlock, toBlock);
      allLogs.push(...logs);
    }

    return allLogs;
  }

  async getRawRecentContractLogs(limit = 30) {
    if (!this.contract) {
      return [];
    }

    const latestBlockNumber = await this.provider.getBlockNumber();
    const fromBlock = Math.max(0, latestBlockNumber - this.blockLookback);
    const allLogs = await this.queryEventLogs(fromBlock, latestBlockNumber);

    const sorted = allLogs
      .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
      .slice(0, limit);

    return sorted.map((log) => {
      const args = {};
      for (const [key, value] of Object.entries(log.args || {})) {
        if (!Number.isNaN(Number(key))) {
          continue;
        }

        if (typeof value === "bigint") {
          args[key] = value.toString();
        } else {
          args[key] = value;
        }
      }

      return {
        txHash: log.transactionHash,
        blockNumber: Number(log.blockNumber),
        eventName: log.eventName,
        args,
      };
    });
  }
}

module.exports = {
  MonitorGateway,
};
