"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { APIURL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Users, Target, Lightbulb, Award, User } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface Criterion {
  id: string;
  name: string;
  description: string;
  score: number | null;
}

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl:string;
  team:string;
}

const criteriaIcons: { [key: string]: any } = {
  performance: TrendingUp,
  qualite: Award,
  ponctualite: Target,
  autonomie: User,
  collaboration: Users,
  initiative: Lightbulb,
};

const criteriaColors: { [key: string]: string } = {
  performance: "text-blue-600 bg-blue-50",
  qualite: "text-purple-600 bg-purple-50",
  ponctualite: "text-green-600 bg-green-50",
  autonomie: "text-orange-600 bg-orange-50",
  collaboration: "text-pink-600 bg-pink-50",
  initiative: "text-yellow-600 bg-yellow-50",
};

export default function ManagerNote() {
  const { employeeId } = useParams();
  const [searchParams] = useSearchParams();
  const month = searchParams.get("month") || (new Date().getMonth() + 1).toString();
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${APIURL}/api/performance/note/${employeeId}?month=${month}&year=${year}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setEmployee(data.employee);
          setCriteria(data.criteria);
        } else {
          toast({ title: "Erreur", description: data.message || "Impossible de récupérer les données" });
        }
      } catch (err) {
        console.error(err);
        toast({ title: "Erreur serveur", description: "Impossible de récupérer les données" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId, month, year]);

  const handleChangeScore = (id: string, value: number) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, score: value } : c))
    );
  };

  const calculateAverage = () => {
    const validScores = criteria.filter(c => c.score !== null).map(c => c.score as number);
    if (validScores.length === 0) return 0;
    return (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1);
  };

  const handleSubmit = async () => {
    if (criteria.some((c) => c.score === null || c.score < 0 || c.score > 10)) {
      toast({ title: "Erreur", description: "Tous les scores doivent être entre 0 et 10" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/performance/evaluations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeId: employeeId,
          month: parseInt(month.toString()),
          year: parseInt(year.toString()),
          scores: criteria.map((c) => ({
            criteriaId: c.id,
            score: c.score,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({ title: "Succès", description: "Évaluation enregistrée" });
        navigate("/manager/performanceList");
      } else {
        toast({ title: "Erreur", description: data.message || "Impossible d'enregistrer l'évaluation" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur serveur", description: "Impossible d'enregistrer l'évaluation" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-6">
      <header className="flex h-16 items-center gap-2 mb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">évaluation</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to={"/manager/performanceList"}>
              <BreadcrumbPage>Liste des évaluations</BreadcrumbPage>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>noté employé</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="rounded-2xl shadow-lg mb-6">
          <CardContent>
            <div className="flex gap-8">
                <img
                  src={(employee?.avatarUrl ? `http://localhost:3005${employee?.avatarUrl}` : "/public/images/default.jpeg")}
                  alt={"huhu"}   
                  className="h-30 w-30 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p className="text-4xl font-medium">{employee?.firstName} {employee?.lastName}</p>
                  <p className="text-sm text-gray-500">{employee?.team || "—"}</p>
                  <p className="text-gray-600 mt-7">
                  Évaluation de Performance du {new Date(month).toLocaleDateString(undefined, { month: "short"})} {year}
                  </p>
                </div>
            </div>
          </CardContent>
        </Card>

        {criteria.length === 0 ? (
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-8">
              <p className="text-gray-600">Aucun critère actif pour la team de cet employé.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Criteria Cards */}
            <div className="space-y-4 mb-6">
              {criteria.map((criterion) => {
                const iconKey = Object.keys(criteriaIcons).find(key => 
                  criterion.name.toLowerCase().includes(key)
                ) || 'performance';
                const Icon = criteriaIcons[iconKey];
                const colorClass = criteriaColors[iconKey];
                const currentRating = criterion.score || 0;
                
                return (
                  <Card key={criterion.id} className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`${colorClass} p-3 rounded-xl`}>
                          <Icon size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800">{criterion.name}</h3>
                          <p className="text-sm text-gray-500">{criterion.description}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold}`}>
                            {criterion.score ?? "-"}
                          </div>
                        </div>
                      </div>

                      {/* Rating Slider */}
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.5"
                          value={currentRating}
                          onChange={(e) => handleChangeScore(criterion.id, parseFloat(e.target.value))}
                          className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${currentRating * 10}%, #e5e7eb ${currentRating * 10}%, #e5e7eb 100%)`
                          }}
                        />
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <span>0</span>
                          <span>2</span>
                          <span>4</span>
                          <span>6</span>
                          <span>8</span>
                          <span>10</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Summary */}
            <Card className="rounded-2xl shadow-lg bg-black text-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Note Moyenne</h2>
                    <p className="text-blue-100">
                      {criteria.filter(c => c.score !== null).length} critère(s) évalué(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-6xl font-bold">{calculateAverage()}</div>
                    <div className="text-xl text-blue-100">/ 10</div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSubmit}
                  className="w-full bg-white text-black font-semibold py-6 hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Enregistrer l'évaluation
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}