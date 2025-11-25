import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {Input} from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { APIURL } from "@/lib/api";

export default function Login({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  const login = async () => {
    if (!form.email || !form.password) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${APIURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        const role = data.user?.role?.toUpperCase?.() || "USER";
        setTimeout(() => {
          if (role === "ADMIN") navigate("/admin/dashboard");
          else if (role === "MANAGER") navigate("/manager/dashboard");
          else navigate("/employee/dashboard");
        }, 1000);
      } else {
        alert(data.message || "Email ou mot de passe incorrect");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau, veuillez réessayer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-200 flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="bg-muted relative hidden md:flex justify-center items-center">
                <img
                  src="/public/images/login.png"
                  alt="Image"
                  className="inset-0 h-60 w-60 object-contain dark:brightness-[0.2] dark:grayscale"
                />
              </div>

              <form
                className="p-6 md:p-8 flex flex-col gap-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  login();
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Login</h1>
                  <p className="text-muted-foreground text-balance">
                    Accédez à votre espace de travail
                  </p>
                </div>

                <div className="grid gap-3">
                  <Input
                    id="email"
                    label="Email"
                    bgColor="#ffffff"
                    type="email"
                    value={form.email}
                    onChange={(val) => handleChange("email", val)}
                  />
                </div>

                <div className="grid gap-3">
                  <div className="relative">
                    <Input
                      id="password"
                      label="Mot de passe"
                      bgColor="#ffffff"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(val) => handleChange("password", val)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} className="absolute right-1 top-8"/> : <Eye size={18} className="absolute right-1 top-8"/>}
                    </button>
                  </div>

                  <div className="flex items-center justify-end">
                    <a
                      href="#"
                      className="text-sm underline-offset-2 hover:underline text-blue-600"
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>
                </div>

                <Button label="login" variant={"success"} disabled={loading} onClick={login}/>

                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">ou</span>
                </div>

                <div className="text-center text-sm">
                  Vous n'avez pas encore de compte ?
                  <span
                    className="text-blue-600 cursor-pointer hover:underline ml-1"
                    onClick={() => navigate("/register")}
                  >
                    Créez-en un
                  </span>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-muted-foreground text-center text-xs text-balance">
            En continuant, vous acceptez nos{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Conditions d’utilisation
            </a>{" "}
            et notre{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Politique de confidentialité
            </a>.
          </div>
        </div>
      </div>
    </div>
  );
}
