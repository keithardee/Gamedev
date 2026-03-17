import { ClockCircleOutlined, CheckCircleOutlined, ShoppingCartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import "../styles/components/ActivityOverview.css";

function ActivityOverview() {
  const activityFeed = [
    {
      id: 1,
      title: "Gem purchase credited",
      description: "Player_Alpha purchased 500 gems and sent 0.50 ETH to the developer wallet.",
      time: "2 minutes ago",
      icon: <ShoppingCartOutlined />,
      status: "success",
    },
    {
      id: 2,
      title: "Wallet balance updated",
      description: "Revenue wallet balance increased after confirmed incoming transaction.",
      time: "8 minutes ago",
      icon: <ThunderboltOutlined />,
      status: "success",
    },
    {
      id: 3,
      title: "Block confirmation completed",
      description: "Ganache confirmed the latest gem purchase transfer to the system wallet.",
      time: "11 minutes ago",
      icon: <CheckCircleOutlined />,
      status: "success",
    },
    {
      id: 4,
      title: "Monitoring cycle executed",
      description: "Activity tracker scanned for new incoming ETH transactions from game purchases.",
      time: "18 minutes ago",
      icon: <ClockCircleOutlined />,
      status: "neutral",
    },
  ];

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
          <strong className="activity-stat__value">27 Events</strong>
          <p className="activity-stat__meta">Purchase activity and wallet updates combined.</p>
        </article>
        <article className="activity-stat">
          <span className="activity-stat__label">Confirmed Credits</span>
          <strong className="activity-stat__value">14 Credits</strong>
          <p className="activity-stat__meta">Incoming ETH successfully received in the wallet.</p>
        </article>
        <article className="activity-stat">
          <span className="activity-stat__label">Latest Scan</span>
          <strong className="activity-stat__value">18:42 PM</strong>
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
