"use client";
import TopEmployees from "@/components/performance/top-5";
import PerfCard from "@/components/performance/Card";
import TeamChart from "@/components/performance/teamChart";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function PerformanceDash() {
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
              <BreadcrumbPage>performances statistiques</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
        <PerfCard/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TeamChart/>
            <TopEmployees/>
        </div>

    </div>
  );
}
