import { APIURL } from "@/lib/api";
import { useEffect, useState } from "react";
import { CardStat } from "@/components/Stat";
import { ListCheck, CheckCircle, XCircle, Stethoscope } from "lucide-react";

type Absence = {
  id: string;
  type: "JUSTIFIED" | "UNJUSTIFIED" | "MEDICAL";
  startDate: string;
  endDate: string;
  comment?: string;
  employee: {
    firstName: string;
    lastName: string;
  };
};

export function AbsenceStat() {
  const [absences, setAbsences] = useState<Absence[]>([]);

  useEffect(() => {
    fetchAbsences();
  }, []);

  const fetchAbsences = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/abscence/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setAbsences(data);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Calculs stats
  const total = absences.length;
  const justified = absences.filter((a) => a.type === "JUSTIFIED").length;
  const unjustified = absences.filter((a) => a.type === "UNJUSTIFIED").length;
  const medical = absences.filter((a) => a.type === "MEDICAL").length;

  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mt-1">
      <CardStat title="Total absences" value={total} icon={<ListCheck className="h-5 w-5 text-blue-500" />} />
      <CardStat title="Justifiées" value={justified} icon={<CheckCircle className="h-5 w-5 text-green-500" />} />
      <CardStat title="Non justifiées" value={unjustified} icon={<XCircle className="h-5 w-5 text-red-500" />} />
      <CardStat title="Medical" value={medical} icon={<Stethoscope className="h-5 w-5 text-purple-500" />} />
    </div>
  );
}
