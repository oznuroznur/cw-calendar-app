import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Calendar, FolderUp, Settings } from "lucide-react"

export function AppSidebar() {
  return (
     <Sidebar collapsible="offcanvas" variant="sidebar">
      <SidebarHeader>
         <Link href="/">
        <h2 className="text-lg font-bold px-2">Dashboard</h2>
        </Link>
      </SidebarHeader>

      <SidebarContent className="mt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/calendar-page">
                    <Calendar className="size-4" />
                    <span>Takvim</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/file-processor">
                    <FolderUp className="size-4" />
                    <span>File Processor</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/settings">
                    <Settings className="size-4" />
                    <span>Ayarlar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto text-sm text-gray-400 px-2">© 2025</SidebarFooter>
    </Sidebar>
  )
}
