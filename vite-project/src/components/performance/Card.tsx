"use client"

import { useEffect, useState } from "react"
import { CardStat } from "../Stat"
import { APIURL } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Award, BarChart3, CheckCircle, Users } from "lucide-react"

export default function PerfCard() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    globalAverage: 0,
    topEmployee: "",
    evaluationRate: 0,
    topTeam: "",
  })

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${APIURL}/api/performance/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      if (res.ok) {
        setStats({
          globalAverage: data.globalAverage || 0,
          topEmployee: data.topEmployee || "Aucun",
          evaluationRate: data.evaluationRate || 0,
          topTeam: data.topTeam || "Aucune",
        })
      } else {
        toast({ title: "Erreur", description: data.message || "Impossible de charger les statistiques" })
      }
    } catch (error) {
      console.error(error)
      toast({ title: "Erreur serveur", description: "Impossible de charger les statistiques" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="w-full space-y-6">
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mt-1">
        <CardStat
          title="Moyenne Générale"
          value={stats.globalAverage.toFixed(2)}
          icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
          loading={loading}
          valueClass="font-['Segoe_UI'] font-medium"
          bg="bg-white"
        />

        <CardStat
          title="Employé du Mois"
          value={stats.topEmployee}
          icon={<Award className="h-5 w-5 text-gray-500" />}
          loading={loading}
          valueClass="font-['Segoe_UI'] font-medium"
          bg="bg-white"
        />

        <CardStat
          title="Taux d'Évaluations"
          value={`${stats.evaluationRate}%`}
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          loading={loading}
          valueClass="font-['Segoe_UI'] font-medium"
          bg="bg-white"
        />

        <CardStat
          title="Équipe la Plus Performante"
          value={stats.topTeam}
          icon={<Users className="h-5 w-5 text-gray-500" />}
          loading={loading}
          valueClass="font-['Segoe_UI'] font-medium"
          bg="bg-white"
        />
      </div>
    </div>
  )
}
