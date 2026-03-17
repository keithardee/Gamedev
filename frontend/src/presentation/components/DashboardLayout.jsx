import { useState } from "react";
import { HomeOutlined, WalletOutlined, FileTextOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import "../styles/components/DashboardLayout.css";

function DashboardLayout({ children, currentNav, onNavChange }) {
   const [isCollapsed, setIsCollapsed] = useState(false);

   const navItems = [
      { key: "dashboard", icon: <HomeOutlined />, label: "Dashboard" },
      { key: "wallet", icon: <WalletOutlined />, label: "Wallet" },
      { key: "activity", icon: <FileTextOutlined />, label: "Activity" },
   ];

   const toggleCollapse = () => {
      setIsCollapsed(!isCollapsed);
   };

   return (
      <div className="dashboard-layout">
         <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
            <div className="logo-section">
               <div className="logo-icon">
                  <FontAwesomeIcon icon={faEthereum} />
               </div>
               <h2 className="logo-text">EthMonitor</h2>
            </div>

            <nav className="sidebar-nav">
               {navItems.map((item) => (
                  <button
                     key={item.key}
                     className={`nav-item ${currentNav === item.key ? "active" : ""}`}
                     title={item.label}
                     onClick={() => onNavChange?.(item.key)}
                  >
                     <span className="nav-icon">{item.icon}</span>
                     <span className="nav-label">{item.label}</span>
                  </button>
               ))}
            </nav>

            <button className="collapse-btn" onClick={toggleCollapse} title={isCollapsed ? "Expand" : "Collapse"}>
               {isCollapsed ? <MenuOutlined /> : <CloseOutlined />}
               <span className="collapse-label">{isCollapsed ? "Expand" : "Collapse"}</span>
            </button>
         </aside>

         <main className="main-content">
            {children}
         </main>
      </div>
   );
}

export default DashboardLayout;

