import { useState } from "react";
import LoadingScreen from "../presentation/components/LoadingScreen";
import DashboardLayout from "../presentation/components/DashboardLayout";
import Overview from "../presentation/components/Overview";
import WalletOverview from "../presentation/components/WalletOverview";
import ActivityOverview from "../presentation/components/ActivityOverview";
import useEthereumData from "../application/hooks/useEthereumData";

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentNav, setCurrentNav] = useState("dashboard");
  const { ethData, loading, error } = useEthereumData();

  const handleLoadingFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onFinish={handleLoadingFinish} />;
  }

  return (
    <DashboardLayout currentNav={currentNav} onNavChange={setCurrentNav}>
      {currentNav === "dashboard" && <Overview ethData={ethData} loading={loading} error={error} />}
      {currentNav === "wallet" && (
        <WalletOverview ethData={ethData} loading={loading} error={error} />
      )}
      {currentNav === "activity" && (
        <ActivityOverview ethData={ethData} loading={loading} error={error} />
      )}
    </DashboardLayout>
  );
}

export default Home;
