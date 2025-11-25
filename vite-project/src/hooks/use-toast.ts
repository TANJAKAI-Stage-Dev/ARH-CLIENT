import * as React from "react";

export function useToast() {
  const [toasts, setToasts] = React.useState<
    { title?: string; description?: string; variant?: "default" | "destructive" }[]
  >([]);

  const toast = (toast: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => setToasts((prev) => prev.slice(1)), 3000);
  };

  return { toast, toasts };
}
