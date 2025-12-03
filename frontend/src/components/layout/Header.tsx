"use client";
import {
  Menu as MenuIcon,
  Bell,
} from "lucide-react";
import LanguageSwitcher from "../language/Switcher";
import SearchBar from "../ui/SearchBar";
import UserMenu from "../ui/UserMenu";

const SIDEBAR_WIDTH_PX = 224;
const HEADER_HEIGHT = 56;

export default function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {

  return (
    <header
      className="fixed top-0 right-0 z-30"
      style={{
        left: `${SIDEBAR_WIDTH_PX}px`,
        height: `${HEADER_HEIGHT}px`,
        borderBottom: "1px solid rgba(148,163,184,0.06)",
        width: `calc(100% - ${SIDEBAR_WIDTH_PX}px)`,
      }}
    >
      <nav className="h-full flex items-center px-5 gap-3">
        {/* Toggle */}
        <button
          className="p-2 rounded-md hover:bg-neutral-800 text-neutral-300"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        {/* Central search */}
        <SearchBar />

        {/* Right icons */}
        <ul className="flex items-center gap-2">
          <li className="hidden md:block">
            <div className="p-2 rounded-md hover:bg-neutral-800 text-neutral-300">
              <LanguageSwitcher />
            </div>
          </li>
          <li className="relative">
            <button className="p-2 rounded-md hover:bg-neutral-800 text-neutral-300">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 px-1.5 text-[10px] rounded-full">5</span>
            </button>
          </li>

          {/* User dropdown */}
          <UserMenu /> 
        </ul>
      </nav>
    </header>
  );
}