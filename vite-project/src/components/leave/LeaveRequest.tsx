import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { APIURL } from "@/lib/api";
import { PaperclipIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type Policy = {
  id: string;
  type: string;
  annualBalance: number;
  remaining:number;
};

type LeaveFormData = {
  policyId: string;
  startDate: string;
  endDate: string;
  reason: string;
  document: File | null;
};

export default function CreateLeaveRequest() {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [balances, setBalances] = useState<{ [key: string]: number }>({});
  const [form, setForm] = useState<LeaveFormData>({
    policyId: "",
    startDate: "",
    endDate: "",
    reason: "",
    document: null,
  });
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/leave/myLeavePolicy`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPolicies(data.policies || []);
        const balancesObj: { [key: string]: number } = {};
        data.policies.forEach((policy: Policy) => {
          balancesObj[policy.id] = policy.remaining;
        });
        setBalances(balancesObj);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des types de congé");
    }
  };

  const handlePolicyChange = (policyId: string) => {
    const policy = policies.find(p => p.id === policyId) || null;
    setSelectedPolicy(policy);
    setForm(prev => ({ ...prev, policyId }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, document: file }));
  };

  const calculateTotalDays = () => {
    if (!form.startDate || !form.endDate) return 0;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = async () => {
    try {
      if (!form.policyId || !form.startDate || !form.endDate) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      const totalDays = calculateTotalDays();
      if (totalDays <= 0) {
        toast.error("La date de fin doit être après la date de début");
        return;
      }

      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("policyId", form.policyId);
      formData.append("startDate", form.startDate);
      formData.append("endDate", form.endDate);
      formData.append("reason", form.reason);
      if (form.document) formData.append("document", form.document);

      const res = await fetch(`${APIURL}/api/leave/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Demande de congé créée avec succès ✅");
        navigate("/employee/MyLeave");
      } else {
        if (data.message === "vous avez déjà une demande en attente ou approuvée sur cette période") {
          toast.error("Vous avez déjà une demande sur cette période !");
        } else if (data.message === "Solde de congé insuffisant") {
          toast.error("Solde de congé insuffisant !");
        } else if (data.message === "La date fin doit etre après la date de début") {
          toast.error("La date de fin doit être après la date de début !");
        } else {
          toast.error(data.message || "Erreur lors de la création");
        }
      }
    } catch (error) {
      toast.error("Erreur serveur");
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  const handleSubmitClick = () => {
    setShowConfirmDialog(true);
  };

  const totalDays = calculateTotalDays();

  return (
    <div className="space-y-6 mx-6">
      <header className="flex h-16 items-center gap-2 mb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Congés</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to={"/employee/MyLeave"}>
              <BreadcrumbPage>Mes demandes</BreadcrumbPage>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>faire une demande</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* Formulaire principal */}
      <div className="bg-white rounded-2xl w-full border border-gray-200 p-6 h-160">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Demande de congé</h1>
            
            <div className="space-y-5">
            {/* Leave Type */}
            <div className="space-y-3">
                <Label htmlFor="policyId" className="text-sm font-medium block">
                Type de congé <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-4">
                    <Select value={form.policyId} onValueChange={handlePolicyChange}>
                        <SelectTrigger className="w-56 border-gray-300 p-6 cursor-pointer">
                            <SelectValue placeholder="Type de congé"></SelectValue>
                        </SelectTrigger>
                        <SelectContent className="border-gray-300">
                            {policies.map(policy => (
                            <SelectItem key={policy.id} value={policy.id} >
                                {policy.type}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {selectedPolicy && (
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                        Solde restant: {balances[selectedPolicy.id] || 0} jours
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Start Date */}
                <div className="space-y-3">
                    <Label htmlFor="startDate" className="text-sm font-medium block">
                    Date début <span className="text-red-500">*</span>
                    </Label>
                    <Input
                    id="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full max-w-xs"
                    />
                </div>

                {/* End Date */}
                <div className="space-y-3">
                    <Label htmlFor="endDate" className="text-sm font-medium block">
                    Date fin <span className="text-red-500">*</span>
                    </Label>
                    <Input
                    id="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full max-w-xs"
                    />
                </div>
            </div>

            {/* Total days requested */}
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <div className="text-sm font-medium text-gray-900">
                Total de jour demandé: {totalDays}
                </div>
            </div>

            {/* Reason */}
            <div className="space-y-3">
                <Label htmlFor="reason" className="text-sm font-medium block">
                Raison
                </Label>
                <Textarea
                id="reason"
                placeholder="Facultatif..."
                value={form.reason}
                onChange={(e) => setForm(prev => ({ ...prev, reason: e.target.value }))}
                className="min-h-[100px] resize-none"
                />
            </div>

            {/* Document Upload */}
            <div className="space-y-3">
                <Label htmlFor="document" className="text-sm font-medium flex items-center gap-2">
                <PaperclipIcon className="w-4 h-4" />
                Joindre un justificatif
                </Label>
                <Input
                id="document"
                type="file"
                onChange={handleFileChange}
                className="w-full max-w-md"
                />
            </div>
            </div>
            {/* Boutons d'action */}
            <div className="flex justify-end gap-3 pt-8 mt-0">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/employee/MyLeave")}
                    disabled={isSubmitting}
                    className="border-gray-400"
                >
                    Annuler
                </Button>
                <Button
                    variant={"success"}
                    type="button"
                    onClick={handleSubmitClick}
                    disabled={!form.policyId || !form.startDate || !form.endDate || isSubmitting}
                >
                    {isSubmitting ? "Envoi en cours..." : "Soumettre une demande"}
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