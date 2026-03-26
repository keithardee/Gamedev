const express = require("express");
const { getMonitoringSnapshot } = require("../../application/useCases/getMonitoringSnapshot");

function createEthereumRouter({ monitorGateway, env }) {
  const router = express.Router();

  const normalize = (value) => (value || "").toString().trim().toLowerCase();

  const filterBySourceWallet = (transactions = [], sourceWallet = "") => {
    if (!sourceWallet) {
      return transactions;
    }

    return transactions.filter((tx) => {
      const player = normalize(tx.player);
      const from = normalize(tx.from);
      return player === sourceWallet || from === sourceWallet;
    });
  };

  const applyDeveloperShare = (transactions = []) => {
    return transactions.map((tx) => {
      const grossAmountEth = Number(tx.amountEth || 0);
      const developerShareEth = Number((grossAmountEth * env.developerShareRate).toFixed(8));

      return {
        ...tx,
        grossAmountEth,
        developerShareEth,
        amountEth: developerShareEth,
      };
    });
  };

  router.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "ethereum-monitor-api" });
  });

  router.get("/api/ethereum", async (_req, res) => {
    try {
      const effectiveSourceWallet = normalize(_req.query?.sourceWallet) || env.sourceWallet;
      const snapshot = await getMonitoringSnapshot({ monitorGateway, monitoringMode: env.monitoringMode });

      let rawTransactions = [];
      let contractFilterFallbackUsed = false;
      if (env.monitoringMode === "deductions") {
        rawTransactions = await monitorGateway.getSourceWalletDeductions(effectiveSourceWallet, env.contractAddress);
        if (rawTransactions.length === 0) {
          rawTransactions = await monitorGateway.getSourceWalletDeductions(effectiveSourceWallet);
          contractFilterFallbackUsed = rawTransactions.length > 0;
        }
      } else {
        rawTransactions = snapshot.purchaseEvents.length > 0 ? snapshot.purchaseEvents : snapshot.incomingTransfers;
      }

      const transactions = applyDeveloperShare(filterBySourceWallet(rawTransactions, effectiveSourceWallet));
      const lastEventBlock = transactions.reduce((maxBlock, tx) => {
        const block = Number(tx.blockNumber || 0);
        return block > maxBlock ? block : maxBlock;
      }, 0);

      res.json({
        address: env.devWallet,
        contractAddress: env.contractAddress,
        monitoringMode: env.monitoringMode,
        developerShareRate: env.developerShareRate,
        sourceWallet: effectiveSourceWallet,
        walletMode: env.devWallet ? "real" : "virtual",
        walletName: env.devWallet ? "Developer Wallet" : "Developer Web Wallet (Virtual)",
        contractFilterFallbackUsed,
        lastUpdate: snapshot.generatedAt,
        lastEventBlock,
        network: snapshot.network,
        balance: snapshot.balances.developerBalanceEth,
        contractBalance: snapshot.balances.contractBalanceEth,
        transactions,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch Ethereum monitoring data",
        details: error.message,
      });
    }
  });

  router.get("/api/transactions", async (_req, res) => {
    try {
      const effectiveSourceWallet = normalize(_req.query?.sourceWallet) || env.sourceWallet;
      const snapshot = await getMonitoringSnapshot({ monitorGateway, monitoringMode: env.monitoringMode });

      let purchaseEvents = snapshot.purchaseEvents;
      let contractFilterFallbackUsed = false;
      if (env.monitoringMode === "deductions") {
        purchaseEvents = await monitorGateway.getSourceWalletDeductions(effectiveSourceWallet, env.contractAddress);
        if (purchaseEvents.length === 0) {
          purchaseEvents = await monitorGateway.getSourceWalletDeductions(effectiveSourceWallet);
          contractFilterFallbackUsed = purchaseEvents.length > 0;
        }
      }

      res.json({
        purchaseEvents: applyDeveloperShare(filterBySourceWallet(purchaseEvents, effectiveSourceWallet)),
        incomingTransfers: applyDeveloperShare(filterBySourceWallet(snapshot.incomingTransfers, effectiveSourceWallet)),
        monitoringMode: env.monitoringMode,
        developerShareRate: env.developerShareRate,
        contractFilterFallbackUsed,
        sourceWallet: effectiveSourceWallet,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch transactions",
        details: error.message,
      });
    }
  });

  router.get("/api/debug/contract-logs", async (_req, res) => {
    try {
      const limit = Math.max(1, Math.min(100, Number(_req.query?.limit || 30)));
      const logs = await monitorGateway.getRawRecentContractLogs(limit);
      res.json({
        contractAddress: env.contractAddress,
        count: logs.length,
        logs,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch raw contract logs",
        details: error.message,
      });
    }
  });

  return router;
}

module.exports = {
  createEthereumRouter,
};
