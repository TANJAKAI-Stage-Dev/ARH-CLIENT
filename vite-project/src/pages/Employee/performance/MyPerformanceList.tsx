"use client";

import { useEffect, useRef, useState } from "react";
import { APIURL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink,BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {Card,CardHeader,CardTitle,CardContent,} from "@/components/ui/card";
import { Link, useLocation } from "react-router-dom";

interface EvalMonth {
  id:string;
  month: number;
  year: number;
  average: number;
}

export default function MyPerformanceList() {
  const { toast } = useToast();
  const [data, setData] = useState<EvalMonth[]>([]);
  const [loading, setLoading] = useState(true);
    const location = useLocation();
  const highlightId = location.state?.highlightId;
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});
  useEffect(() => {
  if (!highlightId || data.length === 0) return;

  const row = rowRefs.current[highlightId];
  if (row) {
    row.classList.add("bg-blue-100");
    row.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      row.classList.remove("bg-blue-100");
    }, 5000);
  }
}, [highlightId, data]);


  useEffect(() => {
    const fetchMonths = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${APIURL}/api/performance/MyEvaluatedMonths`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();

        if (!res.ok) {
          toast({ title: "Erreur", description: result.message });
          return;
        }

        setData(result.months);
      } catch (error) {
        toast({ title: "Erreur serveur", description: "Impossible de récupérer les évaluations" });
      } finally {
        setLoading(false);
      }
    };

    fetchMonths();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (data.length === 0) return <p>Aucune évaluation disponible.</p>;

  return (
    <div className="space-y-6 mx-6">
      <header className="flex h-16 items-center gap-2 mb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Performance</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Listes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <h2 className="text-2xl font-bold">Mes évaluations mensuelles</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {data.map((item, index) => (
          <Link
            key={item.id}
            // ref={(el) =>{rowRefs.current[item.id] = el}}
            to={`/employee/myperformance?month=${item.month}&year=${item.year}`}
          >
            <Card className="cursor-pointer hover:shadow-xl transition-all duration-200 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">
                  Évaluation — {item.month}/{item.year}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600">Moyenne générale :</p>
                <p className="text-3xl font-bold mt-2">{item.average.toFixed(2)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}

      </div>
    </div>
  );
}
