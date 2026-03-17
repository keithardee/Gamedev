# Gamedev

## What This System Is For

This project is a monitoring dashboard for a game economy that sells gems and receives payment in Ethereum.

The main goal of the system is to help the developer monitor incoming ETH from in-game gem purchases.

This system is designed to:

- track incoming Ethereum sent by players when they buy gems
- show a dashboard summary of incoming revenue
- display wallet-focused information for the developer wallet
- show activity logs related to purchase events and wallet monitoring
- connect to Ganache later for local blockchain testing

Important limitation of the current concept:

- this system is for monitoring incoming ETH only
- it is not intended to send ETH to other wallets
- it is currently UI-focused and uses mock data for display

## Current Features

The frontend currently includes:

- loading screen before entering the dashboard
- collapsible sidebar navigation
- Dashboard page for gem purchase monitoring
- Wallet page focused on the developer revenue wallet
- Activity page for monitoring events and transaction-related status
- ETH conversion display for PHP and USD
- purchase transaction batching with pagination controls
- responsive layout for desktop, tablet, and mobile

## Project Structure

This project uses a separated frontend and backend structure:

```text
Gamedev/
	README.md
	frontend/
	backend/
```

### Frontend

The frontend is built with React and Vite.

Suggested structure already being used:

```text
frontend/src/
	application/
	data/
	domain/
	infrastructure/
	pages/
	presentation/
		components/
		styles/
			components/
```

Clean architecture note:

- UI components stay in `presentation/components`
- CSS stays in `presentation/styles`
- business logic should go into `application`
- domain rules should stay in `domain`
- external integrations such as Ganache or backend API calls should go into `infrastructure`

### Backend

The backend is intended to expose APIs for wallet status, transaction history, and future Ganache integration.

At the moment, the backend can remain simple until the monitoring logic is connected.

## Prerequisites

Install these first:

- Node.js LTS: https://nodejs.org/
- Git (optional): https://git-scm.com/

Check versions:

```powershell
node -v
npm -v
```

## Run The Project

### Frontend

```powershell
cd "c:\Users\Keane\Desktop\Git Uploads\Gamedev\frontend"
npm install
npm run dev
```

### Backend

```powershell
cd "c:\Users\Keane\Desktop\Git Uploads\Gamedev\backend"
npm install
node server.js
```

## Current System Status

Right now, this project is mainly a frontend prototype for the monitoring system.

That means:

- the UI is already structured around Dashboard, Wallet, and Activity
- the data shown in the interface is currently mock data
- the next main step is integrating Ganache or backend APIs for real transaction monitoring

## Planned Next Step

The next logical feature is to connect the frontend to the backend and then connect the backend to Ganache so the dashboard can read actual incoming ETH transactions from gem purchases.