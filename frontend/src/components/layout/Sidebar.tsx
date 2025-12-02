"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ICON_MAP, MENU } from "@/constants/menu";
import {
  Box
} from "lucide-react";

function Icon({
  name,
  className = "w-4 h-4",
  ariaHidden = true
}: {
  name?: string;
  className?: string;
  ariaHidden?: boolean;
}) {
  if (!name) return <Box className={className} aria-hidden={ariaHidden} />;
  const Cmp = ICON_MAP[name] ?? ICON_MAP["default"];
  return <Cmp className={className} aria-hidden={ariaHidden} />;
}

export default function Sidebar() {
  const pathname = usePathname() || "/";

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[14rem] text-neutral-300 border-r border-neutral-800 z-40 flex flex-col"
      aria-label="Sidebar"
    >
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="flex items-center gap-3">
          <a href="/dashboard">
            <Image
              src="/logo-full.png"
              alt={process.env.NEXT_PUBLIC_APP_NAME || "App"}
              width={180}
              height={90}
              className=""
            />
          </a>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-1 custom-scrollbar">
        <ul className="space-y-1">
          {MENU.map((item) => { 
            const active = isActive(item.href);
            return (
              <li key={item.id} className="px-1">
                <Link
                  href={item.href || "#"}
                  className={`flex items-center nav-link  gap-2 px-3 py-3 rounded-md text-sm
                      ${active ? "active" : "text-neutral-300 hover:bg-neutral-800/30"}
                    `}
                >
                  <span className="w-5 flex-shrink-0 flex items-center justify-center">
                    <Icon name={item.icon} />
                  </span>
                  <span className="flex-1 truncate text-lg">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}