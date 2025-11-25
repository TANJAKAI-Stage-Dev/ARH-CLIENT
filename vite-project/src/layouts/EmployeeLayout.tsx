import { AppSidebar } from "../components/app-sidebar"
import NavBar from "../components/navbar"
import { ThemeProvider } from "../components/providers/theme-provider"
import { SidebarProvider } from "../components/ui/sidebar"
import { Toaster } from "sonner"
import { Outlet } from "react-router-dom"

export default function EmployeeLayout({ children }: React.ComponentProps<"div">) {
  return (
    <ThemeProvider defaultTheme="system">
      <div className="flex min-h-screen bg-gray-300 dark:bg-[#111111] text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-col flex-1">
            <NavBar />
            {/* <main className="flex-1 overflow-y-auto p-6 bg-gray-200 dark:bg-[#111111] rounded-xl transition-colors duration-300"> */}
              {children}
              <Outlet />
            {/* </main> */}
          </div>
        </SidebarProvider>
        <Toaster position="top-right" richColors/>
      </div>
    </ThemeProvider>
  )
}
