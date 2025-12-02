import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AttendanceService } from "../shared/services/attendance.service";
import { AuthService } from "../shared/services/auth.service";
import { CreateRequest } from "../shared/models/CreateRequest.model";
import { SidebarComponent } from "../shared/components/sidebar.component";

@Component({
  selector: "app-attendance",
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.css"],
})
export class AttendanceComponent implements OnInit {
  userId = this.authService.getUserId();
  month = new Date().toISOString().slice(0, 7);
  monthlyData: any[] = [];
  statusMessage = "";
  loginSuccess = false;
  logoutSuccess = false;
  toastMessage = "";
  toastType: string = "";

  showLeaveForm = false;
  leaveRequest: CreateRequest = {
    leaveType: "",
    startDate: "",
    endDate: "",
    isHalfDay: false,
    managerId: "",
    reason: "",
    attachmentUrl: [],
  };

  Managers: any[] = [];

  // Pagination
  page = 1;
  pageSize = 10;
  get pagedData() {
    const start = (this.page - 1) * this.pageSize;
    return this.monthlyData.slice(start, start + this.pageSize);
  }
  get totalPages() {
    return Math.ceil(this.monthlyData.length / this.pageSize);
  }

  constructor(
    private svc: AttendanceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadMonthly();
  }

  private getLocationAndCall(action: "login" | "logout") {
    if (!navigator.geolocation) {
      this.statusMessage = "Geolocation not supported";
      this.showToast(this.statusMessage, "error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (action === "login")
          this.svc.login(this.userId, lat, lng).subscribe({
            next: (r: any) => {
              this.statusMessage = r.message;
              this.loginSuccess = !!r.success;
              this.showToast(r.message, r.success ? "success" : "error");
              this.loadMonthly();
            },
            error: (e) => {
              this.statusMessage = e.error?.message || "Login failed";
              this.loginSuccess = false;
              this.showToast(this.statusMessage, "error");
            },
          });
        else
          this.svc.logout(this.userId, lat, lng).subscribe({
            next: (r: any) => {
              this.statusMessage = r.message;
              this.logoutSuccess = !!r.success;
              this.showToast(r.message, r.success ? "success" : "error");
              this.loadMonthly();
            },
            error: (e) => {
              this.statusMessage = e.error?.message || "Logout failed";
              this.logoutSuccess = false;
              this.showToast(this.statusMessage, "error");
            },
          });
      },
      (err) => this.showToast("Unable to get location: " + err.message, "error")
    );
  }

  onLogin() {
    this.getLocationAndCall("login");
  }

  onLogout() {
    this.getLocationAndCall("logout");
  }

  showToast(message: string, type: "success" | "error" = "success") {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = "";
      this.toastType = "";
    }, 3000);
  }

  loadMonthly() {
    this.svc.monthly(this.userId, this.month).subscribe({
      next: (res: any) => {
        this.monthlyData = res;
        this.page = 1; // Reset to first page on reload
      },
      error: (err) =>
        this.showToast("Failed to load monthly data: " + err.message, "error"),
    });
  }

  OnRequestSubmit() {
    this.svc.SubmitLeaveRequest(this.leaveRequest).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.showToast("Leave request submitted successfully", "success");
        }
      },
      error: (err) =>
        this.showToast(
          "Failed to submit leave request: " + err.message,
          "error"
        ),
    });
  }

  LoadManagers(event: any) {
    this.svc.getManagers().subscribe({
      next: (res: any) => {
        this.Managers = res;
      },
      error: (err) =>
        this.showToast("Failed to load managers: " + err.message, "error"),
    });
    const selectedManagerId = event.target.value;
    this.leaveRequest.managerId = selectedManagerId;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
    }
  }
}
