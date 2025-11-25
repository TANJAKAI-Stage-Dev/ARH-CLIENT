import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { APIURL } from "@/lib/api";

interface Team {
  id: string;
  name: string;
  description?: string;
}

export default function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/user/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTeams(data);
    } catch {
      toast.error("Impossible de charger les équipes");
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/user/teams`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Team créée !");
        setOpenCreate(false);
        setForm({ name: "", description: "" });
        fetchTeams();
      } else toast.error(data.message || "Erreur lors de la création");
    } catch {
      toast.error("Erreur serveur");
    }
  };
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(teams.length / itemsPerPage);

  return (
    <div className="space-y-6 mx-6">
      {/* Breadcrumb */}
      <header className="flex h-16 items-center gap-2 mb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Configuration</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Teams</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* Card principale */}
      <div className="bg-white w-full p-6 rounded-2xl shadow-md">
        <Button className="mb-4" variant={"success"} onClick={() => setOpenCreate(true)}>
          <Plus className="h-4 w-4 mr-1" /> Ajouter une Team
        </Button>

        <div className="mt-4 border border-gray-300 rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-300">
                <TableHead className="font-semibold text-gray-700">Nom</TableHead>
                <TableHead className="font-semibold text-gray-700">Description</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {teams.length > 0 ? (
                teams.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((team) => (
                  <TableRow
                    key={team.id}
                    className="hover:bg-gray-50 border-b border-gray-300"
                  >
                    <TableCell>{team.name}</TableCell>
                    <TableCell>{team.description || "—"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-gray-500 py-4"
                  >
                    Aucune team trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <p>
              Affichage {(currentPage - 1) * itemsPerPage + 1} à{" "}
              {Math.min(currentPage * itemsPerPage, teams.length)} sur {teams.length} demandes
            </p>
            <div className="flex items-center gap-2">
              <Button
              className="border-gray-300"
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Précédent
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  className="border-gray-300"
                  key={i}
                  size="sm"
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                className="border-gray-300"
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Suivant
              </Button>
            </div>
          </div>
      </div>

      {/* Modal CREATE */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Créer une Team</DialogTitle>
            <DialogDescription asChild>
              <form className="space-y-3 mt-3">
                <div className="grid gap-2">
                  <Label>Nom de la team</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Input
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setOpenCreate(false)}>
                    Annuler
                  </Button>
                  <Button variant={"success"} type="button" onClick={handleCreate}>
                    Créer
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
