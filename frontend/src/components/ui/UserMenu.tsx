'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getAuthUser } from '@/services/auth/session';
import type { AuthUserCookie } from '@/types/authUserCookie';
import { initials } from '@/utils/initials';
import {
  User,
  Settings,
  LogOut,
  User2,
  LayoutDashboard
} from 'lucide-react'

export default function UserMenu() {
  const [dropdown, setDropdown] = useState<null | string>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const t = useTranslations();

  const [user, setUser] = useState<AuthUserCookie | null>(null);
  const [loading, setLoading] = useState(true);

  const avatarSrc: string | null = null;

  const toggleDropdown = (menu: string) => {
    setDropdown(dropdown === menu ? null : menu);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await getAuthUser();
        if (!mounted) return;
        setUser(u);
      } catch (err) {
        console.error(err)
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
        aria-label="User menu"
      >
        {avatarSrc ? (
          <Image
            src={avatarSrc}
            width={36}
            height={36}
            className="w-full h-full object-cover"
            alt={user?.name ?? "user"}
          />
        ) : (
          loading ? (
            <User2 className="w-6 h-6 text-neutral-300" />
          ) : (
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-700">
              <span className="text-sm font-semibold text-gray-200">
                {initials(user?.name || undefined)}
              </span>
            </div>
          )
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
                  width={90}
                  height={90}
                  alt={user?.name ?? "Profile"}
                />
              ) : (
                <div className="mb-3 mx-auto w-[90px] h-[90px] rounded-full p-1 shadow-lg border-2 border-gray-600 flex items-center justify-center bg-gray-700">
                  {loading ? (
                    <User2 className="w-16 h-16 text-gray-300" />
                  ) : (
                    <span className="text-3xl font-semibold text-gray-200">
                      {initials(user?.name || undefined)}
                    </span>
                  )}
                </div>
              )}

              <h5 className="user-name mb-0 font-bold text-white text-lg">
                {loading ? t("common.loading") : user?.name ?? t("common.user")}
              </h5>
              {user?.email && (
                <p className="text-xs text-gray-400 mt-1">{user.email}</p>
              )}
            </div>
          </div>

          <hr className="dropdown-divider border-gray-700 my-1" />

          {/* Menu items */}
          <a href="/profile" className="dropdown-item d-flex align-items-center gap-2 py-3 px-4 text-gray-300 hover:bg-gray-700 flex items-center">
            <User className="w-5 h-5" />
            <span>{t("menu.profile")}</span>
          </a>

          <a href="/settings" className="dropdown-item d-flex align-items-center gap-2 py-3 px-4 text-gray-300 hover:bg-gray-700 flex items-center">
            <Settings className="w-5 h-5" />
            <span>{t("menu.settings")}</span>
          </a>

          <a href="/dashboard" className="dropdown-item d-flex align-items-center gap-2 py-3 px-4 text-gray-300 hover:bg-gray-700 flex items-center">
            <LayoutDashboard className="w-5 h-5" />
            <span>{t("menu.dashboard")}</span>
          </a>

          <hr className="dropdown-divider border-gray-700 my-1" />

          <a href="/logout" className="dropdown-item d-flex align-items-center gap-2 py-3 px-4 text-gray-300 hover:bg-gray-700 flex items-center">
            <LogOut className="w-5 h-5" />
            <span>{t("menu.logout")}</span>
          </a>
        </div>
      )}
    </li>
  )
}
