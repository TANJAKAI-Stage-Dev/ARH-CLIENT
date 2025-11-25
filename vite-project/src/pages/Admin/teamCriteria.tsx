"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,} from "@/components/ui/breadcrumb";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { APIURL } from "@/lib/api";

interface Team {
  id: string;
  name: string;
}

interface Criteria {
  id: string;
  name: string;
  description: string;
  enabled?: boolean; 
}

export default function TeamCriteriaManager() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [criteriaList, setCriteriaList] = useState<Criteria[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const { toast } = useToast();

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/user/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur", description: "Impossible de charger les teams" });
    }
  };

  const fetchCriteria = async (teamId?: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/performance/criteria`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (teamId) {
        const resTeam = await fetch(`${APIURL}/api/performance/teams/${teamId}/criteria`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const teamCriteria = await resTeam.json(); 
        const listWithEnabled = data.map((c: Criteria) => ({
          ...c,
          enabled: teamCriteria.some((tc: any) => tc.criteriaId === c.id && tc.enabled),
        }));
        setCriteriaList(listWithEnabled);
      } else {
        setCriteriaList(data);
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur", description: "Impossible de charger les critères" });
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchCriteria();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchCriteria(selectedTeam);
    }
  }, [selectedTeam]);

  const toggleCriteria = async (criteriaId: string, enabled: boolean) => {
    if (!selectedTeam) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/performance/teams/criteria/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ teamId: selectedTeam, criteriaId, enabled }),
      });
      if (res.ok) {
        setCriteriaList((prev) =>
          prev.map((c) => (c.id === criteriaId ? { ...c, enabled } : c))
        );
        toast({ title: "Succès", description: "Critère mis à jour !" });
      } else {
        const data = await res.json();
        toast({ title: "Erreur", description: data.message || "Impossible de modifier le critère" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur serveur", description: "Impossible de modifier le critère" });
    }
  };

  return (
    <div className="space-y-6 mx-6">
      <header className="flex h-16 items-center gap-2 mb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">configuration</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>critère de performance</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      {/* Select team */}
      <Card className="w-full shadow-lg mt-1">
        <CardHeader>
          <CardTitle>Configurer les critères d'une Team</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedTeam}
            onValueChange={(val) => setSelectedTeam(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une team" />
            </SelectTrigger>
            <SelectContent className="border-gray-300">
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Liste des critères */}
      {selectedTeam && (
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle>Critères existants</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-300">
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Activer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criteriaList.map((c) => (
                  <TableRow key={c.id} className="border-gray-300">
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.description}</TableCell>
                    <TableCell>
                      <Switch
                        checked={c.enabled}
                        onCheckedChange={(val) => toggleCriteria(c.id, val)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
