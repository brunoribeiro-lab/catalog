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
    title: "Dashboard",
    icon: "home",
    href: "/dashboard",
  },
  {
    id: "logs",
    title: "Logs",
    icon: "logs",
    href: "/logs",
  },
  {
    id: "cloud",
    title: "Servidores",
    icon: "cloud",
    href: "/servers",
  },
  {
    id: "alerts",
    title: "Alertas",
    icon: "bell",
    href: "/alerts",
  },
  {
    id: "users",
    title: "Usuários",
    icon: "users",
    href: "/users",
  },
  {
    id: "settings",
    title: "Configurações",
    icon: "settings",
    href: "/settings",
  },
  {
    id: "docs",
    title: "Documentação",
    icon: "description",
    href: "/documentation",
  },
];
