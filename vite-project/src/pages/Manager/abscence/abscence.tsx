import { useEffect, useState, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Eye, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { APIURL } from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { AbsenceStat } from "./abscenceStat";

type Absence = {
  id: string;
  type: "JUSTIFIED" | "UNJUSTIFIED" | "MEDICAL";
  startDate: string;
  endDate: string;
  comment?: string | null;
  employee: {
    id: string;
    firstName: string;
    lastName:string;
    email: string;
    avatarUrl:string;
  };
  manager?: {
    id: string;
    name: string;
  };
};

export default function AbsenceList() {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [allAbsences, setAllAbsences] = useState<Absence[]>([]);
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  useEffect(() => {
    fetchAbsences();
  }, []);

  const fetchAbsences = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/abscence/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAbsences(data);
        setAllAbsences(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur serveur");
    }
  };

  // Filtre recherche
  useEffect(() => {
    const filtered = allAbsences.filter((a) =>
      a.employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setAbsences(filtered);
    setCurrentPage(1);
  }, [searchTerm, allAbsences]);

  // Supprimer
  const handleDelete = async () => {
    if (!selectedAbsence) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/abscence/delete/${selectedAbsence.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAbsences((prev) => prev.filter((a) => a.id !== selectedAbsence.id));
        toast.success("Absence supprimée ✅");
        setOpenDeleteModal(false);
        setSelectedAbsence(null);
      } else {
        const data = await res.json();
        toast.error(data.message || "Erreur suppression");
      }
    } catch {
      toast.error("Erreur serveur");
    }
  };

    const renderTypeBadge = (type: string) => {
        switch (type) {
        case "JUSTIFIED":
            return <Badge className="bg-green-200 text-green-700">justifiée</Badge>;
        case "UNJUSTIFIED":
            return <Badge className="bg-gray-100 text-gray-700">non justifiée</Badge>;
        case "MEDICAL":
            return <Badge className="bg-red-100 text-red-700">medical</Badge>;
        default:
            return <Badge variant={"secondary"}>{type}</Badge>;
        }
    };
  const totalPages = Math.ceil(absences.length / itemsPerPage);

  return (
    <div className="space-y-6 mx-6">
      {/* Breadcrumb */}
      <header className="flex h-16 items-center gap-2 mb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Absences</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Liste</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <AbsenceStat/>
      <div className="flex-1 p-0">
        <div className="bg-white w-full p-6 rounded-2xl shadow-md">
            <div className="flex gap-6 mb-3">
                {/* Bouton + recherche */}
                <div className="flex flex-col flex-1 min-w-[250px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                        placeholder="Rechercher par nom ou raison..."
                        value={searchTerm}
                        onChange={(e:any) => setSearchTerm(e.target.value)}
                        className="pl-9 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <Link to="/manager/AddAbsence">
                <Button variant="success" className="mb-4">
                    <Plus className="h-4 w-4 mr-1" /> Nouvelle abscence
                </Button>
                </Link>
            </div>

            {/* Tableau */}
            <div className="mt-2 border border-gray-300 rounded-md overflow-hidden">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Raison</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {absences
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((a) => (
                        <TableRow key={a.id} ref={el=> {rowRefs.current[a.id] = el}} className="hover:bg-gray-50 transition-colors border-b border-gray-300 last:border-0">
                        <TableCell className="font-medium flex items-center gap-4">
                          <img
                            src={(a.employee.avatarUrl ? `http://localhost:3005${a.employee.avatarUrl}` : "/default-avatar.png")}
                            alt={"huhu"}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          {a.employee.firstName} {a.employee.lastName}</TableCell>
                        <TableCell className="space-y-1">
                            <div className="font-medium text-gray-800">
                                {new Date(a.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} 
                                {" – "}
                                {new Date(a.endDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                            </div>

                            <div className="text-sm text-gray-500">
                                {Math.ceil(
                                (new Date(a.endDate).getTime() - new Date(a.startDate).getTime()) 
                                / (1000 * 60 * 60 * 24)
                                ) + 1} jours
                            </div>
                        </TableCell>
                        <TableCell className="space-y-1">{renderTypeBadge(a.type)}</TableCell>
                        <TableCell className="">{a.comment || "—"}</TableCell>
                        <TableCell className="text-center align-middle">
                          <div className="flex items-center gap-2 justify-center">
                            <Button size="sm" onClick={() => navigate(`/absence/edit/${a.id}`)}
                            className="flex items-center justify-center w-7 h-7 text-white transition-transform duration-200 bg-blue-500 rounded-full cursor-pointer hover:scale-110"    
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="-2 -2 25 25" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => { setSelectedAbsence(a); setOpenDeleteModal(true); }}
                            className="flex items-center justify-center w-7 h-7 text-white transition-transform duration-200 bg-red-500 rounded-full cursor-pointer hover:bg-red-600"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="-2 -2 25 25" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => { setSelectedAbsence(a); setOpenViewModal(true); }}>
                            <Eye className="h-4 w-4"/>
                            </Button>
                          </div>
                        </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                <p>
                Affichage {(currentPage - 1) * itemsPerPage + 1} à{" "}
                {Math.min(currentPage * itemsPerPage, absences.length)} sur {absences.length} absences
                </p>
                <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Précédent</Button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <Button size="sm" key={i} variant={currentPage === i + 1 ? "default" : "outline"} onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                    </Button>
                ))}
                <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Suivant</Button>
                </div>
            </div>
        </div>
      </div>


      {/* Modal Voir */}
      <Dialog open={openViewModal} onOpenChange={setOpenViewModal}>
        <DialogContent className="max-w-lg p-6 space-y-4">
          <DialogHeader>
            <DialogTitle>Détails de l'absence</DialogTitle>
            <DialogDescription>
              {selectedAbsence?.employee.firstName}
            </DialogDescription>
          </DialogHeader>
          <div>
            <p><strong>Type :</strong> {selectedAbsence?.type}</p>
            <p><strong>Dates :</strong> {selectedAbsence && new Date(selectedAbsence.startDate).toLocaleDateString()} – {selectedAbsence && new Date(selectedAbsence.endDate).toLocaleDateString()}</p>
            <p><strong>Raison :</strong> {selectedAbsence?.comment || "—"}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Delete */}
      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <DialogContent className="backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Supprimer l'absence</DialogTitle>
            <DialogDescription>Voulez-vous vraiment supprimer cette absence ?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDeleteModal(false)}>Non</Button>
            <Button variant="destructive" onClick={handleDelete}>Oui, supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
