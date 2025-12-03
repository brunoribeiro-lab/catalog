"use client";

import { useState, useRef, useEffect } from "react";
import {
  Menu as MenuIcon,
  Search,
  X,
  Bell,
  User,
  Settings,
  LayoutDashboard,
  LogOut,
  User2,
} from "lucide-react";
import LanguageSwitcher from "../language/Switcher";
import Image from "next/image";

const SIDEBAR_WIDTH_PX = 224;
const HEADER_HEIGHT = 56;

export default function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdown, setDropdown] = useState<null | string>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const avatarSrc = null; // dps implementar isso
  const avatarAlt = "user";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (menu: string) => {
    setDropdown(dropdown === menu ? null : menu);
  };

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

        {/* Central search (centered visually via max-w & margin) */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-3xl">
            <input
              onFocus={() => setSearchOpen(true)}
              placeholder="Search"
              className="hidden lg:block w-full bg-[#181b1b] border border-neutral-700/60 rounded-full py-2 pl-10 pr-10 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none"
              type="text"
            />
            <span className="hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              <Search className="w-4 h-4" />
            </span>
            
            {searchOpen && (
              <button
                onClick={() => setSearchOpen(false)}
                className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                aria-label="close search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right icons */}
        <ul className="flex items-center gap-2">
          <li className="hidden md:block">
            <button className="p-2 rounded-md hover:bg-neutral-800 text-neutral-300">
              <LanguageSwitcher />
            </button>
          </li>
          <li className="relative">
            <button className="p-2 rounded-md hover:bg-neutral-800 text-neutral-300">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 px-1.5 text-[10px] rounded-full">5</span>
            </button>
          </li>

          {/* User dropdown */}
          <li className="ml-2 relative" ref={dropdownRef}>
            <button
              onClick={() => toggleDropdown("user")}
              className="rounded-full overflow-hidden border border-neutral-700 hover:border-neutral-500 transition-colors w-9 h-9 flex items-center justify-center bg-neutral-800"
            >
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                  alt={avatarAlt}
                />
              ) : (
                <User2 className="w-6 h-6 text-neutral-300" />
              )}
            </button>

            {/* Dropdown menu */}
            {dropdown === "user" && (
              <div className="absolute right-0 top-full mt-2 w-64 dropdown-menu rounded-lg shadow-xl z-50">
                {/* User info */}
                <div className="dropdown-item gap-2 py-4 px-4 block hover:bg-transparent cursor-default">
                  <div className="text-center">
                    {avatarSrc ? (
                      <Image
                        src={avatarSrc}
                        className="rounded-full p-1 shadow-lg mb-3 mx-auto border-2 border-gray-600"
                        width="90"
                        height="90"
                        alt="Profile"
                      />
                    ) : (
                      <div className="mb-3 mx-auto w-[90px] h-[90px] rounded-full p-1 shadow-lg border-2 border-gray-600 flex items-center justify-center bg-gray-700">
                        <User2 className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    <h5 className="user-name mb-0 font-bold text-white text-lg">Bruno Ribeiro</h5>
                  </div>
                </div>

                <hr className="dropdown-divider border-gray-700 my-1" />

                {/* Menu items */}
                <a href="/profile" className="dropdown-item d-flex align-items-center gap-2 py-3 px-4 text-gray-300 hover:bg-gray-700 flex items-center">
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </a>

                <a href="/settings" className="dropdown-item d-flex align-items-center gap-2 py-3 px-4 text-gray-300 hover:bg-gray-700 flex items-center">
                  <Settings className="w-5 h-5" />
                  <span>Setting</span>
                </a>

                <a href="/dashboard" className="dropdown-item d-flex align-items-center gap-2 py-3 px-4 text-gray-300 hover:bg-gray-700 flex items-center">
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </a> 

                <hr className="dropdown-divider border-gray-700 my-1" />

                <a href="/logout" className="dropdown-item d-flex align-items-center gap-2 py-3 px-4 text-gray-300 hover:bg-gray-700 flex items-center">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </a>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}