import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface UserPayload {
  userId: string;
  role: string;
  email: string;
  exp: number;
  avatarUrl?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const decoded = jwtDecode<UserPayload>(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        setUser(null);
      } else {
        setUser(decoded);
      }
    } catch (error) {
      console.error("Erreur de décodage du token:", error);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  useEffect(() => {
    loadUserFromToken();
    setLoading(false);

    // synchronisation avec d'autres composants
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user-avatar") {
        setUser((prev) =>
          prev ? { ...prev, avatarUrl: event.newValue || "" } : prev
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateAvatar = (newAvatarUrl: string) => {
    if (!user) return;
    setUser({ ...user, avatarUrl: newAvatarUrl });
    localStorage.setItem("user-avatar", newAvatarUrl);

    // informer les autres composants de la maj
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "user-avatar",
        newValue: newAvatarUrl,
      })
    );
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user-avatar");
    setUser(null);
  };

  return {
    user,
    updateAvatar,
    isAuthenticated: !!user,
    loading,
    logout,
  };
};
