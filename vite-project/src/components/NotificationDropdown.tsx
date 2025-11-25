import { Bell, MoreVertical } from "lucide-react";
import {DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem,DropdownMenuSeparator,} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notif";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const NotificationDropdown = () => {
  const { user } = useAuth();
  const { notifications, markAsRead, deleteNotif } = useNotifications(user?.userId);
  const navigate = useNavigate();
  const [open,setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

 const handleClickNotif = async (notif: any) => {

    await markAsRead(notif.id);
    setOpen(false);


    switch (notif.type) {
      // Cas des congés
      case "LEAVE_REQUEST":
        if (user?.role === "ADMIN") 
          navigate(`/admin/LeaveList`, { state: { highlightId: notif.targetId } });
        else if (user?.role === "MANAGER")
          navigate(`/manager/LeaveList`, { state: { highlightId: notif.targetId } });
        break;

      case "LEAVE_APPROVED":
      case "LEAVE_REJECTED":
        if(user?.role === "EMPLOYEE") 
          navigate(`/employee/MyLeave`, { state: { highlightId: notif.targetId } });
        else if (user?.role === "MANAGER") 
          navigate(`/manager/MyLeave`, { state: { highlightId: notif.targetId } });
        break;
      case "LEAVE_POLICY_UPDATE":
        if(user?.role === "EMPLOYEE")
          navigate(`/employee/MyLeavePolicy`,{state:{highlightId: notif.targetId}});
        else if (user?.role === "MANAGER")
          navigate(`/manager/MyleavePolicy`,{state:{highlightId: notif.targetId}})
        break;
  

      // Cas des absences
      case "ABSENCE_DECLARED":
      case "ABSENCE_VALIDATED":
      case "ABSENCE_REJECTED":
      case "ABSENCE_REPORT":
        navigate(`/absences`);
        break;

      // Cas des évaluations
      case "EVALUATION_COMPLETED":
        if(user?.role === "EMPLOYEE")
          navigate(`/employee/myPerformanceList`,{state:{highlightId:notif.targetId}});
        break;

      // Cas d’alerte performance
      case "PERFORMANCE_ALERT":
        navigate(`/dashboard/performance`);
        break;

      default:
        // targetUrl = "/";
        navigate("/");
        break;
    }
    // navigate(targetUrl);
  };
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell size={25} opacity={0.6}/>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
              {unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="border-gray-300 w-80 max-h-75 overflow-y-auto">
        <h3 className="font-semibold text-center py-2 border-b border-gray-300">Notifications</h3>

        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 py-4 text-sm">
            Aucune notification
          </p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex justify-between items-start px-3 py-3 border-b border-gray-300 hover:bg-muted/60 transition cursor-pointer ${
                notif.read ? "opacity-70" : ""
              }`}
              onClick={() => handleClickNotif(notif)}
            >
              <div className="flex-1 relative cursor-pointer">
                <p className={`text-sm ${notif.read ? "text-gray-500" : "font-medium"}`}>
                  {notif.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {notif.createdAt.slice(0, 10)}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <MoreVertical
                    size={18}
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={(e) => e.stopPropagation()} 
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-gray-300 w-40">
                  <DropdownMenuItem onClick={(e) => {e.stopPropagation();markAsRead(notif.id);}}>
                    Marquer comme lue
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600"onClick={(e) => {e.stopPropagation();deleteNotif(notif.id);}}>
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
