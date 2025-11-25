import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { APIURL } from "@/lib/api";
import { Plus} from "lucide-react";

type Policy = {
  id: string;
  type: string;
  annualBalance: number;
  autoApproval: boolean;
  description?: string;
};

export default function LeavePolicy() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [form, setForm] = useState({
    type: "",
    annualBalance: "",
    autoApproval: false,
    description: "",
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/leave/ListLeavePolicies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPolicies(data.policies);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/leave/createLeavePolicy`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Politique créée ✅");
        setOpenCreate(false);
        fetchPolicies();
        setForm({ type: "", annualBalance: "", autoApproval: false, description: "" });
      } else toast.error(data.message || "Erreur lors de la création");
    } catch {
      toast.error("Erreur serveur");
    }
  };

  const handleEdit = async () => {
    if (!selectedPolicy) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/leave/editLeavePolicy/${selectedPolicy.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...form,annualBalance:Number(form.annualBalance)}),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Politique mise à jour ✅");
        setOpenEdit(false);
        fetchPolicies();
      } else toast.error(data.message || "Erreur lors de la modification");
    } catch {
      toast.error("Erreur serveur");
    }
  };

  const handleDelete = async () => {
    if (!selectedPolicy) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/leave/deleteLeavePolicy/${selectedPolicy.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Politique supprimée 🗑️");
        setPolicies((prev) => prev.filter((p) => p.id !== selectedPolicy.id));
        setOpenDelete(false);
      } else toast.error("Erreur lors de la suppression");
    } catch {
      toast.error("Erreur serveur");
    }
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(policies.length / itemsPerPage);

  return (
    <div className="space-y-6 mx-6">
      <header className="flex h-16 items-center gap-2 mb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Configuration</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Politiques de congé</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 p-0">
        <div className="bg-white w-full p-6 rounded-2xl shadow-md">
          <Button className="mb-4" variant={"success"} onClick={() => setOpenCreate(true)}>
            <Plus className="h-4 w-4 mr-1" /> Créer une politique
          </Button>
          <div className="mt-4 border border-gray-300 rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-300">
                  <TableHead className="font-semibold text-gray-700">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Solde annuel</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Approbation auto</TableHead>
                  <TableHead className="font-semibold text-gray-700">Description</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {policies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((p) => (
                    <TableRow key={p.id} className="hover:bg-gray-50 border-b border-gray-300">
                      <TableCell>{p.type}</TableCell>
                      <TableCell className="text-center">{p.annualBalance}</TableCell>
                      <TableCell className="text-center">
                        {p.autoApproval ? (
                          <Badge className="bg-green-100 text-green-700">Oui</Badge>
                        ) : (
                          <Badge className="bg-gray-200 text-gray-700">Non</Badge>
                        )}
                      </TableCell>
                      <TableCell>{p.description || "—"}</TableCell>
                      <TableCell className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          className="flex items-center justify-center w-7 h-7 text-white transition-transform duration-200 bg-blue-500 rounded-full "
                          onClick={() => {
                            setSelectedPolicy(p);
                            setForm({
                              type: p.type,
                              annualBalance: p.annualBalance.toString(),
                              autoApproval: p.autoApproval,
                              description: p.description || "",
                            });
                            setOpenEdit(true);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="-2 -2 25 25" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </Button>
                        <Button
                          size="sm"
                          className="flex items-center justify-center w-7 h-7 text-white transition-transform duration-200 bg-red-500 rounded-full hover:bg-red-600"
                          onClick={() => {
                            setSelectedPolicy(p);
                            setOpenDelete(true);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="-2 -2 25 25" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </Button>
                        {/* <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4 text-gray-600" />
                        </Button> */}
                      </TableCell>
                    </TableRow>
              ))}
              </TableBody>
            </Table>
          </div>
          {/*  PAGINATION */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <p>
              Affichage {(currentPage - 1) * itemsPerPage + 1} à{" "}
              {Math.min(currentPage * itemsPerPage, policies.length)} sur {policies.length} demandes
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
      </div>

      {/* MODAL CREATE */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Créer une politique de congé</DialogTitle>
            <DialogDescription asChild>
              <form className="space-y-3 mt-3">
                <div className="grid gap-2">
                  <Label htmlFor="type">Type de congé</Label>
                  <Input id="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="annualBalance">Solde annuel (jours)</Label>
                  <Input
                    type="number"
                    id="annualBalance"
                    value={form.annualBalance}
                    onChange={(e) => setForm({ ...form, annualBalance: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Approbation automatique</Label>
                  <Switch
                    checked={form.autoApproval}
                    onCheckedChange={(v) => setForm({ ...form, autoApproval: v })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setOpenCreate(false)}>Annuler</Button>
                  <Button onClick={handleCreate} variant={"success"} type="button">Créer</Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* MODAL EDIT */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Modifier la politique</DialogTitle>
            <DialogDescription asChild>
              <form className="space-y-3 mt-3">
                <div className="grid gap-2">
                  <Label>Type de congé</Label>
                  <Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Solde annuel</Label>
                  <Input
                    type="number"
                    value={form.annualBalance}
                    onChange={(e) => setForm({ ...form, annualBalance: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Approbation automatique</Label>
                  <Switch
                    checked={form.autoApproval}
                    onCheckedChange={(v) => setForm({ ...form, autoApproval: v })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setOpenEdit(false)}>Fermer</Button>
                  <Button onClick={handleEdit} variant={"success"} type="button">Enregistrer</Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* MODAL DELETE */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Supprimer la politique</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette politique ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete}>Oui, supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
