import { useEffect } from "react";
import { useAccount } from "./hooks/useAccount";
import Navbar from "./components/Navbar";
import Routers from "./routers";
import { Loader } from "lucide-react";
import { useThemeStore } from "./hooks/useTheme";

const MainLayout = () => {
  const { getProfile, isCheckingAuth, account } = useAccount();
  const { theme } = useThemeStore();

  useEffect(() => {
    getProfile();
  }, []);

  if (isCheckingAuth && !account) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routers />
    </div>
  );
};

export default MainLayout;
