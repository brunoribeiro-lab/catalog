'use client'
import { useEffect, useRef, useState } from 'react'
import {
  User,
  Settings,
  LogOut,
  User2,
  LayoutDashboard
} from 'lucide-react'
import Image from 'next/image';

export default function UserMenu() {
  const [dropdown, setDropdown] = useState<null | string>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const avatarSrc = null; // dps implementar isso
  const avatarAlt = "user";
  const toggleDropdown = (menu: string) => {
    setDropdown(dropdown === menu ? null : menu);
  };

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

  return (
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
  )
}