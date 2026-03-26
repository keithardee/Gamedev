import { useState, useEffect } from "react";
import { fetchEthereumSnapshot } from "../../infrastructure/http/ethereumApi";
import { mapMonitoringSnapshot, MOCK_MONITORING_DATA } from "../services/monitoringMapper";

function getSourceWalletFromUrl() {
  if (typeof window === "undefined") {
    return "";
  }

  const params = new URLSearchParams(window.location.search);
  return (params.get("sourceWallet") || "").trim();
}

function useEthereumData() {
  const [ethData, setEthData] = useState(MOCK_MONITORING_DATA);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchEthData = async () => {
      if (isMounted) {
        setLoading(true);
      }

      try {
        const sourceWallet = getSourceWalletFromUrl();
        const snapshot = await fetchEthereumSnapshot({ sourceWallet });
        const mappedData = mapMonitoringSnapshot(snapshot);

        if (isMounted) {
          setEthData(mappedData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setEthData((current) => current || MOCK_MONITORING_DATA);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEthData();
    const pollingId = setInterval(fetchEthData, 8000);

    return () => {
      isMounted = false;
      clearInterval(pollingId);
    };
  }, []);

  return { ethData, loading, error };
}

export default useEthereumData;
