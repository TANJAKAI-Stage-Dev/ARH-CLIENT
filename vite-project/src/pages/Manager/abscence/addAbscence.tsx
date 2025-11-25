import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { APIURL } from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export default function AddAbsence() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/user/getAllEmployee`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setEmployees(data.users);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la récupération des employés");
    }
  };

  const handleSubmit = async () => {
    if (!employeeId || !type || !startDate || !endDate) {
      return toast.error("Veuillez remplir tous les champs requis");
    }

    try {
      const totalDays = calculateTotalDays();
      if (totalDays <= 0) {
        toast.error("La date de fin doit être après la date de début");
        return;
      }
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/abscence/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employeeId, type, startDate, endDate, comment }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Absence ajoutée ");
        navigate("/manager/absence"); 
      } else {
        toast.error(data.message || "Erreur lors de l'ajout");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur serveur");
    }finally{
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };
    const handleSubmitClick = () => {
    setShowConfirmDialog(true);
  };

  const calculateTotalDays = () => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};
  const totalDays = calculateTotalDays();


  return (
    <div className="space-y-6 mx-6">
            {/* Breadcrumb */}
      <header className="flex h-16 items-center gap-2 mb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Absences</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
            <Link to={"/manager/absence"}>
              <BreadcrumbPage>Liste</BreadcrumbPage>
            </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>ajouter</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="bg-white rounded-2xl w-full border border-gray-200 p-6 h-160">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ajouter une absence</h1>
        <div className="space-y-5">
            {/* Employee */}
            <div className="flex flex-col gap-2">
                {/* <label className="font-medium">Employé</label> */}
                <Label htmlFor="policyId" className="text-sm font-medium block">
                Employé <span className="text-red-500">*</span>
                </Label>
                <Select value={employeeId} onValueChange={setEmployeeId}>
                <SelectTrigger className="w-64 border-gray-300 p-6">
                    <SelectValue placeholder="Sélectionnez un employé" />
                </SelectTrigger>
                <SelectContent>
                    {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                        {e.firstName} {e.lastName} ({e.email})
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>

            {/* Type */}
            <div className="flex flex-col gap-2">
                {/* <label className="font-medium">Type d'absence</label> */}
                <Label htmlFor="policyId" className="text-sm font-medium block">
                Type<span className="text-red-500">*</span>
                </Label>
                <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-64 border-gray-300 p-6">
                    <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="JUSTIFIED">Justifiée</SelectItem>
                    <SelectItem value="UNJUSTIFIED">Non justifiée</SelectItem>
                    <SelectItem value="MEDICAL">Médicale</SelectItem>
                </SelectContent>
                </Select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <Label htmlFor="startDate" className="text-sm font-medium block">
                    Date début <span className="text-red-500">*</span>
                    </Label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} 
                    className="w-full max-w-xs"
                    />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="endDate" className="text-sm font-medium block">
                    Date fin <span className="text-red-500">*</span>
                    </Label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full max-w-xs"/>
                </div>
            </div>
                        {/* Total days requested */}
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <div className="text-sm font-medium text-gray-900">
                Total de jour demandé: {totalDays}
                </div>
            </div>

            {/* Comment */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="policyId" className="text-sm font-medium block">
                Raison<span className="text-red-500">*</span>
                </Label>
                <Textarea placeholder="Facultatif" value={comment} onChange={(e) => setComment(e.target.value)} 
                className="min-h-[100px] resize-none"
                />
            </div>
        </div>
        <div className="flex justify-end gap-3 pt-8 mt-0">
            <Button variant="success"
            disabled={!startDate || !endDate || isSubmitting}
            onClick={handleSubmitClick}>
                Ajouter
            </Button>
        </div>
      </div>
            {/* Modal de confirmation */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Confirmer la demande</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir soumettre cette demande de congé ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              variant={"success"}
            >
              {isSubmitting ? "Envoi en cours..." : "Confirmer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
