import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ImageLightbox from "./ImageLightbox";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime, formatDateSeparator, isSameDay } from "../lib/utils";
import { Trash2, Check, CheckCheck, Reply } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    isReceiverTyping,
    deleteMessage,
    markMessagesAsRead,
    setReplyingTo,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    markMessagesAsRead(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages, markMessagesAsRead]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
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
        {messages.map((message, index) => {
          const showDateSeparator =
            index === 0 ||
            !isSameDay(messages[index - 1].createdAt, message.createdAt);

          return (
            <div key={message._id}>
              {/* Date Separator */}
              {showDateSeparator && (
                <div className="flex items-center justify-center my-4">
                  <div className="bg-base-300 text-zinc-400 text-xs px-3 py-1 rounded-full">
                    {formatDateSeparator(message.createdAt)}
                  </div>
                </div>
              )}

              {/* Message */}
              <div
                className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} group`}
                ref={messageEndRef}
              >
                <div className=" chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        message.senderId === authUser._id
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1 flex items-center gap-2">
                  <time className="text-xs opacity-50">
                    {formatMessageTime(message.createdAt)}
                  </time>
                  {/* Delete button - only for own messages */}
                  {message.senderId === authUser._id && (
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this message?")) {
                          deleteMessage(message._id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-500"
                      title="Delete message"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  {/* Reply button */}
                  <button
                    onClick={() => setReplyingTo(message)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-base-content/50 hover:text-base-content"
                    title="Reply"
                  >
                    <Reply size={14} />
                  </button>
                </div>
                <div className="chat-bubble flex flex-col">
                  {/* Quoted/Reply preview */}
                  {message.replyToMessage && (
                    <div className="bg-base-300/50 rounded px-2 py-1 mb-2 text-xs border-l-2 border-primary">
                      <span className="text-primary font-medium">
                        {message.replyToMessage.senderId === authUser._id ? "You" : selectedUser.fullName}
                      </span>
                      <p className="truncate opacity-70">
                        {message.replyToMessage.text || (message.replyToMessage.image ? "📷 Photo" : "")}
                      </p>
                    </div>
                  )}
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setLightboxImage(message.image)}
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                  {/* Read receipt indicator - only for own messages */}
                  {message.senderId === authUser._id && (
                    <div className="flex justify-end mt-1">
                      {message.status === "read" ? (
                        <CheckCheck size={14} className="text-blue-400" />
                      ) : message.status === "delivered" ? (
                        <CheckCheck size={14} className="text-zinc-400" />
                      ) : (
                        <Check size={14} className="text-zinc-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Typing Indicator */}
      {isReceiverTyping && (
        <div className="px-4 pb-1">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <div className="flex items-center gap-1">
              <span className="size-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="size-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="size-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
            <span>{selectedUser.fullName} is typing...</span>
          </div>
        </div>
      )}

      <MessageInput />

      {/* Image Lightbox */}
      <ImageLightbox
        imageUrl={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
};
export default ChatContainer;


