# Gamedev

## Overview

This project connects a Unity gem shop to Ganache and shows a web monitoring dashboard for developer revenue share.

It supports this flow:

1. Player buys gems in Unity.
2. Unity sends an on-chain purchase transaction to the shop contract on Ganache.
3. Backend reads source-wallet deductions from Ganache.
4. Backend computes developer share (10% by default).
5. Frontend shows live data in Dashboard, Wallet, and Activity.

This setup can run with a virtual developer wallet (no real payout wallet needed).

## Features

- Unity purchase flow using Ganache
- Backend monitoring API (`/api/ethereum`, `/api/transactions`)
- Developer share computation (default: 10%)
- Frontend pages: Dashboard, Wallet, Activity
- Gem count display derived from ETH when on-chain gemAmount is not present

## Project Structure

```text
Gamedev/
README.md
frontend/
backend/
```

## Prerequisites

- Node.js LTS
- Ganache Desktop
- Unity project with your shop scripts

Check tools:

```powershell
node -v
npm -v
```

## Backend Setup

Path: [backend](backend)

```powershell
cd "c:\Users\Keane\Desktop\Git Uploads\Gamedev\backend"
npm install
```

Create or update `.env`:

```env
PORT=5000
GANACHE_RPC_URL=http://127.0.0.1:7545
CHAIN_ID=5777

# Player/source wallet to monitor
SOURCE_WALLET=0xE738b4Fad01c2C79AD4d2E793125E20eC6F055D4

# Active game contract
CONTRACT_ADDRESS=0x30a6DCF8039f7AfB23fc3bDd86bfc5199d395A6B

# Empty means virtual developer wallet mode
DEV_WALLET=

BLOCK_LOOKBACK=500
MONITORING_MODE=deductions
DEVELOPER_SHARE_RATE=0.1
```

Run backend:

```powershell
npm run dev
```

Health check:

```powershell
iwr "http://localhost:5000/health" -UseBasicParsing | % Content
```

## Frontend Setup

Path: [frontend](frontend)

```powershell
cd "c:\Users\Keane\Desktop\Git Uploads\Gamedev\frontend"
npm install
npm run dev
```

Open with monitored source wallet:

```text
http://localhost:5173/?sourceWallet=0xE738b4Fad01c2C79AD4d2E793125E20eC6F055D4
```

## Unity Setup

Unity scripts are in your Unity project path (outside this repo):

```text
C:\Users\Keane\Shattered_Memories_(Game_Dev)_Copy\Shattered_Memories_(Game_Dev)\Shattered_Memories_(Game_Dev)\Assets\Scripts
```

Minimum Unity settings:

- RPC URL: `http://127.0.0.1:7545`
- Contract address: `0x30a6DCF8039f7AfB23fc3bDd86bfc5199d395A6B`
- Account address: `0xE738b4Fad01c2C79AD4d2E793125E20eC6F055D4`
- Backend API URL: `http://localhost:5000`
- Enable backend sync polling

Gem pricing rule used in UI and sync logic:

- `1 gem = 0.001 ETH`
- Example: `5000 gems = 5 ETH`

## API Endpoints

- `GET /health`
- `GET /api/ethereum?sourceWallet=<wallet>`
- `GET /api/transactions?sourceWallet=<wallet>`

Quick transaction check:

```powershell
iwr "http://localhost:5000/api/transactions?sourceWallet=0xE738b4Fad01c2C79AD4d2E793125E20eC6F055D4" -UseBasicParsing | % Content
```

Expected behavior:

- `purchaseEvents` contains purchase rows
- `developerShareRate` is `0.1`
- each row includes gross and computed share values

## End-to-End Verification

1. Start Ganache Desktop.
2. Start backend (`npm run dev` in [backend](backend)).
3. Start frontend (`npm run dev` in [frontend](frontend)).
4. Run Unity game and buy gems.
5. Confirm:
   - Ganache shows deduction from player wallet.
   - Dashboard updates gems and ETH values.
   - Wallet page shows developer share credits.
   - Activity shows: purchased `N` gems, spent `X` ETH, share credited `Y` ETH.

## Notes

- This project can run in virtual developer wallet mode (`DEV_WALLET=` empty).
- Share shown in web UI is computed from purchases; it is not an automatic on-chain payout transfer.
- Never commit private keys to source control.