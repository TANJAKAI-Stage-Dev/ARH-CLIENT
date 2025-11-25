import { useEffect, useState } from "react";
import { APIURL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, Search } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl:string;
  team?: { name: string };
  average?: number;
  evaluated?: boolean;
}

export default function PerformanceList() {
  const [employees, setEmployees] = useState<User[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<User[]>([]);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { toast } = useToast();
  const navigate = useNavigate();

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${APIURL}/api/performance/employees?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setEmployees(data.employees);
        setFilteredEmployees(data.employees);
      } else {
        toast({ title: "Erreur", description: data.message || "Impossible de charger les employés" });
      }
    } catch {
      toast({ title: "Erreur serveur", description: "Impossible de charger les employés" });
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [month, year]);

  useEffect(() => {
    const filtered = employees.filter(
      (emp) =>
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.team?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const handleNote = (employeeId: string) => {
    navigate(`/manager/note/${employeeId}?month=${month}&year=${year}`);
  };

  const handleView = (employeeId: string) => {
    navigate(`/manager/view/${employeeId}?month=${month}&year=${year}`);
  };
    // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  return (
    <div className="space-y-6 mx-6">
      <header className="flex h-16 items-center gap-2 mb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">performance</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Liste des employés</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-col gap-4">

        {/* Bloc tableau des employés */}
        <div className="bg-white w-full p-6 rounded-2xl shadow-md">
          {/* filtre */}
          <div className="flex flex-wrap gap-6 items-end mb-1">
            {/* Mois */}
            <div className="flex flex-row items-center gap-2">
              <label className="text-sm font-medium text-gray-600">Mois :</label>
              <Select value={month.toString()} onValueChange={(val) => setMonth(parseInt(val))}>
                <SelectTrigger className="w-[180px] bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Mois" />
                </SelectTrigger>
                <SelectContent className="border-gray-300">
                  {monthNames.map((m, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Année */}
            <div className="flex flex-row items-center gap-2">
              <label className="text-sm font-medium text-gray-600">Année :</label>
              <Select value={year.toString()} onValueChange={(val) => setYear(parseInt(val))}>
                <SelectTrigger className="w-[180px] bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => (
                    <SelectItem key={i} value={(year - i).toString()}>
                      {year - i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Barre de recherche */}
            <div className="flex flex-col flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Rechercher un employé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          {/* tableau */}
          <div className="border border-gray-300 rounded-md overflow-hidden mt-6">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-300">
                  <TableHead className="font-semibold text-gray-700">Nom</TableHead>
                  <TableHead className="font-semibold text-gray-700">Equipe</TableHead>
                  <TableHead className="font-semibold text-gray-700">Moyenne</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees
                    .slice((currentPage - 1) * itemsPerPage,currentPage* itemsPerPage)
                    .map((emp) => (
                      <TableRow
                        key={emp.id}
                        className="hover:bg-gray-50 transition-colors border-b border-gray-300 last:border-0"
                      >
                        <TableCell className="font-medium flex items-center gap-6 w-20">
                        <img
                          src={(emp.avatarUrl ? `http://localhost:3005${emp.avatarUrl}` : "/public/images/default.jpeg")}
                          alt={"huhu"}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                          {emp.firstName} {emp.lastName}</TableCell>
                        <TableCell>{emp.team?.name || "-"}</TableCell>
                        <TableCell>
                          {emp.average !== undefined ? emp.average.toFixed(2) : "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-row gap-2 justify-center">
                            {!emp.evaluated ? (
                              <Button
                                size="sm"
                                className="w-6 h-6 bg-blue-500 text-white rounded-full hover:scale-110 cursor-pointer"
                                onClick={() => handleNote(emp.id)}
                              >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="-2 -2 25 25" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                              </Button>
                            ):(
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleView(emp.id)}
                            >
                              <Eye className="h-5 w-5" />
                            </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                      Aucun employé trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <p>
              Affichage {(currentPage - 1) * itemsPerPage + 1} à{" "}
              {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} sur {filteredEmployees.length} employés
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
    </div>
  );
}
