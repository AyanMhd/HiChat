import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { playNotificationSound } from "../lib/utils";
//whole zustand cover 
//one time pass of set and get
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  groups: [],
  selectedUser: null,
  isUsersLoading: false,
  isGroupsLoading: false,
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

  getGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups");
      set({ groups: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  createGroup: async ({ name, memberIds }) => {
    try {
      const res = await axiosInstance.post("/groups", { name, memberIds });
      set({ groups: [res.data, ...get().groups], selectedUser: res.data });
      toast.success("Group created");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
      return null;
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const { selectedUser } = get();
      const res = selectedUser?.isGroup
        ? await axiosInstance.get(`/groups/${userId}/messages`)
        : await axiosInstance.get(`/messages/${userId}`);
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
      const res = selectedUser?.isGroup
        ? await axiosInstance.post(`/groups/${selectedUser._id}/messages`, payload)
        : await axiosInstance.post(`/messages/send/${selectedUser._id}`, payload);
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
    if (get().selectedUser?.isGroup) return;
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
      if (selectedUser.isGroup) return;
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });

      // Immediately mark as read since the chat is already open
      get().markMessagesAsRead(selectedUser._id);
    });

    socket.on("newGroupMessage", (newMessage) => {
      if (!selectedUser.isGroup || newMessage.groupId !== selectedUser._id) return;
      set({ messages: [...get().messages, newMessage] });
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
    socket.off("newGroupMessage");
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

    socket.on("newGroupMessage", (newMessage) => {
      const { selectedUser, unreadCounts, groups } = get();
      const groupKey = `group:${newMessage.groupId}`;
      if (!selectedUser || !selectedUser.isGroup || selectedUser._id !== newMessage.groupId) {
        playNotificationSound();
        set({
          unreadCounts: {
            ...unreadCounts,
            [groupKey]: (unreadCounts[groupKey] || 0) + 1,
          },
          groups: groups.map((group) =>
            group._id === newMessage.groupId
              ? {
                  ...group,
                  lastMessage: {
                    text: newMessage.text,
                    image: newMessage.image,
                    createdAt: newMessage.createdAt,
                    senderId: newMessage.senderId,
                  },
                }
              : group
          ),
        });
      }
    });

    socket.on("groupCreated", (group) => {
      const exists = get().groups.some((existingGroup) => existingGroup._id === group._id);
      if (!exists) set({ groups: [group, ...get().groups] });
    });
  },

  unsubscribeFromUnreadMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("newGroupMessage");
      socket.off("groupCreated");
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
      get().clearUnreadCount(selectedUser.isGroup ? `group:${selectedUser._id}` : selectedUser._id);
    }
    set({ selectedUser, isReceiverTyping: false });
  },
}));

