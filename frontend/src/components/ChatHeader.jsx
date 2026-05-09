import { Phone, Search, Video, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { formatLastSeen } from "../lib/utils";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = !selectedUser.isGroup && onlineUsers.includes(selectedUser._id);

  return (
    <div className="border-b border-base-300 bg-base-100 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative border border-base-300">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName || selectedUser.name} />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser.fullName || selectedUser.name}</h3>
            <p className="text-sm text-base-content/60">
              {selectedUser.isGroup
                ? `${selectedUser.memberCount || selectedUser.members?.length || 0} members`
                : isOnline
                  ? "Online"
                  : formatLastSeen(selectedUser.lastSeen)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="icon-btn hidden sm:inline-flex">
            <Search className="size-5" />
          </button>
          <button className="icon-btn hidden sm:inline-flex">
            <Phone className="size-5" />
          </button>
          <button className="icon-btn hidden sm:inline-flex">
            <Video className="size-5" />
          </button>
          <button className="icon-btn" onClick={() => setSelectedUser(null)}>
            <X className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;

