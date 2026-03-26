import { ClockCircleOutlined, CheckCircleOutlined, ShoppingCartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import "../styles/components/ActivityOverview.css";

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

function ActivityOverview({ ethData, loading }) {
  const transactions = ethData?.transactions ?? [];

  const activityFeed = transactions.slice(0, 4).map((tx, index) => {
    const gemsPurchased = getDisplayGems(tx);

    return {
    id: tx.id ?? index + 1,
    title: index === 0 ? "Gem purchase credited" : "Wallet balance updated",
    description: `${tx.playerName} purchased ${gemsPurchased} gems (spent ${tx.grossAmount.toFixed(4)} ETH). Developer share credited: ${tx.developerShareAmount.toFixed(4)} ETH.`,
    time: tx.timestamp,
    icon: index % 2 === 0 ? <ShoppingCartOutlined /> : <ThunderboltOutlined />,
    status: "success",
    };
  });

  activityFeed.push({
    id: "chain-confirmation",
    title: "Block confirmation completed",
    description: "Ganache confirmed the latest gem purchase transfer to the monitoring wallet.",
    time: "moments ago",
    icon: <CheckCircleOutlined />,
    status: "success",
  });

  activityFeed.push({
    id: "monitoring-cycle",
    title: "Monitoring cycle executed",
    description: "Activity tracker scanned for new incoming ETH transactions from game purchases.",
    time: loading ? "syncing" : "just now",
    icon: <ClockCircleOutlined />,
    status: "neutral",
  });

  return (
    <section className="activity-overview">
      <header className="activity-overview__header">
        <div>
          <h1 className="activity-overview__title">Activity</h1>
          <p className="activity-overview__subtitle">
            Live operational history for wallet credits, purchase events, and monitoring checks.
          </p>
        </div>
      </header>

      <div className="activity-overview__summary">
        <article className="activity-stat">
          <span className="activity-stat__label">Processed Today</span>
          <strong className="activity-stat__value">{transactions.length} Events</strong>
          <p className="activity-stat__meta">Purchase activity and wallet updates combined.</p>
        </article>
        <article className="activity-stat">
          <span className="activity-stat__label">Confirmed Credits</span>
          <strong className="activity-stat__value">{transactions.length} Credits</strong>
          <p className="activity-stat__meta">Incoming ETH successfully received in the wallet.</p>
        </article>
        <article className="activity-stat">
          <span className="activity-stat__label">Latest Scan</span>
          <strong className="activity-stat__value">{new Date(ethData?.lastUpdate || Date.now()).toLocaleTimeString()}</strong>
          <p className="activity-stat__meta">Monitoring scheduler checked Ganache for new transfers.</p>
        </article>
      </div>

      <div className="activity-layout">
        <article className="activity-panel activity-panel--timeline">
          <div className="activity-panel__header">
            <h2>Recent Activity Feed</h2>
            <span>Newest first</span>
          </div>
          <div className="activity-feed">
            {activityFeed.map((item) => (
              <div key={item.id} className={`activity-feed__item activity-feed__item--${item.status}`}>
                <div className="activity-feed__icon">{item.icon}</div>
                <div className="activity-feed__content">
                  <div className="activity-feed__top">
                    <h3>{item.title}</h3>
                    <span>{item.time}</span>
                  </div>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="activity-panel">
          <div className="activity-panel__header">
            <h2>System Status</h2>
            <span>Monitoring</span>
          </div>
          <div className="activity-status-list">
            <div className="activity-status-item">
              <span>Wallet monitoring</span>
              <strong>Active</strong>
            </div>
            <div className="activity-status-item">
              <span>Incoming ETH filter</span>
              <strong>Enabled</strong>
            </div>
            <div className="activity-status-item">
              <span>Outgoing transfers</span>
              <strong>Disabled</strong>
            </div>
            <div className="activity-status-item">
              <span>Source</span>
              <strong>Ganache</strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default ActivityOverview;
