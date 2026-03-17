import { useEffect } from "react";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import "../styles/components/LoadingScreen.css";

function LoadingScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="loading-icon-wrapper">
          <SafetyCertificateOutlined className="loading-icon" />
        </div>
        <h1 className="loading-title">Ethereum Monitor</h1>
        <p className="loading-subtitle">Connected to Ganache</p>
        
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;

