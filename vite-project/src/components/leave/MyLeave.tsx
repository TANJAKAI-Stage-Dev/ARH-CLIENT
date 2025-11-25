import { useEffect, useState ,useRef} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,} from "@/components/ui/breadcrumb";
import { Eye,Plus , PaperclipIcon, DownloadIcon, Search} from "lucide-react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,} from "@/components/ui/dialog";
import { toast } from "sonner";
import { APIURL } from "@/lib/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MyStatusLeaveStat } from "./statusLeaveStat";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";

type LeaveRequest = {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  document?:string | null;
  policy:{
    id:string;
    type:string
  }
};

export default function MyLeave() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [allLeaves, setAllLeaves] = useState<LeaveRequest[]>([]);
  const [openCancel, setOpenCancel] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const Navigate = useNavigate()
  const location = useLocation();
  const highlightId = location.state?.highlightId;
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});
  useEffect(() => {
  if (!highlightId || leaves.length === 0) return;

  const row = rowRefs.current[highlightId];
  if (row) {
    row.classList.add("bg-blue-100");
    row.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      row.classList.remove("bg-blue-100");
    }, 5000);
  }
}, [highlightId, leaves]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/leave/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok){
        setLeaves(data.leave);
        setAllLeaves(data.leave);
      }
    } catch (error) {
      console.error(error);
    }
  };
  //  DELETE 
  const handleDelete = async () => {
    if (!selectedLeave) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/leave/delete/${selectedLeave.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setLeaves((prev) => prev.filter((l) => l.id !== selectedLeave.id));
        toast.success("Demande annulée ✅");
        setOpenCancel(false);
        setSelectedLeave(null);
      } else {
        const data = await res.json();
        toast.error(data.message || "Erreur lors de l'annulation");
      }
    } catch {
      toast.error("Erreur serveur");
    }
  };

  useEffect(() =>{
    applyFilters();
  },[statusFilter,searchTerm, allLeaves])

  const applyFilters = () => {
    let filtered = allLeaves;

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(leave => 
        leave.policy.type.toLowerCase().includes(term) ||
        leave.reason?.toLowerCase().includes(term) 
      );
    }

    // Filtre par status
    if(statusFilter && statusFilter !== "all"){
      filtered = filtered.filter(leave => leave.status === statusFilter)
    }

    setLeaves(filtered);
    setCurrentPage(1); 
  };
  // BADGE
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-gray-200 text-grey-700">En attente</Badge>;
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-700">Approuvé</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-700">Rejeté</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
    // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(leaves.length / itemsPerPage);


  return (
    <div className="space-y-6 mx-6">
      <header className="flex h-16 items-center gap-2 mb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Congés</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Mes demandes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <MyStatusLeaveStat/>
      <div className="flex-1 p-0">
        <div className="bg-white w-full p-6 rounded-2xl shadow-md">
          <div className="flex gap-6 mb-3">
            {/* Filtre par status */}
            <div className="flex flex-row gap-2">
              <p className="p-1.5 text-sm">Status:</p>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 border-gray-300">
                  <SelectValue placeholder="Tous les status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les status</SelectItem>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="APPROVED">Approvée</SelectItem>
                  <SelectItem value="REJECTED">Rejetée</SelectItem>
                </SelectContent>
              </Select>
            </div>
             {/* Barre de recherche */}
            <div className="flex flex-col flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Rechercher par nom, email, type de congé, raison..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <Link to={"LeaveRequest"}>
              <Button variant={"success"} className="mb-4" >
                <Plus className="h-4 w-4 mr-1" /> Nouvelle demande
              </Button>
            </Link>
          </div>

              <div className="mt-2 border border-gray-300 rounded-md overflow-hidden">
                <Table>
                  <TableHeader >
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Raison</TableHead>
                      <TableHead className="text-center">Statut</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {leaves.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((l) => (
                      <TableRow
                        key={l.id}
                        ref={(el) =>{rowRefs.current[l.id] = el}}
                        className="hover:bg-gray-50 transition-colors border-b border-gray-300 last:border-0"
                      >
                        <TableCell className="font-medium">{l.policy.type}</TableCell>
                        <TableCell className="space-y-1">
                          <div className="font-medium text-gray-800">
                            {new Date(l.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} 
                            {" – "}
                            {new Date(l.endDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                          </div>

                          <div className="text-sm text-gray-500">
                            {Math.ceil(
                              (new Date(l.endDate).getTime() - new Date(l.startDate).getTime()) 
                              / (1000 * 60 * 60 * 24)
                            ) + 1} jours
                          </div>
                      </TableCell>
                        <TableCell className="space-y-1">
                          <div className="text-gray-800 font-medium">
                            {l.reason || "—"}
                          </div>

                          {l?.document && (
                            <div className="flex items-center text-blue-600 text-sm cursor-pointer hover:underline">
                              <PaperclipIcon size={13}/> <a href={`http://localhost:3005${l.document}`} target="_blank">Document attaché</a>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center">{renderStatusBadge(l.status)}</TableCell>
                        <TableCell className="text-center align-middle">
                          <div className="flex flex-row gap-2 justify-center">                   
                            {l.status === "PENDING" ? (
                              <>
                                <Button
                                  size="sm"
                                  className="flex items-center justify-center w-7 h-7 text-white transition-transform duration-200 bg-blue-500 rounded-full cursor-pointer hover:scale-110"
                                  onClick={() => Navigate(`EditLeaveRequest/${l.id}`)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="-2 -2 25 25" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </Button>
                                <Button
                                  size="sm"
                                  className="flex items-center justify-center w-7 h-7 text-white transition-transform duration-200 bg-red-500 rounded-full cursor-pointer hover:bg-red-600"
                                  onClick={() => {
                                    setSelectedLeave(l);
                                    setOpenCancel(true);
                                  }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="-2 -2 25 25" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="hover:bg-gray-100"
                                  onClick={() =>{
                                    setSelectedLeave(l);
                                    setOpenViewModal(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                </Button>
                              </>
                            ) : (
                              <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="hover:bg-gray-100"
                                onClick={() =>{
                                  setSelectedLeave(l);
                                  setOpenViewModal(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                              </Button>
                              </>
                            )}
                          </div>


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
              {Math.min(currentPage * itemsPerPage, leaves.length)} sur {leaves.length} demandes
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

      {/*  MODAL CANCEL  */}
      <Dialog open={openCancel} onOpenChange={setOpenCancel}>
        <DialogContent className="backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Annuler la demande</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler cette demande ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenCancel(false)}>Non</Button>
            <Button variant="destructive" onClick={handleDelete} type="button">Oui, annuler</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* VOIR */}
      <Dialog open={openViewModal} onOpenChange={setOpenViewModal}>
        <DialogContent className="max-w-lg p-6 space-y-6">
          <DialogHeader className="mb-1">
            <DialogTitle className="text-xl font-semibold">
              Détails du demande
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 mt-1">

            {/* Left*/}
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-800">Dates:</p>
                  <div className="font-medium text-gray-800">
                    {selectedLeave && new Date(selectedLeave.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} 
                    {" – "}
                    {selectedLeave && new Date(selectedLeave.endDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </div>

                  <div className="text-sm text-gray-500">
                    {selectedLeave && Math.ceil(
                      (new Date(selectedLeave.endDate).getTime() - new Date(selectedLeave.startDate).getTime()) 
                      / (1000 * 60 * 60 * 24)
                    ) + 1} jours
                  </div>
              </div>

              <div>
                <p className="font-semibold">Reason:</p>
                <p>{selectedLeave?.reason || "—"}</p>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Type:</p>
                <p>{selectedLeave?.policy.type}</p>
              </div>

              <div>
                <p className="font-semibold">Status:</p>
                <p>{renderStatusBadge(selectedLeave?.status || "")}</p>
              </div>
            </div>
          </div>

          {/* DOWN*/}
          {selectedLeave?.document && (
            <div className="flex gap-3 pt-2 mt-0">

              <a
                href={`http://localhost:3005${selectedLeave.document}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-md"
              >
                <DownloadIcon size={20}/>
                Voir Document
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
