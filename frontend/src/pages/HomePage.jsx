import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <main className="workspace-backdrop relative h-screen overflow-hidden px-2 sm:px-4">
      <div className="pointer-events-none absolute left-8 top-28 hidden w-40 rounded-lg p-4 xl:block workspace-glass">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/35">Presence</p>
        <p className="mt-3 text-2xl font-semibold text-white">Live</p>
        <p className="mt-1 text-xs leading-5">Clean workspace for focused conversations.</p>
      </div>

      <div className="pointer-events-none absolute bottom-10 right-8 hidden w-48 rounded-lg p-4 xl:block workspace-glass">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/35">HiChat</p>
        <div className="mt-4 space-y-2">
          <div className="h-2 w-3/4 rounded-full bg-white/30" />
          <div className="h-2 w-1/2 rounded-full bg-white/15" />
          <div className="h-2 w-2/3 rounded-full bg-white/20" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] items-end pb-4 pt-20">
        <div className="section-panel h-[calc(100vh-6rem)] w-full overflow-hidden border-white/10 bg-base-100/95 shadow-2xl">
          <div className="flex h-full">
            <Sidebar />
            <section className="min-w-0 flex-1">{!selectedUser ? <NoChatSelected /> : <ChatContainer />}</section>
          </div>
        </div>
      </div>
    </main>
  );
};
export default HomePage;
