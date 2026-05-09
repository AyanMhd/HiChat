import { MessageSquare, Search, Users } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-base-200/70 p-6 sm:p-10">
      <div className="w-full max-w-2xl">
        <div className="section-panel overflow-hidden">
          <div className="bg-neutral px-6 py-8 text-neutral-content sm:px-8">
            <div className="flex size-14 items-center justify-center rounded-lg bg-white text-neutral">
              <MessageSquare className="size-7" />
            </div>
            <h2 className="mt-6 text-3xl font-semibold">Pick a conversation</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/60">
              Your messages, images, replies, unread badges, and online states are organized in the inbox.
            </p>
          </div>
          <div className="grid gap-0 sm:grid-cols-2">
            <div className="border-b border-base-300 p-5 sm:border-b-0 sm:border-r">
              <Search className="mb-3 size-5" />
              <h3 className="font-semibold">Search quickly</h3>
              <p className="mt-1 text-sm leading-5 text-base-content/55">Find people from the left inbox panel.</p>
            </div>
            <div className="p-5">
              <Users className="mb-3 size-5" />
              <h3 className="font-semibold">Groups next</h3>
              <p className="mt-1 text-sm leading-5 text-base-content/55">The new layout has a place for group chats.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
