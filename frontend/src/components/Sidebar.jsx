import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Plus, Search, Users, X } from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const Sidebar = () => {
  const {
    createGroup,
    getGroups,
    getUsers,
    groups,
    isGroupsLoading,
    isUsersLoading,
    selectedUser,
    setSelectedUser,
    unreadCounts,
    users,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("direct");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getGroups, getUsers]);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesOnline = showOnlineOnly ? onlineUsers.includes(user._id) : true;
        return matchesSearch && matchesOnline;
      }),
    [onlineUsers, searchQuery, showOnlineOnly, users]
  );

  const filteredGroups = useMemo(
    () => groups.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [groups, searchQuery]
  );

  const toggleMember = (userId) => {
    setSelectedMemberIds((current) =>
      current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId]
    );
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const createdGroup = await createGroup({ name: groupName, memberIds: selectedMemberIds });
    if (!createdGroup) return;
    setGroupName("");
    setSelectedMemberIds([]);
    setShowCreateGroup(false);
    setActiveTab("groups");
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="flex h-full w-20 shrink-0 border-r border-base-300 bg-base-100 lg:w-[360px]">
      <div className="hidden w-16 flex-col items-center gap-3 border-r border-base-300 bg-neutral py-4 text-neutral-content lg:flex">
        <div className="flex size-10 items-center justify-center rounded-lg bg-white text-neutral">
          <MessageCircle className="size-5" />
        </div>
        <button
          className="mt-2 flex size-10 items-center justify-center rounded-lg bg-white/10 text-white/70"
          onClick={() => setActiveTab("groups")}
        >
          <Users className="size-5" />
        </button>
        <button
          className="flex size-10 items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20"
          onClick={() => setShowCreateGroup(true)}
        >
          <Plus className="size-5" />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-base-300 p-3 lg:p-5">
          <div className="flex flex-col items-center gap-2 lg:hidden">
            <button className="icon-btn" onClick={() => setActiveTab(activeTab === "direct" ? "groups" : "direct")}>
              {activeTab === "direct" ? <Users className="size-5" /> : <MessageCircle className="size-5" />}
            </button>
            <button className="icon-btn" onClick={() => setShowCreateGroup(true)}>
              <Plus className="size-5" />
            </button>
          </div>

          <div className="hidden lg:block">
            <p className="muted-label">Inbox</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">Messages</h2>
                <p className="mt-1 text-sm text-base-content/50">{Math.max(onlineUsers.length - 1, 0)} people online</p>
              </div>
              <button className="btn btn-primary btn-sm rounded-lg" onClick={() => setShowCreateGroup(true)}>
                <Plus className="size-4" />
                Group
              </button>
            </div>
          </div>

          <div className="mt-5 hidden rounded-lg border border-base-300 bg-base-200 p-1 lg:grid lg:grid-cols-2">
            <button
              className={`btn btn-sm rounded-md border-0 ${activeTab === "direct" ? "bg-base-100 shadow-sm" : "btn-ghost"}`}
              onClick={() => setActiveTab("direct")}
            >
              Direct
            </button>
            <button
              className={`btn btn-sm rounded-md border-0 ${activeTab === "groups" ? "bg-base-100 shadow-sm" : "btn-ghost"}`}
              onClick={() => setActiveTab("groups")}
            >
              Groups
            </button>
          </div>

          <div className="mt-4 hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-base-content/35" />
              <input
                type="text"
                placeholder={activeTab === "direct" ? "Search people" : "Search groups"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mono-input input-sm pl-9 pr-8"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          {activeTab === "direct" && (
            <label className="mt-3 hidden cursor-pointer items-center gap-2 text-sm text-base-content/60 lg:flex">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm rounded"
              />
              Online only
            </label>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto py-2">
          {activeTab === "direct" &&
            filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`group flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-base-200 lg:px-5 ${
                  selectedUser?._id === user._id ? "bg-base-200" : ""
                }`}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="size-11 rounded-full border border-base-300 object-cover lg:size-12"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 size-3 rounded-full bg-base-content ring-2 ring-base-100" />
                  )}
                  {unreadCounts[user._id] > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-base-content text-xs font-bold text-base-100">
                      {unreadCounts[user._id] > 9 ? "9+" : unreadCounts[user._id]}
                    </span>
                  )}
                </div>

                <div className="hidden min-w-0 flex-1 lg:block">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-medium">{user.fullName}</p>
                    <span className="text-[11px] text-base-content/35">now</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-base-content/50">
                    {user.lastMessage ? (
                      user.lastMessage.image && !user.lastMessage.text ? (
                        "Photo"
                      ) : (
                        user.lastMessage.text
                      )
                    ) : (
                      "No messages yet"
                    )}
                  </p>
                </div>
              </button>
            ))}

          {activeTab === "groups" &&
            filteredGroups.map((group) => (
              <button
                key={group._id}
                onClick={() => setSelectedUser(group)}
                className={`group flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-base-200 lg:px-5 ${
                  selectedUser?._id === group._id ? "bg-base-200" : ""
                }`}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={group.profilePic || "/avatars/group.svg"}
                    alt={group.name}
                    className="size-11 rounded-lg border border-base-300 object-cover lg:size-12"
                  />
                  {unreadCounts[`group:${group._id}`] > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-base-content text-xs font-bold text-base-100">
                      {unreadCounts[`group:${group._id}`] > 9 ? "9+" : unreadCounts[`group:${group._id}`]}
                    </span>
                  )}
                </div>

                <div className="hidden min-w-0 flex-1 lg:block">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-medium">{group.name}</p>
                    <span className="text-[11px] text-base-content/35">{group.memberCount} members</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-base-content/50">
                    {group.lastMessage
                      ? group.lastMessage.image && !group.lastMessage.text
                        ? "Photo"
                        : group.lastMessage.text
                      : "No group messages yet"}
                  </p>
                </div>
              </button>
            ))}

          {activeTab === "groups" && !isGroupsLoading && filteredGroups.length === 0 && (
            <div className="hidden px-5 py-12 text-center lg:block">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg border border-base-300 bg-base-200">
                <Users className="size-5" />
              </div>
              <h3 className="font-semibold">Create your first group</h3>
              <p className="mt-2 text-sm leading-6 text-base-content/55">
                Group chats are now functional. Add a name and choose members to start one.
              </p>
              <button className="btn btn-primary btn-sm mt-4 rounded-lg" onClick={() => setShowCreateGroup(true)}>
                <Plus className="size-4" />
                Create group
              </button>
            </div>
          )}

          {activeTab === "direct" && filteredUsers.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-base-content/50">
              {searchQuery ? "No matching people found." : "No online users right now."}
            </div>
          )}
        </div>
      </div>

      {showCreateGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleCreateGroup} className="section-panel w-full max-w-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="muted-label">New group</p>
                <h3 className="mt-1 text-xl font-semibold">Create group chat</h3>
              </div>
              <button type="button" className="icon-btn" onClick={() => setShowCreateGroup(false)}>
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-5 space-y-2">
              <label className="field-label">Group name</label>
              <input
                className="mono-input"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Project team"
              />
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <label className="field-label">Members</label>
                <span className="text-xs text-base-content/45">{selectedMemberIds.length} selected</span>
              </div>
              <div className="max-h-64 overflow-y-auto rounded-lg border border-base-300">
                {users.map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    className="flex w-full items-center gap-3 border-b border-base-300 px-3 py-3 text-left last:border-b-0 hover:bg-base-200"
                    onClick={() => toggleMember(user._id)}
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm rounded"
                      checked={selectedMemberIds.includes(user._id)}
                      readOnly
                    />
                    <img src={user.profilePic || "/avatars/male.svg"} alt="" className="size-9 rounded-full" />
                    <span className="font-medium">{user.fullName}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="btn btn-ghost rounded-lg" onClick={() => setShowCreateGroup(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary rounded-lg">
                Create group
              </button>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
