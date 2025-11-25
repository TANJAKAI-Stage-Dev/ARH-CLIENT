"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APIURL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl:string;
  average: number;
  team?: {
    name: string;
  };
}

export default function TopEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTopEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${APIURL}/api/performance/top5`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setEmployees(data.topEmployees);
        } else {
          toast({ title: "Erreur", description: data.message || "Impossible de charger le top 5" });
        }
      } catch (err) {
        console.error(err);
        toast({ title: "Erreur serveur", description: "Impossible de charger le top 5" });
      } finally {
        setLoading(false);
      }
    };

    fetchTopEmployees();
  }, []);

  if (loading) return <p>Chargement du top 5...</p>;

  return (
    <Card className="shadow-md rounded-2xl p-4 bg-white">
      <CardHeader>
        <CardTitle className="text-4xl font-medium">Top 5 Employés</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {employees.length === 0 ? (
          <p className="text-center text-gray-500">Aucune évaluation trouvée</p>
        ) : (
          employees.map((emp, index) => (
            <div
              key={emp.id}
              className="flex justify-between items-center bg-white-200 p-3 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={(emp.avatarUrl ? `${APIURL}${emp.avatarUrl}` : "/public/images/default.jpeg")}
                  alt={"huhu"}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p className="font-medium">{index + 1}. {emp.firstName} {emp.lastName}</p>
                  <p className="text-sm text-gray-500">{emp.team?.name || "—"}</p>
                </div>
              </div>
              <div className="font-medium">{emp.average.toFixed(2)} / 10</div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
