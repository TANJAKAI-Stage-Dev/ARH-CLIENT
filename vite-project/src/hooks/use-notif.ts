import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { APIURL } from "@/lib/api";

// const API_URL = "http://localhost:3005/api/notifications";

export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<any[]>([]);

  //Charger les notifications existantes 
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${APIURL}/api/notifications/${userId}`,{
          headers:{
            "Authorization":`Bearer ${token}`,
          }
        });
        if (!res.ok) throw new Error("Erreur lors du chargement des notifications");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, [userId]);

  //Écoute des notifications temps réel via Socket
  useEffect(() => {
    if (!userId) return;

    socket.emit("join", userId);

    socket.on("notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, [userId]);

  //Marquer une notification comme lue
  const markAsRead = async (notifId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/notifications/read`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization":`Bearer ${token}`,
         },
        body: JSON.stringify({ id: notifId }),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  //Supprimer une notification
  const deleteNotif = async (notifId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/notifications/${notifId}`, {
        method: "DELETE",
        headers:{
          "Authorization":`Bearer ${token}`,
        }
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    } catch (err) {
      console.error(err);
    }
  };

  return { notifications, markAsRead, deleteNotif };
};
