import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AttendanceService } from "../shared/services/attendance.service";
import { AuthService } from "../shared/services/auth.service";
import { Attendance, PunchRequest } from "../shared/models/attendance.model";
import { SidebarComponent } from "../shared/components/sidebar.component";

@Component({
  selector: "app-attendance",
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.css"],
})
export class AttendanceComponent implements OnInit {
  employeeId: string = "";
  isLoading: boolean = false;
  errorMessage: string = "";
  attendance: Attendance | null = null;
  showModal: boolean = false;
  modalMessage: string = "";

  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      this.employeeId = this.getEmployeeIdFromToken(token);
    }
  }

  getEmployeeIdFromToken(token: string): string {
    // JWT is base64 encoded: header.payload.signature
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      // 'sub' is the employee/user id
      return decoded.sub || "";
    } catch (e) {
      return "";
    }
  }

  getLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject("Geolocation not supported");
      }
    });
  }

  async punch(type: "in" | "out") {
    this.isLoading = true;
    this.errorMessage = "";
    try {
      const { latitude, longitude } = await this.getLocation();
      const request: PunchRequest = {
        employeeId: this.employeeId,
        latitude,
        longitude,
      };
      const punch$ =
        type === "in"
          ? this.attendanceService.punchIn(request)
          : this.attendanceService.punchOut(request);
      punch$.subscribe({
        next: (response) => {
          this.attendance = response;
          this.isLoading = false;
          const lastLog = response.punchLogs[response.punchLogs.length - 1];
          if (lastLog && !lastLog.isWithinOfficeRadius) {
            this.modalMessage = `Punch ${type.toUpperCase()} failed: Out of office radius.`;
            this.showModal = true;
          } else {
            this.modalMessage = `Punch ${type.toUpperCase()} successful!`;
            this.showModal = true;
          }
        },
        error: () => {
          this.isLoading = false;
          this.modalMessage = `Punch ${type.toUpperCase()} failed.`;
          this.showModal = true;
        },
      });
    } catch (err) {
      this.isLoading = false;
      this.modalMessage = "Could not get location.";
      this.showModal = true;
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.modalMessage = "";
  }
}
