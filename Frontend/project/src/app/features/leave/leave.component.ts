import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Chart, registerables } from "chart.js";
import { LeaveService } from "../../shared/services/leave.service";
import { AuthService } from "../../shared/services/auth.service";
import { LeaveRequestModalComponent } from "./leave-request-modal/leave-request-modal.component";
import { RejectModalComponent } from "./reject-modal/reject-modal.component";
import { ApproveModalComponent } from "./approve-modal/approve-modal.component";
import { SidebarComponent } from "../../shared/components/sidebar.component";
import {
  LeaveTypeAvailabilityDto,
  LeaveHistoryItemDto,
  PendingLeaveRequest,
} from "../../shared/models/leave.model";

Chart.register(...registerables);

@Component({
  selector: "app-leave",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LeaveRequestModalComponent,
    ApproveModalComponent,
    RejectModalComponent,
    SidebarComponent,
  ],
  templateUrl: "./leave.component.html",
  styleUrls: ["./leave.component.css"],
})
export class LeaveComponent implements OnInit, AfterViewInit {
  @ViewChild("weeklyChart") weeklyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild("consumedChart") consumedChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild("monthlyChart") monthlyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild("requestModal") requestModal!: LeaveRequestModalComponent;
  @ViewChild("rejectModal") rejectModal!: RejectModalComponent;
  @ViewChild("approveModal") approveModal!: ApproveModalComponent;
  currentApproveRequestCode: string = "";

  // Helper for template
  Math = Math;

  employeeId: string = "";
  leaveBalances: LeaveTypeAvailabilityDto[] = [];
  leaveHistory: LeaveHistoryItemDto[] = [];
  filteredHistory: LeaveHistoryItemDto[] = [];

  // Approval functionality
  pendingLeaves: PendingLeaveRequest[] = [];
  userRole: string | null = null;
  isManagerOrHR: boolean = false;
  currentRejectRequestCode: string = "";
  loadingRequests: Set<string> = new Set();

  // Toast notification
  toastMessage: string = "";
  toastVisible: boolean = false;
  toastType: "success" | "error" | "info" = "info";

  // Chart instances (to destroy them before redrawing if needed)
  private weeklyChartInstance: any = null;
  private consumedChartInstance: any = null;
  private monthlyChartInstance: any = null;

  // Donut helpers for SVG rings
  donutRadius = 60; // matches SVG r
  donutCircumference: number = 2 * Math.PI * this.donutRadius;

  // Filters and Pagination
  selectedTypeFilter: string = "All";
  selectedStatusFilter: string = "All";
  searchTerm: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 1;

  constructor(
    private leaveService: LeaveService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.employeeId = this.authService.getEmployeeId() || "";
    this.userRole = this.authService.getUserRole();
    this.isManagerOrHR = this.userRole === "Manager" || this.userRole === "HR";

    // Debug logging
    console.log("🔍 User Role:", this.userRole);
    console.log("🔍 Is Manager or HR:", this.isManagerOrHR);

    this.loadLeaveBalances();
    this.loadLeaveHistory();

    // Load pending leaves if user is Manager or HR
    if (this.isManagerOrHR) {
      console.log("✅ Loading pending leaves for Manager/HR");
      this.loadPendingLeaves();
    } else {
      console.log("❌ Not loading pending leaves - user is not Manager/HR");
    }
  }

  ngAfterViewInit(): void {
    // We load charts here because the canvas elements need to be in the DOM
    this.loadCharts();

    // Check URL for action=apply to auto-open the modal
    this.route.queryParams.subscribe((params) => {
      if (params["action"] === "apply") {
        setTimeout(() => {
          this.openRequestModal();
        });
      }
    });
  }

  loadLeaveBalances() {
    if (!this.employeeId) return;
    this.leaveService.getLeaveTypes().subscribe({
      next: (data: any) => {
        this.leaveBalances = data.map((item: any) => {
          const quota = this.getLeaveQuota(item.leaveTypeName);
          // Calculate consumed: Quota - Remaining (if not unlimited)
          // If remaining > quota (e.g. carry forward), consumed is 0 for this logic, or we can just show 0.
          const consumed = item.isUnlimited
            ? 0
            : Math.max(0, quota - item.remainingDays);

          return {
            ...item,
            consumed: consumed,
            accrued: item.remainingDays,
            annualQuota: item.isUnlimited ? "∞" : quota,
          };
        });

        // Ensure Comp Offs exists for UI demo if not in backend
        if (!this.leaveBalances.find((b) => b.leaveTypeName === "Comp Offs")) {
          this.leaveBalances.push({
            leaveTypeName: "Comp Offs",
            remainingDays: 0,
            leaveTypeId: 999,
            isUnlimited: false,
            consumed: 0,
            accrued: 0,
            annualQuota: 15,
          } as any);
        }
      },
      error: (err) => console.error("Error loading balances", err),
    });
  }

