async function getMonitoringSnapshot({ monitorGateway, monitoringMode = "auto" }) {
  const [networkInfo, balances, purchaseEvents] = await Promise.all([
    monitorGateway.getNetworkInfo(),
    monitorGateway.getBalances(),
    monitorGateway.getPurchaseEvents(),
  ]);

  let incomingTransfers = [];
  const shouldFetchIncoming =
    monitoringMode === "incoming" || (monitoringMode === "auto" && purchaseEvents.length === 0);

  if (shouldFetchIncoming) {
    incomingTransfers = await monitorGateway.getIncomingTransfers();
  }

  return {
    network: networkInfo,
    balances,
    incomingTransfers,
    purchaseEvents,
    generatedAt: new Date().toISOString(),
  };
}

module.exports = {
  getMonitoringSnapshot,
};
