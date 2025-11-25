import LeaveList from "@/components/leave/LeaveList";

export default function AdminLeaveList(){
  return(
    <LeaveList currentUserRole="ADMIN" />
  )
}