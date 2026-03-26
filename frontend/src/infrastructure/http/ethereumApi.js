const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

async function parseResponse(response) {
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.details || payload?.error || "Failed to fetch Ethereum data");
  }

  return payload;
}

function withOptionalSourceWallet(path, sourceWallet) {
  if (!sourceWallet) {
    return `${API_BASE_URL}${path}`;
  }

  const params = new URLSearchParams({ sourceWallet });
  return `${API_BASE_URL}${path}?${params.toString()}`;
}

export async function fetchEthereumSnapshot({ sourceWallet } = {}) {
  const response = await fetch(withOptionalSourceWallet("/api/ethereum", sourceWallet));
  return parseResponse(response);
}

export async function fetchEthereumTransactions({ sourceWallet } = {}) {
  const response = await fetch(withOptionalSourceWallet("/api/transactions", sourceWallet));
  return parseResponse(response);
}
