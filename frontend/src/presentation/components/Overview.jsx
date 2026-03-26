import { useState } from "react";
import { ArrowDownOutlined, FireOutlined, CrownOutlined } from "@ant-design/icons";
import "../styles/components/Overview.css";

const ETH_PER_GEM = 0.001;

function getDisplayGems(tx) {
  const direct = Number(tx?.gems || 0);
  if (direct > 0) {
    return direct;
  }

  const gross = Number(tx?.grossAmount || 0);
  if (gross <= 0) {
    return 0;
  }

  return Math.max(0, Math.round(gross / ETH_PER_GEM));
}

function Overview({ ethData, loading, error }) {
  const transactionsPerPage = 10;
  const totalIncomingEth = ethData?.stats?.totalIncomingEth ?? 0;
  const todayIncomingEth = ethData?.stats?.todayIncomingEth ?? 0;
  const totalGemsPurchased = ethData?.stats?.totalGemsPurchased ?? 0;
  const walletAddress = ethData?.walletAddress ?? "Not configured";
  const [currentPage, setCurrentPage] = useState(1);
  const transactions = ethData?.transactions ?? [];

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const visibleTransactions = transactions.slice(startIndex, endIndex);

  return (
    <div className="overview-section">
      <div className="overview-header">
        <h1 className="overview-title">Gem Purchase Monitor</h1>
        <p className="overview-subtitle">
          Real-time incoming ETH from game purchases
          {loading ? " • syncing" : " • live"}
          {error ? " • fallback data" : ""}
        </p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card primary">
          <div className="kpi-icon">
            <ArrowDownOutlined />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Total Incoming ETH</p>
            <h2 className="kpi-value">{totalIncomingEth.toFixed(2)} Ξ</h2>
            <span className="kpi-meta">All time</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <FireOutlined />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Today's Incoming</p>
            <h2 className="kpi-value">{todayIncomingEth.toFixed(2)} Ξ</h2>
            <span className="kpi-meta">Last 24 hours</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <CrownOutlined />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Total Gems Sold</p>
            <h2 className="kpi-value">{totalGemsPurchased.toLocaleString()}</h2>
            <span className="kpi-meta">Cumulative</span>
          </div>
        </div>
      </div>

      <div className="wallet-info-card">
        <div className="wallet-header">
          <h3>Developer Wallet</h3>
          <span className="wallet-status">Connected</span>
        </div>
        <p className="wallet-addr">{walletAddress}</p>
        <p className="wallet-meta">Receives incoming ETH from game gem purchases on Ganache</p>
      </div>

      <div className="transactions-monitor">
        <div className="monitor-header">
          <h2>Purchase Transactions</h2>
          <span className="live-indicator">● Live</span>
        </div>

        <div className="transactions-table-responsive">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Gems Purchased</th>
                <th>Purchase / Share (ETH)</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleTransactions.map((tx) => (
                <tr key={tx.id} className="transaction-row">
                  <td className="player-name">{tx.playerName}</td>
                  <td className="gems-amount">
                    <span className="gem-badge">{getDisplayGems(tx)}</span>
                  </td>
                  <td className="eth-amount">
                    <span className="amount-highlight">{tx.grossAmount.toFixed(4)} / {tx.developerShareAmount.toFixed(4)}</span>
                    <span className="eth-sym"> Ξ</span>
                  </td>
                  <td className="tx-time">{tx.timestamp}</td>
                  <td className="tx-status">
                    <span className={`status-badge ${tx.status}`}>{tx.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="transactions-pagination">
          <p className="transactions-pagination__info">
            Showing {startIndex + 1}-{Math.min(endIndex, transactions.length)} of {transactions.length} transactions
          </p>
          <div className="transactions-pagination__actions">
            <button
              className="transactions-pagination__button"
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              {"<"}
            </button>
            <span className="transactions-pagination__page">
              Batch {currentPage} of {totalPages}
            </span>
            <button
              className="transactions-pagination__button"
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
            >
              {">"}
            </button>
          </div>
        </div>

        <p className="monitor-footer">
          Shows all incoming ETH transactions from game gem purchases. Connect to Ganache for live data.
        </p>
      </div>

      <div className="conversion-rates">
        <h2>ETH Conversion Rates</h2>
        <div className="conversion-grid">
          <div className="conversion-card">
            <div className="conversion-header">
              <h3>Philippine Peso</h3>
              <span className="currency-code">PHP</span>
            </div>
            <p className="conversion-rate">{(ethData?.stats?.phpValue ?? 0).toLocaleString()}</p>
            <p className="conversion-meta">₱ per {totalIncomingEth} ETH</p>
          </div>

          <div className="conversion-card">
            <div className="conversion-header">
              <h3>US Dollar</h3>
              <span className="currency-code">USD</span>
            </div>
            <p className="conversion-rate">{(ethData?.stats?.usdValue ?? 0).toLocaleString()}</p>
            <p className="conversion-meta">$ per {totalIncomingEth} ETH</p>
          </div>

          <div className="conversion-card">
            <div className="conversion-header">
              <h3>Today's PHP</h3>
              <span className="currency-code">PHP</span>
            </div>
            <p className="conversion-rate">{(ethData?.stats?.todayPhpValue ?? 0).toLocaleString()}</p>
            <p className="conversion-meta">₱ per {todayIncomingEth} ETH</p>
          </div>

          <div className="conversion-card">
            <div className="conversion-header">
              <h3>Today's USD</h3>
              <span className="currency-code">USD</span>
            </div>
            <p className="conversion-rate">{(ethData?.stats?.todayUsdValue ?? 0).toLocaleString()}</p>
            <p className="conversion-meta">$ per {todayIncomingEth} ETH</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;




