import { Calendar, Home, Inbox, Search, Settings, Users, FileText, Edit, createLucideIcon, MarsStroke, icons, Icon, CopyIcon, BrainIcon, UnlockIcon, ListCheckIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { Link } from "react-router-dom"

interface MenuItem {
  title: string
  url: string
  icon: React.ElementType
}

export function AppSidebar() {
  const { user } = useAuth()

  // const baseItems: MenuItem[] = [{ title: "Home", url: "/", icon: Home }]

  const adminItems: MenuItem[] = [
    { title: "Home", url: "/", icon: Home },
    { title: "Utilisateurs", url: "/admin/User", icon: Users },
    { title: "congé", url: "/admin/LeaveList", icon: CopyIcon },
    { title: "team", url: "/admin/team", icon: BrainIcon },
    { title: "critère par team", url: "/admin/teamCriteria", icon: UnlockIcon },
    { title: "configuration du politique de congé", url: "/admin/LeavePolicy", icon: Edit },
  ]

  const managerItems: MenuItem[] = [
    { title: "Page d'acceuil", url: "/manager/dashboard", icon: Home },
    { title: "gestion de congé", url: "/manager/leaveList", icon: FileText },
    { title: "demande de congé", url: "/manager/MyLeave", icon: Calendar },
    { title: "Politique de congé", url: "/manager/MyLeavePolicy", icon: Calendar },
    { title: "Statistique congé", url: "/manager/LeaveStat", icon: ListCheckIcon },
    { title: "Evaluation des employées", url: "/manager/performanceList", icon: Calendar },
    { title: "Evaluation tableau de bord", url: "/manager/performanceDash", icon: Calendar },
    { title: "gestion des abscences", url: "/manager/absence", icon: FileText },

  ]

  const employeeItems: MenuItem[] = [
    { title: "Faire une demande", url: "/employee/MyLeave", icon: Calendar },
    { title: "Politique de congé", url: "/employee/MyLeavePolicy", icon: Calendar },
    { title: "Mes performances", url: "/employee/MyPerformanceList", icon: ListCheckIcon },

  ]

  let roleItems: MenuItem[] = []
  if (user?.role === "SUPERADMIN" || user?.role === "ADMIN" ) roleItems = adminItems
  else if (user?.role === "MANAGER") roleItems = managerItems
  else if (user?.role === "EMPLOYEE") roleItems = employeeItems


  const items = [ ...roleItems]

  return (
    <Sidebar
      collapsible="icon"
      className="bg-gray-100 dark:bg-[#1a1a1a] dark:border-gray-800 transition-colors duration-300"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 dark:text-gray-400">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-gray-200 dark:hover:bg-[#1f1f1f] rounded-md"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="text-gray-600 dark:text-gray-400" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
