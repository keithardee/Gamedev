import { useState } from "react";
import LoadingScreen from "../presentation/components/LoadingScreen";
import DashboardLayout from "../presentation/components/DashboardLayout";
import Overview from "../presentation/components/Overview";
import WalletOverview from "../presentation/components/WalletOverview";
import ActivityOverview from "../presentation/components/ActivityOverview";

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentNav, setCurrentNav] = useState("dashboard");

  const handleLoadingFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onFinish={handleLoadingFinish} />;
  }

  return (
    <DashboardLayout currentNav={currentNav} onNavChange={setCurrentNav}>
      {currentNav === "dashboard" && <Overview />}
      {currentNav === "wallet" && (
        <WalletOverview />
      )}
      {currentNav === "activity" && (
        <ActivityOverview />
      )}
    </DashboardLayout>
  );
}

export default Home;
