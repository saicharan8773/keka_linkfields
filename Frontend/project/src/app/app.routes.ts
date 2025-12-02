import { Routes } from "@angular/router";
import { LoginComponent } from "./auth/components/login.component";
import { SignupComponent } from "./auth/components/signup.component";
import { EmployeeListComponent } from "./employee/components/employee-list.component";
import { EmployeeCreateComponent } from "./employee/components/employee-create.component";
import { EmployeeEditComponent } from "./employee/components/employee-edit.component";
import { EmployeeDetailsComponent } from "./employee/components/employee-details.component";
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
    path: "leave",
    loadComponent: () =>
      import("./leave/leave.component").then((m) => m.LeaveComponent),
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
  {
    path: "employees/edit/:id",
    component: EmployeeEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "employees/details/:id",
    component: EmployeeDetailsComponent,
    canActivate: [AuthGuard],
  },
  // Department Routes
  {
    path: "departments",
    loadComponent: () => import('./department/components/department-list.component').then(m => m.DepartmentListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "departments/create",
    loadComponent: () => import('./department/components/department-create.component').then(m => m.DepartmentCreateComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "departments/edit/:id",
    loadComponent: () => import('./department/components/department-edit.component').then(m => m.DepartmentEditComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "departments/details/:id",
    loadComponent: () => import('./department/components/department-details.component').then(m => m.DepartmentDetailsComponent),
    canActivate: [AuthGuard],
  },
  // Designation Routes
  {
    path: "designations",
    loadComponent: () => import('./designation/components/designation-list.component').then(m => m.DesignationListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "designations/create",
    loadComponent: () => import('./designation/components/designation-create.component').then(m => m.DesignationCreateComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "designations/edit/:id",
    loadComponent: () => import('./designation/components/designation-edit.component').then(m => m.DesignationEditComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "designations/details/:id",
    loadComponent: () => import('./designation/components/designation-details.component').then(m => m.DesignationDetailsComponent),
    canActivate: [AuthGuard],
  },
  // Salary Structure Routes
  {
    path: "salary-structures",
    loadComponent: () => import('./salary-structure/components/salary-structure-list.component').then(m => m.SalaryStructureListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "salary-structures/create",
    loadComponent: () => import('./salary-structure/components/salary-structure-create.component').then(m => m.SalaryStructureCreateComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "salary-structures/edit/:id",
    loadComponent: () => import('./salary-structure/components/salary-structure-edit.component').then(m => m.SalaryStructureEditComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "salary-structures/details/:id",
    loadComponent: () => import('./salary-structure/components/salary-structure-details.component').then(m => m.SalaryStructureDetailsComponent),
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "/login" },
];
