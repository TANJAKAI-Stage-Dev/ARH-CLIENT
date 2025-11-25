"use client";

import { useEffect, useState } from "react";
import { APIURL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";

interface ChartPoint {
  month: number;
  year: number;
  average: number;
}

export default function TeamChart() {
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const { toast } = useToast();

  const monthNames = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

  const firstMonth = chartData[0]?.month;
  // const firstYear = chartData[0]?.year;
  const lastMonth = chartData[chartData.length - 1]?.month;
  const lastYear = chartData[chartData.length - 1]?.year;
  const fetchTeams = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${APIURL}/api/performance/teams/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTeams(data.teams);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les teams" });
    }
  };

  const fetchChart = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${APIURL}/api/performance/chart/teams?teamId=${selectedTeam}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setChartData(data.data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger le chart" });
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchChart();
  }, []);

  useEffect(() => {
    fetchChart();
  }, [selectedTeam]);

  return (
  <Card className="w-full shadow-lg">
    <CardHeader className="flex justify-between items-start">
      <div>
        <CardTitle className="text-4xl font-medium mb-2">Statistiques d'evaluation</CardTitle>
        <CardDescription>
              {firstMonth && lastMonth
        ? `${monthNames[firstMonth - 1]} - ${monthNames[lastMonth - 1]} ${lastYear}`
        : "Derniers 6 mois"}
        </CardDescription>
      </div>
      <Select value={selectedTeam} onValueChange={setSelectedTeam}>
        <SelectTrigger className="w-56 border-gray-400 p-6 cursor-pointer">
          <SelectValue placeholder="Team" />
        </SelectTrigger>
        <SelectContent className="border-gray-300">
          {teams.map((t) => (
            <SelectItem key={t.id} value={t.id} className="cursor-pointer">{t.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </CardHeader>

    <CardContent>
      <ResponsiveContainer width="100%" height={300} className="p-0">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey={(d) => `${monthNames[d.month - 1].slice(0, 3)} ${d.year}`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={{ backgroundColor: "white", borderRadius: 8 }} />
          <Bar dataKey="average" fill="var(--chart-1)" radius={8} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>

    <CardFooter className="flex-col items-start gap-2 text-sm">
      <div className="flex gap-2 leading-none font-medium">
        Moyenne globale sur les 6 derniers mois <TrendingUp className="h-4 w-4" />
      </div>
    </CardFooter>
  </Card>
  );
}
