import { createContext, useCallback, useMemo, useState } from "react";
import { useAppService } from "./app-service";
import type { IAccount } from "./account";
import { useAccount } from "../hooks/useAccount";

interface IHomePageContext {
  isUserSideBarLoading: boolean;
  usersSideBar: IAccount[];
  selectedUser: IAccount | null;
  setSelectedUser: (user: IAccount | null) => void;
  getUserSideBar: () => void;
  getMessages: () => void;
  messages: any[];
  isGetMessagesLoading: boolean;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setMessages: (messages: any[]) => void;
}

export const HomePageContext = createContext<IHomePageContext | null>(null);

interface HomePageContextProviderProps {
  children: React.ReactNode;
}

export const HomePageContextProvider = ({
  children,
}: HomePageContextProviderProps) => {
  const { clientApi } = useAppService();
  const { socket } = useAccount();
  const [usersSideBar, setUsersSideBar] = useState<IAccount[]>([]);
  const [selectedUser, setSelectedUser] = useState<IAccount | null>(null);
  const [isUserSideBarLoading, setUserSideBarLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isGetMessagesLoading, setGetMessagesLoading] = useState(false);

  const getUserSideBar = useCallback(async () => {
    try {
      setUserSideBarLoading(true);
      const res = await clientApi.user.getUserSideBar({});
      setUsersSideBar(res.data);
    } catch (error: any) {
      console.error("Error fetching user sidebar:", error);
    } finally {
      setUserSideBarLoading(false);
    }
  }, []);

  const getMessages = useCallback(async () => {
    try {
      setGetMessagesLoading(true);
      const res = await clientApi.user.receiveMessages(
        {},
        selectedUser?._id || ""
      );
      setMessages(res.data);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
    } finally {
      setGetMessagesLoading(false);
    }
  }, [selectedUser?._id]);

  const subscribeToMessages = () => {
    if (!selectedUser?._id) return;
    socket.on("newMessage", (newMessage: any) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      setMessages((prevMessage) => [...prevMessage, newMessage]);
    });
  };

  const unsubscribeFromMessages = () => {
    socket.off("newMessage");
  };

  const value = useMemo(
    () => ({
      getUserSideBar,
      isUserSideBarLoading,
      usersSideBar,
      setSelectedUser,
      selectedUser,
      getMessages,
      messages,
      isGetMessagesLoading,
      subscribeToMessages,
      unsubscribeFromMessages,
      setMessages,
    }),
    [
      getUserSideBar,
      isUserSideBarLoading,
      usersSideBar,
      setSelectedUser,
      selectedUser,
      getMessages,
      messages,
      isGetMessagesLoading,
      subscribeToMessages,
      unsubscribeFromMessages,
      setMessages,
    ]
  );

  return (
    <HomePageContext.Provider value={value}>
      {children}
    </HomePageContext.Provider>
  );
};
