"use client";

import { useEffect, useState } from "react";
import { APIURL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink,BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import { Progress } from "@/components/ui/progress";

import {
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Tooltip
} from "recharts";
import { Link, useSearchParams } from "react-router-dom";

interface CriterionScore {
  id: string;
  name: string;
  description: string;
  score: number;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

export default function MyPerformanceView() {
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [scores, setScores] = useState<CriterionScore[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const month = searchParams.get("month") || (new Date().getMonth() + 1).toString();
  const year  = searchParams.get("year")  || new Date().getFullYear().toString();

  useEffect(() => {
    const fetchMyEvaluation = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch( `${APIURL}/api/performance/MyEvaluations?month=${month}&year=${year}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setEmployee(data.employee);
          setScores(data.scores);
          setAverage(data.average ?? null);
        } else {
          toast({ title: "Erreur", description: data.message || "Impossible de récupérer l'évaluation" });
        }
      } catch (error) {
        console.error(error);
        toast({ title: "Erreur serveur", description: "Impossible de récupérer l'évaluation" });
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvaluation();
  }, [month,year]);

  if (loading) return <p>Chargement...</p>;
  if (!employee) return <p>Aucune évaluation trouvée</p>;

  return (
    <div className="space-y-6 mx-6">
      {/* --- Breadcrumb --- */}
      <header className="flex h-16 items-center gap-2 mb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Performance</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
            <Link to={"/employee/MyPerformanceList"}>
              <BreadcrumbPage>Listes</BreadcrumbPage>
            </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Ma performance</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* --- Header --- */}
      <div className="bg-white w-full p-8 rounded-2xl shadow-md">
        Dernière évaluation de {" "}
        <strong>{employee.firstName} {employee.lastName} — {month}/{year}</strong>
      </div>

      {/* --- Content --- */}
      <div>
        {scores.length === 0 ? (
          <p>Aucune évaluation disponible.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* --- Radar Chart --- */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-center">Performance par critère</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={scores}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                    <Tooltip
                      content={({ payload }) => {
                        if (!payload || payload.length === 0) return null;
                        const item = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-gray-800 shadow-md rounded-md px-3 py-2 border text-sm">
                            <p className="font-semibold">{item.name}</p>
                            <p>Note : {item.score} / 10</p>
                          </div>
                        );
                      }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* --- Detailed Scores --- */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-6">Détails des compétences</h3>

              <div className="space-y-6">
                {scores.map((score) => (
                  <div key={score.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{score.name}</span>
                      <span className="text-sm font-semibold text-gray-900">{score.score}/10</span>
                    </div>
                    
                    <Progress value={score.score * 10} className="h-2" />
                  </div>
                ))}
              </div>

              {/* --- Average --- */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-lg text-center">
                  Moyenne générale: {average !== null ? average.toFixed(2) : "-"}
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
