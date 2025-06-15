import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import { useHomePage } from "../hooks/useHomePage";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeleton/MessageSkeleton";
import { useAccount } from "../hooks/useAccount";
import { formatMessageTime } from "../utils";

const ChatContainer = () => {
  const {
    selectedUser,
    getMessages,
    isGetMessagesLoading,
    messages,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useHomePage();
  const { account } = useAccount();
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages();
    }
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isGetMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === account._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === account._id
                      ? account.profilePicture || "/avatar.png"
                      : selectedUser?.profilePicture || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div
              className={`chat-bubble flex flex-col ${
                message.senderId === account._id
                  ? "bg-primary text-primary-content"
                  : "bg-base-200"
              }`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.content && (
                <p
                  className={`${
                    message.senderId === account._id
                      ? "text-primary-content/70"
                      : "text-base-content/70"
                  }`}
                >
                  {message.content}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
