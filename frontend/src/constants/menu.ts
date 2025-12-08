import { MenuItem } from "@/types/menu";
import {
  Home, 
  Box, 
  File,
  LucideIcon,
  FileTextIcon,
  Cloud,
  Bell,
  Users,
  Settings,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  home: Home,
  logs: FileTextIcon, 
  cloud: Cloud,
  bell: Bell, 
  users: Users, 
  settings: Settings,
  documentation: File,  
  default: Box,
};

export const MENU: MenuItem[] = [
  {
    id: "dashboard",
    icon: "home",
    href: "/dashboard",
  },
  {
    id: "logs",
    icon: "logs",
    href: "/logs",
  },
  {
    id: "cloud",
    icon: "cloud",
    href: "/servers",
  },
  {
    id: "alerts",
    icon: "bell",
    href: "/alerts",
  },
  {
    id: "users",
    icon: "users",
    href: "/users",
  },
  {
    id: "settings",
    icon: "settings",
    href: "/settings",
  },
  {
    id: "docs",
    icon: "description",
    href: "/documentation",
  },
];
