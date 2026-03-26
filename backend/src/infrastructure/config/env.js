const DEFAULT_EVENT_ABI = [
  "event CoinsPurchased(address indexed player, uint256 coinAmount, uint256 paidWei)",
  "event GemsPurchased(address indexed player, uint256 gemAmount, uint256 paidWei)",
  "event Purchase(address indexed player, uint256 amount, uint256 paidWei)",
  "event GemPurchase(address indexed player, uint256 gemAmount, uint256 paidWei)",
];

function parseJsonArray(rawValue, fallback) {
  if (!rawValue) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      return parsed;
    }
  } catch (_error) {
    // Fallback to default ABI fragments if parsing fails.
  }

  return fallback;
}

function getEnv() {
  const monitoringModeRaw = (process.env.MONITORING_MODE ?? "auto").trim().toLowerCase();
  const monitoringMode = ["auto", "events", "incoming", "deductions"].includes(monitoringModeRaw)
    ? monitoringModeRaw
    : "auto";

  const developerShareRateRaw = Number(process.env.DEVELOPER_SHARE_RATE ?? 1);
  const developerShareRate = Number.isFinite(developerShareRateRaw)
    ? Math.min(Math.max(developerShareRateRaw, 0), 1)
    : 1;

  return {
    port: Number(process.env.PORT ?? 5000),
    rpcUrl: process.env.GANACHE_RPC_URL ?? "http://127.0.0.1:7545",
    chainId: Number(process.env.CHAIN_ID ?? 1337),
    devWallet: (process.env.DEV_WALLET ?? "").trim().toLowerCase(),
    sourceWallet: (process.env.SOURCE_WALLET ?? "").trim().toLowerCase(),
    contractAddress: (process.env.CONTRACT_ADDRESS ?? "").trim().toLowerCase(),
    blockLookback: Number(process.env.BLOCK_LOOKBACK ?? 500),
    eventAbi: parseJsonArray(process.env.EVENT_ABI_JSON, DEFAULT_EVENT_ABI),
    monitoringMode,
    developerShareRate,
  };
}

module.exports = {
  getEnv,
};
