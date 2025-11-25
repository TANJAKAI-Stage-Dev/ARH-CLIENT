import { LogOut, Moon, Sun, Settings, User, Bell } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Avatar,AvatarImage } from "./ui/avatar"
import { SidebarTrigger } from "./ui/sidebar"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { NotificationDropdown } from "./NotificationDropdown"
import { APIURL } from "@/lib/api"

const NavBar = () => {
  const { setTheme } = useTheme()
  const { user, logout } = useAuth()
  const avatar = user?.avatarUrl ? `${APIURL}${user.avatarUrl}` : "/2920.jpeg";

  return (
    <nav className="p-2.5 flex items-center top-0 left-0 z-50 justify-between shadow-md bg-white dark:bg-[#111111] dark:text-gray-100">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h1 className="font-semibold">{user?.role}</h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <NotificationDropdown/>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative cursor-pointer border-gray-400">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-gray-300">
            <DropdownMenuItem onClick={() => setTheme("light")} className="relative cursor-pointer">Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="relative cursor-pointer">Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="relative cursor-pointer">System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
              <div className="relative">
                <Avatar>
                  <AvatarImage src={avatar} className="object-cover w-10 h-10 rounded-full cursor-pointer"/>
                </Avatar>
                <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10} className="border-gray-300">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="relative cursor-pointer"><User /> <Link to={"/employee/profile"}>Profile</Link></DropdownMenuItem>
            <DropdownMenuItem className="relative cursor-pointer"><Settings /> Paramètres</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={logout}>
              <LogOut /> <Link to={"/landingPage"}>Déconnexion</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
export default NavBar
