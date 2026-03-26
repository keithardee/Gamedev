const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { getEnv } = require("../infrastructure/config/env");
const { MonitorGateway } = require("../infrastructure/ethereum/monitorGateway");
const { createEthereumRouter } = require("./routes/ethereumRoutes");

dotenv.config();

function createServer() {
  const env = getEnv();
  const app = express();

  app.use(cors());
  app.use(express.json());

  const monitorGateway = new MonitorGateway({
    rpcUrl: env.rpcUrl,
    contractAddress: env.contractAddress,
    devWallet: env.devWallet,
    eventAbi: env.eventAbi,
    blockLookback: env.blockLookback,
  });

  app.use(createEthereumRouter({ monitorGateway, env }));

  const server = app.listen(env.port, () => {
    console.log(`[ethereum-monitor-api] running on http://localhost:${env.port}`);
  });

  return { app, server };
}

module.exports = {
  createServer,
};
