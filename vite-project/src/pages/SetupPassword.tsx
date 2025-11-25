import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { useToast } from "../hooks/use-toast"
import { APIURL } from "@/lib/api"

export default function SetupPassword() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("token");
      const response = await fetch(`${APIURL}/api/auth/setup-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Votre mot de passe a été configuré avec succès.",
        })
        navigate("/login")
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Une erreur est survenue.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Erreur",
        description: "Impossible de configurer le mot de passe.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#111111]">
      <Card className="w-[400px] shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Configurer votre mot de passe
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirmez votre mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <CardFooter className="flex justify-center pt-4">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Enregistrement..." : "Valider"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
