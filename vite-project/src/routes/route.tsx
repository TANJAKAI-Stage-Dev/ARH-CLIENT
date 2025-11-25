import { BrowserRouter as Router, Routes, Route,} from "react-router-dom";
import LandingPage from "@/pages/landingPage";
import Login from "@/pages/logIn";
import AdminLayout from "@/layouts/AdminLayout";
import DashboardAdmin from "@/pages/Admin/DashboardAdmin";
import SetupPassword from "@/pages/SetupPassword";
import UserManagement from "@/pages/Admin/UserManagment";
import ManagerLayout from "@/layouts/ManagerLayout";
import DashboardManager from "@/pages/Manager/DashboardManager";
import EmployeeLayout from "@/layouts/EmployeeLayout";
import DashboardEmployee from "@/pages/Employee/DashboardEmployee";
import AdminLeaveList from "@/pages/Admin/leave/AdminLeaveList";
import ManagerLeaveList from "@/pages/Manager/leave/ManagerLeaveList";
import ProfilePage from "@/pages/profilPage";
import LeavePolicyAdmin from "@/pages/Admin/leave/LeavePolicy";
import MyLeavePolicyEmployee from "@/components/leave/MyLeavePolicy";
import TeamManagement from "@/pages/Admin/team";
import TeamCriteriaManager from "@/pages/Admin/teamCriteria";
import ManagerNote from "@/pages/Manager/performance/NoteEmployee";
import PerformanceDash from "@/pages/Manager/performance/PerformanceDash";
import PerformanceList from "@/pages/Manager/performance/PerformanceList";
import ManagerViewEvaluation from "@/pages/Manager/performance/PerformanceView";
import MyPerformance from "@/pages/Employee/performance/myPerformance";
import MyPerformanceList from "@/pages/Employee/performance/MyPerformanceList";
import LeaveStat from "@/components/leave/LeaveStat";
import MyLeave from "@/components/leave/MyLeave";
import CreateLeaveRequest from "@/components/leave/LeaveRequest";
import EditLeaveRequest from "@/components/leave/EditLeaveRequest";
import AbsenceList from "@/pages/Manager/abscence/abscence";
import AddAbsence from "@/pages/Manager/abscence/addAbscence";

function AppRoute(){
    return(
        <Router>
            <Routes>
                <Route index element={<LandingPage/>}/>
                <Route path="/landingPage" element={<LandingPage/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/setupPwd" element={<SetupPassword/>}/>
                <Route path="admin/" element={<AdminLayout/>}>
                    <Route index element={<DashboardAdmin/>}/> 
                    <Route path="dashboard" element={<DashboardAdmin/>}/>
                    <Route path="User" element={<UserManagement/>}/>
                    <Route path="LeaveList" element={<AdminLeaveList/>}/>
                    <Route path="LeavePolicy" element={<LeavePolicyAdmin/>}/>
                    <Route path="team" element={<TeamManagement/>}/>
                    <Route path="teamCriteria" element={<TeamCriteriaManager/>}/>
                </Route>
                <Route path="manager/" element={<ManagerLayout/>}>
                    <Route index element={<DashboardManager/>}/> 
                    <Route path="dashboard" element={<DashboardManager/>}/>
                    <Route path="MyLeave" element={<MyLeave/>}/>
                    <Route path="MyLeave/LeaveRequest" element={<CreateLeaveRequest/>}/>
                    <Route path="MyLeave/EditLeaveRequest/:id" element={<EditLeaveRequest/>}/>
                    <Route path="myLeavePolicy" element={<MyLeavePolicyEmployee/>}/>
                    <Route path="LeaveList" element={<ManagerLeaveList/>}/>
                    <Route path="performanceDash" element={<PerformanceDash/>}/>
                    <Route path="performanceList" element={<PerformanceList/>}/>
                    <Route path="note/:employeeId" element={<ManagerNote/>}/>
                    <Route path="view/:employeeId" element={<ManagerViewEvaluation/>}/>
                    <Route path="LeaveStat" element={<LeaveStat/>}/>
                    <Route path="absence" element={<AbsenceList/>}/>
                    <Route path="Addabsence" element={<AddAbsence/>}/>
                </Route>
                <Route path="employee/" element={<EmployeeLayout/>}>
                    <Route index element={<DashboardEmployee/>}/> 
                    <Route path="dashboard" element={<DashboardEmployee/>}/>
                    <Route path="MyLeave" element={<MyLeave/>}/>
                    <Route path="MyLeave/LeaveRequest" element={<CreateLeaveRequest/>}/>
                    <Route path="profile" element={<ProfilePage/>}/>
                    <Route path="MyLeave/EditLeaveRequest/:id" element={<EditLeaveRequest/>}/>
                    <Route path="myLeavePolicy" element={<MyLeavePolicyEmployee/>}/>
                    <Route path="myPerformance" element={<MyPerformance/>}/>
                    <Route path="myPerformanceList" element={<MyPerformanceList/>}/>
                </Route>
            </Routes>
        </Router>
    )
}
export default AppRoute;