  getLeaveQuota(typeName: string): number {
    const name = (typeName || "").toLowerCase();
    if (name.includes("casual")) return 8;
    if (name.includes("comp") || name.includes("compensatory")) return 15;
    if (name.includes("earned") || name.includes("privilege")) return 15;
    if (name.includes("floater")) return 3;
    if (name.includes("maternity")) return 182;
    if (name.includes("sick")) return 10;
    if (name.includes("paternity")) return 14;
    return 0;
  }

  getBalanceColor(type: string): string {
    type = type.toLowerCase();

    if (type.includes("casual")) return "#74b9ff"; // Soft Blue
    if (type.includes("earned") || type.includes("privilege")) return "#48b4a2"; // Teal
    if (type.includes("sick")) return "#ff6b6b"; // Coral Red
    if (type.includes("comp")) return "#ffd166"; // Gold
    if (type.includes("floater")) return "#c8d7ff"; // Light Blue

    return "#dfe6e9"; // Gray fallback
  }

  // Helper used by SVG donut bindings in template
  getDonutOffset(balance: any): number {
    const circumference = this.donutCircumference;
    const remaining = Number(balance?.remainingDays) || 0;
    const quota = Number(balance?.annualQuota) || 0;

    if (balance?.isUnlimited || !quota || quota === Infinity) {
      return 0; // full circle
    }

    // Clamp percent between 0..1
    const percent = Math.max(0, Math.min(1, remaining / quota));
    return Math.round(circumference * (1 - percent));
  }

  loadCharts() {
    if (!this.employeeId) return;

    const kekaPurple = "#9b88cd";
    const kekaPurpleLight = "#b9aadd";

    // 1. Weekly Pattern (API returns: [0, 0, 0, 0, 1, 0, 0])
    this.leaveService.getWeeklyApprovedPatterns(this.employeeId).subscribe({
      next: (data) => {
        if (this.weeklyChartRef && this.weeklyChartRef.nativeElement) {
          // Destroy existing if re-loading
          if (this.weeklyChartInstance) this.weeklyChartInstance.destroy();

          this.weeklyChartInstance = new Chart(
            this.weeklyChartRef.nativeElement,
            {
              type: "bar",
              data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                  {
                    data: data, // Using real API data
                    backgroundColor: "#283a4d", // navy bars
                    borderRadius: 2,
                    barThickness: 25,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { display: false, beginAtZero: true },
                  x: {
                    grid: { display: false },
                    ticks: {
                      color: "#6b7280",
                      font: { size: 11 },
                      maxRotation: 90,
                      minRotation: 90,
                    },
                  },
                },
              },
            }
          );
        }
      },
      error: (err) => console.error("Failed to load weekly stats", err),
    });

    // 2. Consumed Leave Types (API returns: [{ "name": "Casual Leave", "value": 1 }])
    this.leaveService.getConsumedLeaveTypesStats(this.employeeId).subscribe({
      next: (data) => {
        if (this.consumedChartRef && this.consumedChartRef.nativeElement) {
          if (this.consumedChartInstance) this.consumedChartInstance.destroy();

          // Extract labels and values
          const labels = data.map((d) => d.name);
          const values = data.map((d) => d.value);

          // Colors palette (employees page theme - use distinct, high-contrast colors)
          const donutColors = [
            "#283a4d", // primary navy
            "#ffd166", // gold accent
            "#06b6d4", // teal
            "#10b981", // green
            "#ff7a59", // warm coral
          ];

          this.consumedChartInstance = new Chart(
            this.consumedChartRef.nativeElement,
            {
              type: "doughnut",
              data: {
                labels: labels,
                datasets: [
                  {
                    data: values, // Using real API data
                    backgroundColor: donutColors,
                    borderWidth: 0,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "65%",
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    enabled: true,
                    callbacks: {
                      label: (context) => {
                        const label = context.label || "";
                        const val = context.raw || 0;
                        return `${label}: ${val} days`;
                      },
                    },
                  },
                },
              },
            }
          );
        }
      },
      error: (err) => console.error("Failed to load consumed stats", err),
    });

