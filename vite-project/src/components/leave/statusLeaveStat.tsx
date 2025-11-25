import { APIURL } from "@/lib/api";
import { useEffect, useState } from "react";
import { CardStat } from "../Stat";
import { CheckCircle, Clock, ListCheck, XCircle } from "lucide-react";

type LeaveRequest = {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  policy:{
    type:string
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role:string
    avatarUrl:string;
  };
};
export function MyStatusLeaveStat(){
const [leaves,setLeaves] = useState<LeaveRequest[]>([]);

useEffect(() => {
    fetchLeaves();
},[]) 

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${APIURL}/api/leave/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setLeaves(data.leave);
    } catch (error) {
      console.error(error);
    }
  };


const total = leaves.length;
const pending = leaves.filter((l) => l.status === "PENDING").length;
const approved = leaves.filter((l) => l.status === "APPROVED").length;
const rejected = leaves.filter((l) => l.status === "REJECTED").length;

return(
    <>
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mt-1">
        <CardStat title="Total" value={total} icon={<ListCheck className="h-5 w-5 text-blue-500" />}/>
        <CardStat title="En attente" value={pending} icon={<Clock className="h-5 w-5 text-gray-500" />}/>
        <CardStat title="Approuvées" value={approved} icon={<CheckCircle className="h-5 w-5 text-green-500" />}/>
        <CardStat title="Rejetées" value={rejected} icon={<XCircle className="h-5 w-5 text-red-500" />}/>
      </div>
    </>
)
}
export function AllStatusLeaveStat(){
    const [leaves,setLeaves] = useState<LeaveRequest[]>([]);

      useEffect(() => {
        fetchLeaves();
      }, []);

      const fetchLeaves = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${APIURL}/api/leave/list`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok) setLeaves(data.leave);
        } catch (error) {
          console.error("Erreur:", error);
        }
      };

    const total = leaves.length;
    const pending = leaves.filter((l) => l.status === "PENDING").length;
    const approved = leaves.filter((l) => l.status === "APPROVED").length;
    const rejected = leaves.filter((l) => l.status === "REJECTED").length;
    
return(
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mt-1">
        <CardStat title="Total" value={total} icon={<ListCheck className="h-5 w-5 text-blue-500" />} />
        <CardStat title="En attente" value={pending} icon={<Clock className="h-5 w-5 text-gray-500" />} />
        <CardStat title="Approuvées" value={approved} icon={<CheckCircle className="h-5 w-5 text-green-500" />} />
        <CardStat title="Rejetées" value={rejected} icon={<XCircle className="h-5 w-5 text-red-500" />} />
    </div>
)
}