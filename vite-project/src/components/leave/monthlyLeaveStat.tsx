"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { APIURL } from "@/lib/api"

interface MonthData {
  month: string
  count: number
}

const MONTHS_FR = ["janv", "févr", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"]

export default function MonthlyLeaveLineChart() {
  const [data, setData] = useState<MonthData[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch(`${APIURL}/api/leave/stats/monthly`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => setData(res.months))
      .catch((err) => console.error(err))
  }, [])

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="flex justify-between items-start">
        <div>
          <CardTitle className="text-4xl font-['Segoe_UI'] font-medium mb-2">Congés par mois</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Statistiques des congés approuvés cette année
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
          <ResponsiveContainer width="100%" height={300} className="p-0">
            <LineChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const monthNumber = parseInt(value.slice(5, 7), 10) - 1
                  return MONTHS_FR[monthNumber] || value
                }}
              />
              {/* <YAxis allowDecimals={false}/> */}
              <Tooltip />
              <Line
                dataKey="count"
                type="monotone"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ fill: "#4f46e5" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Total des congés cette année <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Chaque point correspond au nombre de congés approuvés pour le mois
        </div>
      </CardFooter>
    </Card>
  )
}
