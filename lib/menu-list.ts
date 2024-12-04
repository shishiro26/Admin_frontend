import { Users, Waypoints, BusFront, LucideIcon } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(): Group[] {
  return [
    {
      groupLabel: "Routes",
      menus: [
        {
          href: "/admin/users",
          label: "Users",
          icon: Users,
        },
        {
          href: "/admin/buses",
          label: "Buses",
          icon: BusFront,
        },
        {
          href: "/admin/city",
          label: "Stops",
          icon: Waypoints,
        },
      ],
    },
  ];
}
