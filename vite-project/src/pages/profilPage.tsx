import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Camera, User, Mail, Shield, Loader2, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { APIURL } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

export default function ProfilePage() {
  const { updateAvatar } = useAuth(); 
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${APIURL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur lors du chargement du profil");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Erreur fetchUser:", err);
      }
    };
    fetchUser();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Non autorisé");
    if (!file) return alert("Choisissez une image d'abord");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoading(true);
      const res = await fetch(`${APIURL}/api/user/avatar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Erreur lors de la mise à jour de l'avatar");
        return;
      }
      setUser((prev: any) => ({ ...prev, avatarUrl: data.user.avatarUrl }));
      updateAvatar(data.user.avatarUrl);
      localStorage.setItem("user-avatar", data.user.avatarUrl);
      // alert("Photo de profil mise à jour !");
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Erreur upload:", err);
      alert("Erreur lors du téléversement.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-6">
      <header className="flex h-16 items-center gap-2 mb-0">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Profile</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Mon profil</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="mx-auto mt-0">
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos informations personnelles et votre photo de profil
          </p>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-[600px_1fr] h-162 gap-6">
          {/* Section Photo à gauche */}
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl font-medium mb-2">Photo de profil</CardTitle>
              <CardDescription>
                Ajoutez ou modifiez votre photo de profil
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative group mt-8">
                <Avatar className="h-80 w-80">
                  <AvatarImage
                    src={
                      preview ||
                      (user.avatarUrl
                        ? `http://localhost:3005${user.avatarUrl}`
                        : undefined)
                    }
                    alt="Avatar"
                  />
                  <AvatarFallback className="text-2xl">
                    {user.firstName?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="h-8 w-8 text-white" />
                </Label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {file && (
                <div className="w-full space-y-2">
                  <p className="text-sm text-muted-foreground text-center truncate">
                    {file.name}
                  </p>
                  <Button
                    onClick={handleUpload}
                    variant={"success"}
                    disabled={loading}
                    className="w-full h-10 mt-5"
                    size="sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mise à jour...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                  <Button variant={"outline"} className="w-full h-10" onClick={()=> {setFile(null),setPreview(null)}}>Annuler</Button>
                </div>
              )}

              {!file && (
                <Label
                  htmlFor="avatar-upload"
                  className="w-full"
                >
                  <Button variant="outline" className="w-full h-10 mt-9" asChild>
                    <span>
                      <Camera className="mr-2 h-4 w-4" />
                      Choisir une photo
                    </span>
                  </Button>
                </Label>
              )}
            </CardContent>
          </Card>

          {/* Section Informations à droite */}
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl font-medium mb-2">Informations personnelles</CardTitle>
              <CardDescription>Vos détails de compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 mt-0">
              {/* <div className="grid gap-6 sm:grid-cols-2"> */}
                <div className="space-y-2">
                  <Label className="text-slate-600 flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-600" />
                    Nom 
                  </Label>
                  <div className="p-3 bg-slate-200 rounded-lg border border-slate-200">
                    <p className="text-slate-900 font-medium">{user.firstName}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-600 flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-600" />
                    Prénom 
                  </Label>
                  <div className="p-3 bg-slate-200 rounded-lg border border-slate-200">
                    <p className="text-slate-900 font-medium">{user.lastName}</p>
                  </div>
                </div>
              {/* </div> */}

              {/* <div className="grid gap-6 sm:grid-cols-2"> */}
                <div className="space-y-2">
                  <Label className="text-slate-600 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-blue-600" />
                    Contact
                  </Label>
                  <div className="p-3 bg-slate-200 rounded-lg border border-slate-200">
                    <p className="text-slate-900 font-medium h-4">{user.contact || " "}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-600" />
                    Adresse email
                  </Label>
                  <div className="p-3 bg-slate-200 rounded-lg border border-slate-200">
                    <p className="text-slate-900 font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-blue-600" />
                    Rôle
                  </Label>
                  <div className="p-3 bg-slate-200 rounded-lg border border-slate-200">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-blue-800">
                      {user.team?.name || user.role}
                    </span>
                  </div>
                </div>
              {/* </div> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}