import { Send, SlidersHorizontal } from "lucide-react";
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Can you review the final screen?", isSent: false },
  { id: 2, content: "Yes. The layout is much cleaner now.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <main className="page-shell">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="muted-label">Preferences</p>
            <h1 className="mt-2 text-3xl font-semibold">Settings</h1>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm text-base-content/60">
            <SlidersHorizontal className="size-4" />
            Interface controls
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="section-panel p-5">
            <h2 className="text-lg font-semibold">Theme</h2>
            <p className="mt-1 text-sm leading-6 text-base-content/55">
              The app is designed around a restrained monochrome system. Choose the version that feels best.
            </p>

            <div className="mt-5 grid gap-3">
              {THEMES.map((t) => (
                <button
                  key={t}
                  className={`flex items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                    theme === t ? "border-base-content bg-base-200" : "border-base-300 hover:bg-base-200"
                  }`}
                  onClick={() => setTheme(t)}
                >
                  <div>
                    <p className="font-medium">{t.charAt(0).toUpperCase() + t.slice(1)}</p>
                    <p className="text-xs text-base-content/45">Black, white, and neutral surfaces</p>
                  </div>
                  <div className="flex gap-1" data-theme={t}>
                    <span className="size-5 rounded-full bg-base-100 border border-base-300" />
                    <span className="size-5 rounded-full bg-base-200 border border-base-300" />
                    <span className="size-5 rounded-full bg-neutral" />
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="section-panel overflow-hidden">
            <div className="border-b border-base-300 p-5">
              <p className="muted-label">Preview</p>
              <h2 className="mt-2 text-xl font-semibold">Conversation style</h2>
            </div>

            <div className="bg-base-200 p-5">
              <div className="mx-auto max-w-xl overflow-hidden rounded-lg border border-base-300 bg-base-100">
                <div className="border-b border-base-300 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-neutral text-sm font-semibold text-neutral-content">
                      J
                    </div>
                    <div>
                      <h3 className="font-medium">John Doe</h3>
                      <p className="text-xs text-base-content/50">Online</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-base-200/70 p-4">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div key={message.id} className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 shadow-sm ${
                          message.isSent
                            ? "bg-neutral text-neutral-content"
                            : "border border-base-300 bg-base-100 text-base-content"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="mt-2 text-[10px] opacity-55">12:00 PM</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-base-300 p-4">
                  <div className="flex gap-2">
                    <input className="mono-input input-sm flex-1 bg-base-200" value="This is a preview" readOnly />
                    <button className="btn btn-primary btn-sm rounded-lg">
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;
