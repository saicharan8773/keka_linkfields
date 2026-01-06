import { Routes } from "@angular/router";
import { LoginComponent } from "./auth/components/login.component";
import { SignupComponent } from "./auth/components/signup.component";
import { EmployeeListComponent } from "./employee/components/employee-list.component";
import { EmployeeCreateComponent } from "./employee/components/employee-create.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProfileComponent } from "./profile/profile.component";
import { AttendanceComponent } from "./attendance/attendance.component";
import { AuthGuard } from "./shared/guards/auth.guard";

export const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "profile",
    component: ProfileComponent,
  },
  {
    path: "attendance",
    component: AttendanceComponent,
    canActivate: [AuthGuard],
  },

  {
    path: "employees",
    component: EmployeeListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "employees/create",
    component: EmployeeCreateComponent,
    canActivate: [AuthGuard],
  },
  // Department Routes
  {
    path: "departments",
    loadComponent: () => import('./department/components/department-list.component').then(m => m.DepartmentListComponent),
    canActivate: [AuthGuard],
  },
  // Designation Routes
  {
    path: "designations",
    loadComponent: () => import('./designation/components/designation-list.component').then(m => m.DesignationListComponent),
    canActivate: [AuthGuard],
  },
  // Salary Structure Routes
  {
    path: "salary-structures",
    loadComponent: () => import('./salary-structure/components/salary-structure-list.component').then(m => m.SalaryStructureListComponent),
    canActivate: [AuthGuard],
  },
  // Team Routes
  {
    path: "teams",
    loadComponent: () => import('./team/components/team-list.component').then(m => m.TeamListComponent),
    canActivate: [AuthGuard],
  },
  // Job Routes
  {
    path: "jobs",
    loadComponent: () => import('./jobs/components/job-list.component').then(m => m.JobListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "leave",
    loadComponent: () => import('./features/leave/leave.component').then(m => m.LeaveComponent),
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "/login" },
];
