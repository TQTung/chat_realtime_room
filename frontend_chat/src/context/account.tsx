import { createContext, useCallback, useMemo, useState } from "react";
import Cookie from "js-cookie";
import { useAppService } from "./app-service";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export interface IAccount {
  _id: string;
  profilePicture?: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

interface IAccountContext {
  account: IAccount;
  getProfile: () => void;
  handleLogout: () => void;
  updateAccount: (payload: any) => void;
  isLoading: boolean;
  isCheckingAuth: boolean;
  connectSocket: (data?: IAccount) => void;
  onlineUsers: string[];
  socket: any;
}

export const AccountContext = createContext<IAccountContext | null>(null);

interface AccountProviderProps {
  children: React.ReactNode;
}

export const AccountProvider = ({ children }: AccountProviderProps) => {
  const { clientApi } = useAppService();
  const location = useLocation();
  const navigate = useNavigate();
  const [account, setAccount] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [socket, setSocket] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const BASE_URL =
    import.meta.env.MODE === "development" ? "http://localhost:6868" : "/";

  const handleLogout = useCallback(() => {
    Object.keys(Cookie.get()).forEach(function (cookieName) {
      Cookie.remove(cookieName);
    });
    setIsCheckingAuth(false);
    setAccount(null);
    disconnectSocket();
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const res = await clientApi.auth.getProfileApi({});
      if (res.status === "success") {
        setAccount(res.data);
        connectSocket(res?.data);
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
      setIsCheckingAuth(false);
    }
  };

  const connectSocket = useCallback(
    (account?: IAccount) => {
      if (socket?.connected) return;
      const socketInstance = io(BASE_URL, {
        query: {
          userId: account?._id || "",
        },
      });
      socketInstance.connect();
      setSocket(socketInstance);

      socketInstance.on("getOnlineUsers", (usersId: string[]) => {
        setOnlineUsers(usersId);
      });
    },
    [socket, BASE_URL, setOnlineUsers]
  );

  const disconnectSocket = useCallback(() => {
    if (socket?.connected) {
      socket.disconnect();
    }
  }, [socket]);

  const updateAccount = useCallback((payload: any) => {
    setAccount(payload);
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      account,
      getProfile,
      handleLogout,
      updateAccount,
      isCheckingAuth,
      connectSocket,
      onlineUsers,
      socket,
    }),
    [
      isLoading,
      account,
      getProfile,
      handleLogout,
      updateAccount,
      isCheckingAuth,
      connectSocket,
      onlineUsers,
      socket,
    ]
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};
