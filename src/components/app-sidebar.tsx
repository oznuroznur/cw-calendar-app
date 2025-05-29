import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function AppSidebar() {
  return (
    <Sidebar>
        <SidebarHeader>
        <h2 className="text-lg font-bold">Dashboard</h2>
      </SidebarHeader>
        <SidebarContent className="mt-4 space-y-2">
        <SidebarGroup>
          <Link href="/calendar-page" className="text-sm text-gray-700">Takvim</Link>
        </SidebarGroup>
        <SidebarGroup>
          <p className="text-sm text-gray-700">⚙️ Ayarlar</p>
        </SidebarGroup>
      </SidebarContent>
          <SidebarFooter className="mt-auto text-sm text-gray-400">
        © 2025
      </SidebarFooter>
    </Sidebar>
  )
}