    // 3. Monthly Stats (API returns: [0, 0, ..., 1])
    this.leaveService.getMonthlyApprovedStats(this.employeeId).subscribe({
      next: (data) => {
        if (this.monthlyChartRef && this.monthlyChartRef.nativeElement) {
          if (this.monthlyChartInstance) this.monthlyChartInstance.destroy();

          this.monthlyChartInstance = new Chart(
            this.monthlyChartRef.nativeElement,
            {
              type: "bar",
              data: {
                labels: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
                datasets: [
                  {
                    data: data, // Using real API data
                    backgroundColor: "#ffd166", // gold bars
                    borderRadius: 2,
                    barThickness: 20,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { display: false, beginAtZero: true },
                  x: {
                    grid: { display: false },
                    ticks: {
                      color: "#6b7280",
                      font: { size: 10 },
                    },
                  },
                },
              },
            }
          );
        }
      },
      error: (err) => console.error("Failed to load monthly stats", err),
    });
  }

  loadLeaveHistory() {
    if (!this.employeeId) return;
    this.leaveService.getLeaveHistory(this.employeeId).subscribe({
      next: (data: any) => {
        this.leaveHistory = data;
        this.applyFilters();
      },
      error: (err) => console.error("Error loading history", err),
    });
  }

  applyFilters() {
    this.filteredHistory = this.leaveHistory.filter((item) => {
      const matchesStatus =
        this.selectedStatusFilter === "All" ||
        item.status === this.selectedStatusFilter;
      return matchesStatus;
    });
    this.totalPages = Math.ceil(
      this.filteredHistory.length / this.itemsPerPage
    );
    this.currentPage = 1;
  }

  get paginatedHistory() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredHistory.slice(start, start + this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  openRequestModal() {
    this.requestModal.open();
  }

  onRequestSubmitted() {
    this.loadLeaveBalances();
    this.loadLeaveHistory();
    this.loadCharts();
  }

  // ========== Approval Functionality ==========

  loadPendingLeaves() {
    console.log("📡 Calling API: GET /api/Leave/pending");
    this.leaveService.getPendingLeaves().subscribe({
      next: (data) => {
        console.log("✅ Pending leaves received:", data);
        console.log("📊 Number of pending leaves:", data.length);
        this.pendingLeaves = data;
      },
      error: (err) => {
        console.error("❌ Error loading pending leaves:", err);
        console.error("Error details:", err.error);
        console.error("Status:", err.status);
        this.showToast("Failed to load pending leave requests");
      },
    });
  }

  openApproveModal(requestCode: string) {
    this.currentApproveRequestCode = requestCode;
    this.approveModal.open();
  }

  handleApproveConfirm(message: string) {
    const requestCode = this.currentApproveRequestCode;
    if (!requestCode || this.loadingRequests.has(requestCode)) return;

    this.loadingRequests.add(requestCode);
    this.leaveService
      .approveLeave({ requestCode, requestMessage: message })
      .subscribe({
        next: (response) => {
          this.loadingRequests.delete(requestCode);
          // Remove from pending list
          this.pendingLeaves = this.pendingLeaves.filter(
            (l) => l.requestCode !== requestCode
          );
          this.showToast("Leave Approved", "success");
          console.log("✅ Leave approved:", response);
          this.currentApproveRequestCode = "";
        },
        error: (err) => {
          this.loadingRequests.delete(requestCode);
          console.error("❌ Error approving leave:", err);
          const errorMsg =
            err.error?.message ||
            "Unable to update leave request. Please try again.";
          this.showToast("❌ " + errorMsg, "error");
          this.currentApproveRequestCode = "";
        },
      });
  }

  openRejectModal(requestCode: string) {
    this.currentRejectRequestCode = requestCode;
    this.rejectModal.open();
  }

  handleRejectConfirm(message: string) {
    const requestCode = this.currentRejectRequestCode;
    if (!requestCode || this.loadingRequests.has(requestCode)) return;

    this.loadingRequests.add(requestCode);
    this.leaveService
      .rejectLeave({ requestCode, requestMessage: message })
      .subscribe({
        next: (response) => {
          this.loadingRequests.delete(requestCode);
          // Remove from pending list
          this.pendingLeaves = this.pendingLeaves.filter(
            (l) => l.requestCode !== requestCode
          );
          this.showToast("Leave Rejected", "success");
          this.currentRejectRequestCode = "";
        },
        error: (err) => {
          this.loadingRequests.delete(requestCode);
          const errorMsg =
            err.error?.message ||
            "Unable to update leave request. Please try again.";
          this.showToast("❌ " + errorMsg, "error");
          this.currentRejectRequestCode = "";
        },
      });
  }

  isRequestLoading(requestCode: string): boolean {
    return this.loadingRequests.has(requestCode);
  }

  showToast(message: string, type: "success" | "error" | "info" = "info") {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 4000);
  }
}
