"use client";

import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { APIURL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,} from "@/components/ui/breadcrumb";
import { Progress } from "@/components/ui/progress";
import {ResponsiveContainer,RadarChart,Radar,PolarGrid,PolarAngleAxis,PolarRadiusAxis,Tooltip,} from "recharts";

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

export default function ManagerViewEvaluation() {
  const { employeeId } = useParams();
  const [searchParams] = useSearchParams();
  const month = searchParams.get("month") || (new Date().getMonth() + 1).toString();
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const { toast } = useToast();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [scores, setScores] = useState<CriterionScore[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluation = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${APIURL}/api/performance/evaluations/${employeeId}?month=${month}&year=${year}`, {
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
      } catch (err) {
        console.error(err);
        toast({ title: "Erreur serveur", description: "Impossible de récupérer l'évaluation" });
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [employeeId, month, year]);

  if (loading) return <p>Chargement...</p>;
  if (!employee) return <p>Employé introuvable</p>;

  return (
    <div className="space-y-6 mx-6">
      <header className="flex h-16 items-center gap-2 mb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">evaluations</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage><Link to={"/manager/performanceList"}>Liste des évaluations</Link></BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>détails évaluation</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="bg-white w-full p-8 rounded-2xl shadow-md">
        Évaluation de {employee.firstName} {employee.lastName} — {month}/{year}
      </div>
      <div>
        {scores.length === 0 ? (
          <p>Aucune évaluation disponible pour ce mois.</p>
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

            {/* --- Liste des compétences --- */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-6">Detailed Competency Scores</h3>
              
              <div className="space-y-6">
                {scores.map((score) => (
                  <div key={score.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{score.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{score.score}</span>
                        <span className="text-xs text-gray-500"></span>
                      </div>
                    </div>
                    <Progress value={score.score * 10} className="h-2" />
                    <div className="flex justify-end text-xs text-gray-500">
                      <span>Max: 10</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- Moyenne générale --- */}
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