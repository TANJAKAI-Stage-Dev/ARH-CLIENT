"use client";

import { useToast } from "../../hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-[100]">
      {toasts.map((toast, i) => (
        <div
          key={i}
          className={`p-3 rounded-lg shadow-md ${
            toast.variant === "destructive"
              ? "bg-red-600 text-white"
              : "bg-green-600 text-white"
          }`}
        >
          <strong>{toast.title}</strong>
          {toast.description && (
            <div className="text-sm">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
