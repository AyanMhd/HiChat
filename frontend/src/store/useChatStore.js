import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { playNotificationSound } from "../lib/utils";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isReceiverTyping: false,
  unreadCounts: {}, // { oderId: count }
  replyingTo: null, // Message being replied to

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages, replyingTo } = get();
    try {
      const payload = {
        ...messageData,
        replyTo: replyingTo?._id || null,
      };
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, payload);
      set({ messages: [...messages, res.data], replyingTo: null });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  setReplyingTo: (message) => set({ replyingTo: message }),
  clearReplyingTo: () => set({ replyingTo: null }),

  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      set({
        messages: get().messages.filter((msg) => msg._id !== messageId),
      });
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete message");
    }
  },

  markMessagesAsRead: async (senderId) => {
    try {
      await axiosInstance.put(`/messages/read/${senderId}`);
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  },

  // Subscribe to messages for the currently selected user
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });

      // Immediately mark as read since the chat is already open
      get().markMessagesAsRead(selectedUser._id);
    });

    // Typing indicator listeners
    socket.on("userTyping", (senderId) => {
      if (senderId === selectedUser._id) {
        set({ isReceiverTyping: true });
      }
    });

    socket.on("userStoppedTyping", (senderId) => {
      if (senderId === selectedUser._id) {
        set({ isReceiverTyping: false });
      }
    });

    // Listen for deleted messages
    socket.on("messageDeleted", (messageId) => {
      set({
        messages: get().messages.filter((msg) => msg._id !== messageId),
      });
    });

    // Listen for read receipts
    socket.on("messagesRead", ({ readBy }) => {
      // Update all messages sent to this user to "read"
      if (readBy === selectedUser._id) {
        set({
          messages: get().messages.map((msg) =>
            msg.senderId !== selectedUser._id ? { ...msg, status: "read" } : msg
          ),
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("userTyping");
    socket.off("userStoppedTyping");
    socket.off("messageDeleted");
    socket.off("messagesRead");
    set({ isReceiverTyping: false });
  },

  // Global listener for unread message counts (runs at app level)
  subscribeToUnreadMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, unreadCounts, users } = get();
      
      // If this message is from a user we're NOT currently chatting with, increment unread
      if (!selectedUser || newMessage.senderId !== selectedUser._id) {
        // Play notification sound
        playNotificationSound();

        set({
          unreadCounts: {
            ...unreadCounts,
            [newMessage.senderId]: (unreadCounts[newMessage.senderId] || 0) + 1,
          },
        });

        // Also update the lastMessage for this sender in the users list
        const updatedUsers = users.map((user) =>
          user._id === newMessage.senderId
            ? {
                ...user,
                lastMessage: {
                  text: newMessage.text,
                  image: newMessage.image,
                  createdAt: newMessage.createdAt,
                  senderId: newMessage.senderId,
                },
              }
            : user
        );
        set({ users: updatedUsers });
      }
    });
  },

  unsubscribeFromUnreadMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  clearUnreadCount: (userId) => {
    const { unreadCounts } = get();
    const newCounts = { ...unreadCounts };
    delete newCounts[userId];
    set({ unreadCounts: newCounts });
  },

  setSelectedUser: (selectedUser) => {
    // Clear unread count when selecting a user
    if (selectedUser) {
      get().clearUnreadCount(selectedUser._id);
    }
    set({ selectedUser, isReceiverTyping: false });
  },
}));

