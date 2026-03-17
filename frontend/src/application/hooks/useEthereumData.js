import { useState, useEffect } from "react";

function useEthereumData() {
  const [ethData, setEthData] = useState({
    balance: 2.5,
    address: "0x742d35Cc6634C0532925a3b844Bc158e1B5a",
    lastUpdate: "Just now",
    transactions: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEthData = async () => {
      setLoading(true);
      try {
        // Replace with actual backend API call to your Node.js server
        // const response = await fetch("http://localhost:5000/api/ethereum");
        // const data = await response.json();
        // setEthData(data);

        // For now, use mock data
        setEthData({
          balance: 2.5,
          address: "0x742d35Cc6634C0532925a3b844Bc158e1B5a",
          lastUpdate: new Date().toLocaleTimeString(),
          transactions: [
            { type: "Received", amount: 0.5, time: "2 minutes ago" },
            { type: "Received", amount: 2.0, time: "15 minutes ago" },
            { type: "Received", amount: 0.3, time: "32 minutes ago" },
          ],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEthData();
  }, []);

  return { ethData, loading, error };
}

export default useEthereumData;
