const CURRENCY_RATES = {
  usd: 3800,
  php: 3250,
};

const ETH_PER_GEM = 0.001;

function toTimeAgo(timestampSeconds) {
  if (!timestampSeconds) {
    return "just now";
  }

  const nowMs = Date.now();
  const eventMs = Number(timestampSeconds) * 1000;
  const diffMinutes = Math.max(1, Math.floor((nowMs - eventMs) / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
}

function normalizeTransactions(rawTransactions = []) {
  return rawTransactions.map((tx, index) => {
    const grossAmount = Number(tx.grossAmountEth || tx.amountEth || 0);
    const developerShareAmount = Number(tx.developerShareEth || tx.amountEth || 0);
    const txGemAmount = Number(tx.gemAmount || 0);
    const derivedGems = Math.max(0, Math.round(grossAmount / ETH_PER_GEM));

    return {
      id: index + 1,
      playerName: tx.player || tx.from || "Player",
      gems: txGemAmount > 0 ? txGemAmount : derivedGems,
      amount: developerShareAmount,
      grossAmount,
      developerShareAmount,
      timestamp: tx.timestamp ? toTimeAgo(tx.timestamp) : `Block #${tx.blockNumber || "-"}`,
      status: "confirmed",
      txHash: tx.txHash,
      source: tx.source,
    };
  });
}

export function mapMonitoringSnapshot(snapshot) {
  const transactions = normalizeTransactions(snapshot?.transactions || []);

  const totalIncomingEth = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const todayIncomingEth = transactions
    .slice(0, 10)
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalGemsPurchased = transactions.reduce((sum, tx) => sum + (tx.gems || 0), 0);
  const hasRealWalletAddress = snapshot?.walletMode ? snapshot.walletMode === "real" : Boolean(snapshot?.address);
  const walletAddress = hasRealWalletAddress
    ? snapshot?.address
    : snapshot?.walletName || "Developer Web Wallet (Virtual)";
  const developerBalance = hasRealWalletAddress
    ? Number(snapshot?.balance || 0)
    : totalIncomingEth;
  const developerShareRate = Number(snapshot?.developerShareRate || 0.1);

  return {
    walletAddress,
    walletMode: hasRealWalletAddress ? "real" : "virtual",
    contractAddress: snapshot?.contractAddress || "Not configured",
    sourceWallet: snapshot?.sourceWallet || "Not provided",
    developerShareRate,
    lastEventBlock: Number(snapshot?.lastEventBlock || 0),
    developerBalance,
    contractBalance: Number(snapshot?.contractBalance || 0),
    network: snapshot?.network || { chainId: 0, latestBlockNumber: 0 },
    lastUpdate: snapshot?.lastUpdate || new Date().toISOString(),
    transactions,
    stats: {
      totalIncomingEth,
      todayIncomingEth,
      totalGemsPurchased,
      usdValue: Number((totalIncomingEth * CURRENCY_RATES.usd).toFixed(2)),
      phpValue: Number((totalIncomingEth * CURRENCY_RATES.php).toFixed(2)),
      todayUsdValue: Number((todayIncomingEth * CURRENCY_RATES.usd).toFixed(2)),
      todayPhpValue: Number((todayIncomingEth * CURRENCY_RATES.php).toFixed(2)),
    },
  };
}

export const MOCK_MONITORING_DATA = {
  walletAddress: "0x742d35Cc6634C0532925a3b844Bc158e1B5a",
  contractAddress: "0x0000000000000000000000000000000000000000",
  developerBalance: 12.5,
  contractBalance: 0,
  network: { chainId: 1337, latestBlockNumber: 0 },
  lastUpdate: new Date().toISOString(),
  transactions: [
    {
      id: 1,
      playerName: "Player_Alpha",
      gems: 500,
      amount: 0.5,
      timestamp: "2 minutes ago",
      status: "confirmed",
      txHash: "-",
      source: "mock",
    },
    {
      id: 2,
      playerName: "Player_Beta",
      gems: 1200,
      amount: 1.2,
      timestamp: "15 minutes ago",
      status: "confirmed",
      txHash: "-",
      source: "mock",
    },
    {
      id: 3,
      playerName: "Player_Gamma",
      gems: 300,
      amount: 0.3,
      timestamp: "32 minutes ago",
      status: "confirmed",
      txHash: "-",
      source: "mock",
    },
  ],
  stats: {
    totalIncomingEth: 12.5,
    todayIncomingEth: 2.8,
    totalGemsPurchased: 4250,
    usdValue: 47500,
    phpValue: 406250,
    todayUsdValue: 10640,
    todayPhpValue: 9100,
  },
};
