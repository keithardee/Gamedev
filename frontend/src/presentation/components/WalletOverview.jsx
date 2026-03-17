import { BankOutlined, SafetyCertificateOutlined, WalletOutlined } from "@ant-design/icons";
import "../styles/components/WalletOverview.css";

function WalletOverview() {
  const walletAddress = "0x742d35Cc6634C0532925a3b844Bc158e1B5a";
  const ethBalance = 12.5;
  const usdValue = 47500;
  const phpValue = 406250;

  return (
    <section className="wallet-overview">
      <header className="wallet-overview__header">
        <div>
          <h1 className="wallet-overview__title">Wallet</h1>
          <p className="wallet-overview__subtitle">
            Developer wallet summary for incoming game purchase revenue.
          </p>
        </div>
      </header>

      <div className="wallet-overview__hero">
        <div className="wallet-card">
          <div className="wallet-card__top">
            <span className="wallet-card__brand">Ganache Wallet</span>
            <WalletOutlined className="wallet-card__icon" />
          </div>
          <div className="wallet-card__balance">
            <span className="wallet-card__label">Available Balance</span>
            <strong>{ethBalance.toFixed(2)} ETH</strong>
          </div>
          <div className="wallet-card__meta">
            <span>{walletAddress}</span>
            <span>Incoming only</span>
          </div>
        </div>

        <div className="wallet-stats">
          <article className="wallet-stat">
            <div className="wallet-stat__icon"><SafetyCertificateOutlined /></div>
            <div>
              <h2>Wallet Type</h2>
              <p>Developer Revenue Wallet</p>
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
          </dl>
        </article>
      </div>

      <article className="wallet-panel wallet-panel--list">
        <h2>Recent Wallet Credits</h2>
        <div className="wallet-credit-list">
          <div className="wallet-credit-item">
            <span>Player_Alpha gem purchase</span>
            <strong>+0.50 ETH</strong>
          </div>
          <div className="wallet-credit-item">
            <span>Player_Beta gem purchase</span>
            <strong>+1.20 ETH</strong>
          </div>
          <div className="wallet-credit-item">
            <span>Player_Gamma gem purchase</span>
            <strong>+0.30 ETH</strong>
          </div>
        </div>
      </article>
    </section>
  );
}

export default WalletOverview;

