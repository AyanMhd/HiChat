import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => { 
  const { logout, authUser } = useAuthStore();

  return (
    <header className="fixed top-0 z-40 w-full border-b border-base-300 bg-base-100/90 backdrop-blur-xl">
      <div className="mx-auto h-16 w-full max-w-7xl px-4">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-75">
            <div className="size-9 rounded-lg bg-neutral flex items-center justify-center text-neutral-content">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <h1 className="text-base font-semibold">HiChat</h1>
              <p className="hidden text-[11px] text-base-content/45 sm:block">Minimal messaging</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className="btn btn-sm btn-ghost gap-2 rounded-lg"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm btn-ghost gap-2 rounded-lg">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="btn btn-sm btn-primary gap-2 rounded-lg" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
