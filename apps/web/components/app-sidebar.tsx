"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@workspace/ui/components/sidebar"
import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react"
import * as React from "react"
import MainNav from "./main-nav"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Utilities",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Tradekit",
          url: "tradekit",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
      url: "#",
    },
    {
      title: "Pokemon",
      icon: Bot,
      items: [
        {
          title: "List",
          url: "/pokemon",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
      url: "#",
    },
    {
      title: "Next",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <MainNav items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
