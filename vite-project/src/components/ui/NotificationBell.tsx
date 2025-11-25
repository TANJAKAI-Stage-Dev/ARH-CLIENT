import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const NotificationsBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Joindre la "room" du user
    socket.emit("join", user.userId);

    // Écouter les notifications reçues
    socket.on("notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, [user]);

  return (
    <div className="relative cursor-pointer">
      <Bell size={22} />
      {notifications.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
          {notifications.length}
        </span>
      )}
    </div>
  );
};
