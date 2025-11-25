import MonthlyLeaveLineChart from "@/components/leave/monthlyLeaveStat";
import LeaveTypeStat from "./typeLeaveStat";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { AllStatusLeaveStat } from "./statusLeaveStat";

export default function LeaveStat() {
  return (
    <div className="space-y-6 mx-6">
      <header className="flex h-16 items-center gap-2 mb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">performance</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Liste des employés</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>    
      <AllStatusLeaveStat/>
      <div  className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MonthlyLeaveLineChart />
        <LeaveTypeStat/>
      </div>
    </div>
  );
}
