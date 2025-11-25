import { useEffect, useState,useRef } from "react";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { APIURL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

type LeavePolicy = {
  id: string;
  type: string;
  description: string;
  annualBalance: number;
  autoApproval: boolean;
  totalDays: number;
  usedDays: number;
  remaining: number;
};

export default function MyLeavePolicyEmployee() {
  const [policies, setPolicies] = useState<LeavePolicy[]>([]);
  const location = useLocation();
  const highlightId = location.state?.highlightId;
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});
  useEffect(() => {
  if (!highlightId || policies.length === 0) return;

  const row = rowRefs.current[highlightId];
  if (row) {
    row.classList.add("bg-blue-100");
    row.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      row.classList.remove("bg-blue-100");
    }, 5000);
  }
}, [highlightId, policies]);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/leave/myLeavePolicy`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPolicies(data.policies);
    } catch (error) {
      console.error(error);
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
          <div className="mt-4 border border-gray-300 rounded-md overflow-hidden">
            <Table>
                <TableHeader>
                <TableRow className="border-gray-300">
                    <TableHead className="font-semibold text-gray-700">Type</TableHead>
                    <TableHead className="font-semibold text-gray-700">Description</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">
                    Auto-approbation
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">
                    Solde Annuel
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">
                    Utilisé
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">
                    Restant
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {policies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((p) => (
                    <TableRow
                        ref={(el) =>{rowRefs.current[p.id] = el}}
                        key={p.id}
                        className="hover:bg-gray-50 border-b border-gray-300"
                    >
                        <TableCell className="font-medium">{p.type}</TableCell>
                        <TableCell>{p.description || "—"}</TableCell>
                        <TableCell className="text-center">
                        {p.autoApproval ? (
                            <Badge className="bg-green-100 text-green-700">Oui</Badge>
                        ) : (
                            <Badge className="bg-gray-300 text-gray-700">Non</Badge>
                        )}
                        </TableCell>
                        <TableCell className="text-center">
                        {p.totalDays} jours
                        </TableCell>
                        <TableCell className="text-center">
                        {p.usedDays} jours
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                        {p.remaining} jours
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
    </div>
  );
}
