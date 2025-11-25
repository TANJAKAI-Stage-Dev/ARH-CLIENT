import { useEffect, useState, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,} from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DownloadIcon, Eye, PaperclipIcon, Search } from "lucide-react";
import { toast } from "sonner";
import { APIURL } from "@/lib/api";
import { useLocation } from "react-router-dom";
import { AllStatusLeaveStat } from "./statusLeaveStat";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";

type LeaveRequest = {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  document?:string | null;
  policy:{
    type:string
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role:"EMPLOYEE" | "MANAGER" | "ADMIN";
    avatarUrl:string;
    team?:{
      name:string
    }
  };
};

type Team = {
  id: string;
  name: string;
};

export default function LeaveList({ currentUserRole }: { currentUserRole: "ADMIN" | "MANAGER" }) {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [allLeaves, setAllLeaves] = useState<LeaveRequest[]>([]);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

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
    fetchTeams();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [roleFilter, teamFilter,statusFilter,searchTerm, allLeaves]);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/leave/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setLeaves(data.leave);
        setAllLeaves(data.leave);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/user/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTeams(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des équipes:", error);
    }
  };

  const applyFilters = () => {
    let filtered = allLeaves;

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(leave => 
        leave.user.firstName.toLowerCase().includes(term) ||
        leave.user.lastName.toLowerCase().includes(term) ||
        leave.user.email.toLowerCase().includes(term) ||
        leave.policy.type.toLowerCase().includes(term) ||
        leave.reason?.toLowerCase().includes(term) ||
        (leave.user.team?.name && leave.user.team.name.toLowerCase().includes(term))
      );
    }

    // Filtre par rôle
    if (roleFilter && roleFilter !== "all") {
      filtered = filtered.filter(leave => leave.user.role === roleFilter);
    }

    // Filtre par équipe 
    if (teamFilter && teamFilter !== "all" && roleFilter === "EMPLOYEE") {
      filtered = filtered.filter(leave => leave.user.team?.name === teamFilter);
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
        return <Badge className="bg-gray-200 text-gray-700">En attente</Badge>;
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-700">Approuvé</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-700">Rejeté</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleApprove = async () => {
    if (!selectedLeave) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/leave/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: selectedLeave.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setLeaves((prev) =>
          prev.map((l) => (l.id === selectedLeave.id ? { ...l, status: "APPROVED" } : l))
        );
        setAllLeaves((prev) =>
          prev.map((l) => (l.id === selectedLeave.id ? { ...l, status: "APPROVED" } : l))
        );
        toast.success("Demande approuvée ✅");
      } else toast.error(data.message || "Erreur lors de l'approbation");
    } catch (error) {
      console.error("Erreur:", error);
    }
    setOpenApproveModal(false);
  };

  const handleReject = async () => {
    if (!selectedLeave) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/leave/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: selectedLeave.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setLeaves((prev) =>
          prev.map((l) => (l.id === selectedLeave.id ? { ...l, status: "REJECTED" } : l))
        );
        setAllLeaves((prev) =>
          prev.map((l) => (l.id === selectedLeave.id ? { ...l, status: "REJECTED" } : l))
        );
        toast.success("Demande rejetée ❌");
      } else toast.error(data.message || "Erreur lors du rejet");
    } catch (error) {
      console.error("Erreur:", error);
    }
    setOpenRejectModal(false);
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(leaves.length / itemsPerPage);

  const renderActions = (l:LeaveRequest, currentUserRole:"ADMIN" | "MANAGER") => {
    const employee = l.user.role === "EMPLOYEE";
    const manager = l.user.role === "MANAGER";
    const pending = l.status === "PENDING";

    // MANAGER
    if (currentUserRole === "MANAGER") {
      if (pending && employee) {
        return (
          <>
            <Button
              size="sm"
              variant={"success"}
              className="w-20 h-8 rounded-xl"
              onClick={() => {
                setSelectedLeave(l);
                setOpenApproveModal(true);
              }}
            >
              Approuver
            </Button>

            <Button
              size="sm"
              variant={"destructive"}
              className="w-19 h-8 rounded-xl"
              onClick={() => {
                setSelectedLeave(l);
                setOpenRejectModal(true);
              }}
            >
              Rejeter
            </Button>

            {/* voir */}
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedLeave(l);
                setOpenViewModal(true);
              }}
            >
              <Eye className="h-6 w-6" />
            </Button>
          </>
        );
      }

      // Sinon 
      return (
        <Button
          size="sm"
          variant="ghost"
          className="hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            setSelectedLeave(l);
            setOpenViewModal(true);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    }

  // ADMIN
    if (currentUserRole === "ADMIN") {
      if (pending && manager) {
        return (
          <>
            <Button
              size="sm"
              className="w-20 h-8 bg-black text-white rounded-xl hover:bg-black cursor-pointer"
              onClick={() => {
                setSelectedLeave(l);
                setOpenApproveModal(true);
              }}
            >
              Approuver
            </Button>

            <Button
              size="sm"
              className="w-19 h-8 bg-red-500 text-white rounded-xl hover:bg-red-700 cursor-pointer"
              onClick={() => {
                setSelectedLeave(l);
                setOpenRejectModal(true);
              }}
            >
              Rejeter
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedLeave(l);
                setOpenViewModal(true);
              }}
            >
              <Eye className="h-6 w-6" />
            </Button>
          </>
        );
      }

      // sinon
      return (
        <Button
          size="sm"
          variant="ghost"
          className="hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            setSelectedLeave(l);
            setOpenViewModal(true);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    }
  };

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
              <BreadcrumbPage>Liste des demandes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <AllStatusLeaveStat/>

      <div className="flex-1 p-0">
        <div className="bg-white w-full p-6 rounded-2xl shadow-md">
          {/* Filtres */}
          <div className="flex gap-6 mb-6">
            {/* Filtre par rôle */}
            <div className="flex flex-row items-center gap-2">
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

            {/* Filtre par status */}
            <div className="flex flex-row items-center gap-2">
              <Label htmlFor="status-filter" className="text-sm font-medium">
                Status:
              </Label>
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
          </div>

          <div className="mt-2 border border-gray-300 rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-300">
                  <TableHead className="font-semibold text-gray-700">Employé</TableHead>
                  <TableHead className="font-semibold text-gray-700">Role/Equipe</TableHead>
                  <TableHead className="font-semibold text-gray-700">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Dates</TableHead>
                  <TableHead className="font-semibold text-gray-700">Raison</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Statut</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {leaves
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((l) => (
                    <TableRow
                      key={l.id}
                      ref={(el) =>{rowRefs.current[l.id] = el}}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-300 last:border-0"
                    >
                      <TableCell className="font-medium flex items-center gap-4">
                        <img
                          src={(l.user.avatarUrl ? `http://localhost:3005${l.user.avatarUrl}` : "/default-avatar.png")}
                          alt={"huhu"}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        {l.user.firstName} {l.user.lastName}
                      </TableCell>
                      <TableCell>{l.user.team?.name || l.user.role}</TableCell>
                      <TableCell>{l.policy.type}</TableCell>
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
                      <TableCell className="pl-20">
                        <div className="flex flex-row gap-2 justify-start">
                          {renderActions(l, currentUserRole)}
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

      {/* VOIR */}
      <Dialog open={openViewModal} onOpenChange={setOpenViewModal}>
        <DialogContent className="max-w-lg p-6 space-y-6">
          <DialogHeader className="mb-1">
            <DialogTitle className="text-xl font-semibold font-['Segoe_UI']">
              Détails du demande
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 mt-1">

            {/* Left*/}
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Employé:</p>
                <p>
                  {selectedLeave?.user.firstName} {selectedLeave?.user.lastName}
                </p>
              </div>

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

      {/* MODAL APPROVE */}
      <Dialog open={openApproveModal} onOpenChange={setOpenApproveModal}>
        <DialogContent className="backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Approuver la demande</DialogTitle>
            <DialogDescription>Confirmez-vous l'approbation de cette demande ?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenApproveModal(false)}>Annuler</Button>
            <Button onClick={handleApprove} className="bg-black hover:bg-black">Approuver</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL REJECT */}
      <Dialog open={openRejectModal} onOpenChange={setOpenRejectModal}>
        <DialogContent className="backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Rejeter la demande</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir rejeter cette demande ?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenRejectModal(false)}>Non</Button>
            <Button variant="destructive" onClick={handleReject}>Oui, rejeter</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}