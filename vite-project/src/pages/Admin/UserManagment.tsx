"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APIURL } from "@/lib/api";
import { toast } from "sonner";
import { MoreVertical, Plus, Search, Trash, User } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  role: "EMPLOYEE" | "MANAGER" | "ADMIN";
  avatarUrl:string;
  team?: { name: string };
}

interface Team {
  id: string;
  name: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [AllUser,setAllUser] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  // const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "EMPLOYEE",
    teamId: "",
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/admin/getAllUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok){
        setUsers(data.users);
        setAllUser(data.users);
      }
      else toast.error("Impossible de charger les utilisateurs" );
    } catch (error) {
      console.error("Erreur de récupération :", error);
      toast.error("Impossible de charger les utilisateurs");
    }
  };

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/user/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error(err);
    }
  };

const handleDelete = async (userId: string) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${APIURL}/api/user/delete/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("Utilisateur supprimé ✅");
      setOpenDelete(false);
      setDeleteUserId(null);
    } else {
      const data = await res.json();
      if(data.message === "Forbidden: insufficient role"){
        toast.error("Seul un SUPERADMIN peut supprimer un utilisateur");
        setOpenDelete(false);
      } else {
        toast.error("Impossible de supprimer l'utilisateur");
        setOpenDelete(false);
      }
    }
  } catch {
    toast.error("Erreur serveur");
  }
};


  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/admin/registerByAdmin`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Utilisateur créé !");
        setOpen(false);
        setFormData({ firstName: "", lastName: "", email: "", role: "EMPLOYEE", teamId: "" });
        fetchUsers();
      } else {
        toast.error("Impossible de créer l'utilisateur" );
      }
    } catch (err) {
      console.error(err);
      toast.error("Impossible de créer l'utilisateur");
    }
  };
  const handleView = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Implémentez la logique pour voir les détails de l'utilisateur
    console.log("Voir l'utilisateur:", userId);
  };

  useEffect(() => {
    applyFilters();
  }, [roleFilter, teamFilter,searchTerm, AllUser]);

  const applyFilters = () => {
    let filtered = AllUser;

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.team?.name && user.team.name.toLowerCase().includes(term))
      );
    }

    // Filtre par rôle
    if (roleFilter && roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filtre par équipe 
    if (teamFilter && teamFilter !== "all" && roleFilter === "EMPLOYEE") {
      filtered = filtered.filter(user => user.team?.name === teamFilter);
    }

    setUsers(filtered);
    // setCurrentPage(1); 
  };

  return (
    <div className="space-y-6 mx-6">
      <header className="flex h-16 items-center gap-2 mb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Utilisateurs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Liste des utilisateurs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* Barre de recherche et filtres */}
      <div className="bg-white flex flex-col sm:flex-row gap-4 rounded-2xl items-start sm:items-center justify-end p-4">
          <div className="flex gap-3">
            {/* Filtre par rôle */}
            <div className="flex flex-row gap-2">
              <Label htmlFor="role-filter" className="text-sm font-medium">
                Rôle:
              </Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48 border-gray-300">
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="EMPLOYEE">Employé</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Filtre par équipe */}
            {roleFilter === "EMPLOYEE" && (
              <div className="flex flex-row items-center gap-2">
                <Label htmlFor="team-filter" className="text-sm font-medium">
                  Equipe:
                </Label>
                <Select value={teamFilter} onValueChange={setTeamFilter}>
                  <SelectTrigger className="w-48 border-gray-300">
                    <SelectValue placeholder="Toutes les équipes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les équipes</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.name}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          {/* search */}
          <div className="flex flex-col flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="search"
                placeholder="Rechercher par nom, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>   
            {/* create */}
          <div className="flex gap-2 w-full sm:w-auto">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black cursor-pointer hover:bg-gray-950"><Plus className="h-4 w-4 mr-1" />ajout utilisateur</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                  <Input
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <Select
                    value={formData.role}
                    onValueChange={(val) => setFormData({ ...formData, role: val as "EMPLOYEE" | "MANAGER" | "ADMIN" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMPLOYEE">Employee</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.role === "EMPLOYEE" && (
                    <Select
                      value={formData.teamId}
                      onValueChange={(val) => setFormData({ ...formData, teamId: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Button type="submit" variant={"success"} className="w-full">Create</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
      </div>

      {/* Grille des cartes employés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.length > 0 ? (
          users.map((user) => (
            <div 
              key={user.id}
              className="relative flex items-center h-28 justify-between p-4 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:border-blue-500 hover:shadow-md overflow-hidden"
              // onClick={() => handleCardClick(user.id)}
            >                       
              <div className="flex flex-1 min-w-0">
                <div className="flex-shrink-0 mr-3">
                  <img 
                    src={(user.avatarUrl ? `http://localhost:3005${user.avatarUrl}` : "/public/images/default.jpeg")}
                    className="object-cover w-10 h-10 rounded-full"
                    alt={"sary"}
                  />
                </div>
                
                {/* Contact details */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex flex-col">
                    <div className="font-bold text-sm text-gray-700 truncate">{user.firstName} {user.lastName}</div>
                    <div className="font-medium text-xs text-gray-900 truncate">{user.team?.name || user.role}</div>
                  </div>
                  <div className="text-xs text-gray-500 truncate mt-1">{user.email}</div>
                </div>
              </div>
              
              {/* More vertical */}
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                        <MoreVertical
                          size={18}
                          className="cursor-pointer text-gray-500 hover:text-gray-700"
                          onClick={(e) => e.stopPropagation()} 
                        />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="border-gray-300 w-1">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleView(user.id, e);
                    }} className="cursor-pointer flex items-center">
                      <User />
                      Voir profil
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) =>{
                        e.stopPropagation();
                        setDeleteUserId(user.id);
                        setOpenDelete(true);
                      }}
                      variant="destructive" className="cursor-pointer flex items-center"
                    >
                      <Trash/>
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Aucun employé trouvé</p>
          </div>
        )}
      </div>
            {/*  MODAL DELETE  */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Supprimer l'utilisateur</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>Non</Button>
            <Button variant="destructive" onClick={()=>{deleteUserId && handleDelete(deleteUserId)}} type="button">Oui, supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}