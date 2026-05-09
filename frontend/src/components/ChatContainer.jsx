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
    if (!selectedUser.isGroup) markMessagesAsRead(selectedUser._id);

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
      <div className="flex h-full flex-col overflow-hidden bg-base-100">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-base-100">
      <ChatHeader />

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-base-200/70 px-4 py-5 sm:px-6">
        {messages.map((message, index) => {
          const showDateSeparator =
            index === 0 ||
            !isSameDay(messages[index - 1].createdAt, message.createdAt);

          return (
            <div key={message._id}>
              {/* Date Separator */}
              {showDateSeparator && (
                <div className="flex items-center justify-center my-4">
                  <div className="bg-base-100 border border-base-300 text-base-content/50 text-xs px-3 py-1 rounded-full">
                    {formatDateSeparator(message.createdAt)}
                  </div>
                </div>
              )}

              {/* Message */}
              <div
                className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} group`}
                ref={messageEndRef}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border border-base-300">
                    <img
                      src={
                        message.senderId === authUser._id
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.isGroup
                            ? "/avatars/group.svg"
                            : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1 flex items-center gap-2 text-base-content/45">
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
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-base-content/40 hover:text-base-content"
                      title="Delete message"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  {/* Reply button */}
                  <button
                    onClick={() => setReplyingTo(message)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-base-content/40 hover:text-base-content"
                    title="Reply"
                  >
                    <Reply size={14} />
                  </button>
                </div>
                <div
                  className={`chat-bubble flex flex-col rounded-lg shadow-sm ${
                    message.senderId === authUser._id
                      ? "bg-neutral text-neutral-content"
                      : "bg-base-100 text-base-content border border-base-300"
                  }`}
                >
                  {/* Quoted/Reply preview */}
                  {message.replyToMessage && (
                    <div className="rounded border-l-2 border-current bg-white/10 px-2 py-1 mb-2 text-xs">
                      <span className="font-medium">
                        {message.replyToMessage.senderId === authUser._id ? "You" : selectedUser.fullName}
                      </span>
                      <p className="truncate opacity-70">
                        {message.replyToMessage.text || (message.replyToMessage.image ? "Photo" : "")}
                      </p>
                    </div>
                  )}
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="mb-2 max-h-72 rounded-md object-cover sm:max-w-[260px] cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setLightboxImage(message.image)}
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                  {/* Read receipt indicator - only for own messages */}
                  {message.senderId === authUser._id && (
                    <div className="flex justify-end mt-1">
                      {message.status === "read" ? (
                        <CheckCheck size={14} className="text-current opacity-80" />
                      ) : message.status === "delivered" ? (
                        <CheckCheck size={14} className="text-current opacity-60" />
                      ) : (
                        <Check size={14} className="text-current opacity-60" />
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
        <div className="bg-base-200/70 px-4 pb-2">
          <div className="flex items-center gap-2 text-sm text-base-content/50">
            <div className="flex items-center gap-1">
              <span className="size-2 bg-base-content/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="size-2 bg-base-content/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="size-2 bg-base-content/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
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


