const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden min-h-screen items-center justify-center bg-neutral p-10 text-neutral-content lg:flex">
      <div className="w-full max-w-lg">
        <div className="mb-10">
          <p className="muted-label text-white/45">Private messaging</p>
          <h2 className="mt-4 max-w-sm text-4xl font-semibold leading-tight">{title}</h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">{subtitle}</p>
        </div>

        <div className="space-y-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-sm font-medium">Today</p>
              <p className="text-xs text-white/45">3 active conversations</p>
            </div>
            <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">Live</div>
          </div>

          <div className="ml-auto max-w-[78%] rounded-lg bg-white px-4 py-3 text-sm text-neutral">
            Clean UI makes chat feel faster.
          </div>
          <div className="max-w-[72%] rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
            Less clutter, clearer conversations.
          </div>
          <div className="ml-auto max-w-[65%] rounded-lg bg-white px-4 py-3 text-sm text-neutral">
            Exactly.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;
