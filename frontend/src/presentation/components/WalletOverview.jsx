import { BankOutlined, SafetyCertificateOutlined, WalletOutlined } from "@ant-design/icons";
import "../styles/components/WalletOverview.css";

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

function WalletOverview({ ethData, loading, error }) {
  const walletAddress = ethData?.walletAddress ?? "Not configured";
  const walletMode = ethData?.walletMode ?? "virtual";
  const ethBalance = ethData?.developerBalance ?? 0;
  const usdValue = ethData?.stats?.usdValue ?? 0;
  const phpValue = ethData?.stats?.phpValue ?? 0;
  const recentCredits = (ethData?.transactions ?? []).slice(0, 3);
  const developerSharePercent = Number((ethData?.developerShareRate ?? 0.1) * 100);

  return (
    <section className="wallet-overview">
      <header className="wallet-overview__header">
        <div>
          <h1 className="wallet-overview__title">Wallet</h1>
          <p className="wallet-overview__subtitle">
            Developer wallet summary for incoming game purchase revenue.
            {` Displays ${developerSharePercent.toFixed(0)}% share from each purchase.`}
            {loading ? " Syncing live data..." : ""}
            {error ? " Showing fallback data." : ""}
          </p>
        </div>
      </header>

      <div className="wallet-overview__hero">
        <div className="wallet-card">
          <div className="wallet-card__top">
            <span className="wallet-card__brand">
              {walletMode === "virtual" ? "Developer Web Wallet" : "Developer Wallet"}
            </span>
            <WalletOutlined className="wallet-card__icon" />
          </div>
          <div className="wallet-card__balance">
            <span className="wallet-card__label">Available Balance</span>
            <strong>{ethBalance.toFixed(2)} ETH</strong>
          </div>
          <div className="wallet-card__meta">
            <span>{walletAddress}</span>
            <span>{walletMode === "virtual" ? "Virtual incoming ledger" : "Incoming only"}</span>
          </div>
        </div>

        <div className="wallet-stats">
          <article className="wallet-stat">
            <div className="wallet-stat__icon"><SafetyCertificateOutlined /></div>
            <div>
              <h2>Wallet Type</h2>
              <p>{walletMode === "virtual" ? "Developer Virtual Revenue Wallet" : "Developer Revenue Wallet"}</p>
            </div>
          </article>
          <article className="wallet-stat">
            <div className="wallet-stat__icon"><BankOutlined /></div>
            <div>
              <h2>Source Network</h2>
              <p>Ganache Local Blockchain</p>
            </div>
          </article>
        </div>
      </div>

      <div className="wallet-overview__grid">
        <article className="wallet-panel">
          <h2>Converted Balance</h2>
          <div className="wallet-conversions">
            <div>
              <span>USD</span>
              <strong>${usdValue.toLocaleString()}</strong>
            </div>
            <div>
              <span>PHP</span>
              <strong>PHP {phpValue.toLocaleString()}</strong>
            </div>
          </div>
        </article>

        <article className="wallet-panel">
          <h2>Wallet Details</h2>
          <dl className="wallet-details">
            <div>
              <dt>Address</dt>
              <dd>{walletAddress}</dd>
            </div>
            <div>
              <dt>Transaction Type</dt>
              <dd>Incoming ETH only</dd>
            </div>
            <div>
              <dt>Game Revenue Source</dt>
              <dd>Gem purchases</dd>
            </div>
            <div>
              <dt>Share Rule</dt>
              <dd>{developerSharePercent.toFixed(0)}% of each purchase ETH</dd>
            </div>
            <div>
              <dt>Contract Address</dt>
              <dd>{ethData?.contractAddress ?? "Not configured"}</dd>
            </div>
            <div>
              <dt>Contract Balance</dt>
              <dd>{(ethData?.contractBalance ?? 0).toFixed(4)} ETH</dd>
            </div>
          </dl>
        </article>
      </div>

      <article className="wallet-panel wallet-panel--list">
        <h2>Recent Wallet Credits</h2>
        <div className="wallet-credit-list">
          {recentCredits.map((credit) => (
            <div key={credit.id} className="wallet-credit-item">
              <span>{credit.playerName} bought {getDisplayGems(credit)} gems ({credit.grossAmount.toFixed(4)} ETH)</span>
              <strong>+{credit.developerShareAmount.toFixed(4)} ETH share</strong>
            </div>
          ))}
        </div>
      </article>

      <article className="wallet-panel wallet-panel--list">
        <h2>Debug Panel</h2>
        <div className="wallet-credit-list">
          <div className="wallet-credit-item">
            <span>Active Source Wallet</span>
            <strong>{ethData?.sourceWallet || "Not provided"}</strong>
          </div>
          <div className="wallet-credit-item">
            <span>Contract Address</span>
            <strong>{ethData?.contractAddress || "Not configured"}</strong>
          </div>
          <div className="wallet-credit-item">
            <span>Last Event Block</span>
            <strong>{ethData?.lastEventBlock || 0}</strong>
          </div>
        </div>
      </article>
    </section>
  );
}

export default WalletOverview;

