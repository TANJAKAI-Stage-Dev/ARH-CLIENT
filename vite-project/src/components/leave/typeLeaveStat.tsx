"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { APIURL } from "@/lib/api"

interface LeaveTypeData {
  name: string
  count: number
  [key: string]: string | number
}

const COLORS = [
  "#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe",
  "#f472b6", "#f9a8d4", "#fcd34d", "#fbbf24", "#f97316",
  "#ea580c", "#dc2626"
]

export default function LeaveTypeStat() {
  const [data, setData] = useState<LeaveTypeData[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch(`${APIURL}/api/leave/stats/type`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(res => setData(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="flex justify-between items-start">
        <div>
          <CardTitle className="text-4xl font-['Segoe_UI'] font-medium mb-2">Répartition des congés</CardTitle>
          <CardDescription>
            Pourcentage de chaque type de congé pris cette année
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center">
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 w-full px-6">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span className="text-sm text-muted-foreground">
                {item.name} — <strong>{item.count}</strong>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
