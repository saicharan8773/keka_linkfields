import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from "@angular/forms";
import { LeaveService } from "../shared/services/leave.service";
import {
  LeaveRequest,
  LeaveStatus,
  LeaveType,
} from "../shared/models/leave.model";
import { AuthService } from "../shared/services/auth.service";
import { SidebarComponent } from "../shared/components/sidebar.component";
import { Subscription } from "rxjs";

interface LeaveTypeOption {
  id: number;
  name: string;
  code: string;
  defaultDays: number;
  isUnlimited: boolean;
}

@Component({
  selector: "app-leave",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: "./leave.component.html",
  styleUrls: ["./leave.component.css"],
})
export class LeaveComponent implements OnInit, OnDestroy {
  leaveTypes: LeaveType[] = [];
  isLoadingLeaveTypes = false;

  leaveForm!: FormGroup;

  myRequests: LeaveRequest[] = [];
  teamRequests: LeaveRequest[] = [];
  notifications: string[] = [];
  successMessage = "";
  errorMessage = "";
  isSubmitting = false;
  isLoadingMy = false;
  isLoadingTeam = false;
  totalLeaveDays: number | null = null;
  remainingDays: number | null = null;
  defaultAllowed: number | null = null;
  selectedLeaveType: LeaveTypeOption | null = null;
  // Stats for leave page
  weeklyPattern: number[] = [];
  weeklyApproved: number[] = [];
  weeklyLabels: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  consumedByType: { name: string; value: number }[] = [];
  monthlyStats: number[] = [];
  monthlyApproved: number[] = [];
  monthlyLabels: string[] = [
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
  ];
  leaveBalancesSummary: any[] = [];
  private valueChangesSub?: Subscription;
  // Palette reused for stats donut
  private readonly statsColors: string[] = [
    "#8e7cc3",
    "#f6a623",
    "#50e3c2",
    "#4a90e2",
    "#d0021b",
    "#7ed321",
  ];

  private employeeId: any = null;
  role: any = null;
  canManageTeam = false;
  readonly leaveTypeOptions: LeaveTypeOption[] = [
    {
      id: 1,
      name: "Casual Leave",
      code: "CL",
      defaultDays: 8,
      isUnlimited: false,
    },
    {
      id: 2,
      name: "Compensatory Off",
      code: "Comp Off",
      defaultDays: 15,
      isUnlimited: false,
    },
    {
      id: 3,
      name: "Earned Leave",
      code: "EL",
      defaultDays: 15,
      isUnlimited: false,
    },
    {
      id: 4,
      name: "Floater Leave",
      code: "Floater",
      defaultDays: 3,
      isUnlimited: false,
    },
    {
      id: 5,
      name: "LOP",
      code: "LOP",
      defaultDays: 0,
      isUnlimited: true,
    },
    {
      id: 6,
      name: "Maternity Leave",
      code: "Maternity",
      defaultDays: 182,
      isUnlimited: false,
    },
    {
      id: 7,
      name: "Sick Leave",
      code: "SL",
      defaultDays: 10,
      isUnlimited: false,
    },
    {
      id: 8,
      name: "Paternity Leave",
      code: "Paternity",
      defaultDays: 14,
      isUnlimited: false,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // initialize auth-related fields
    this.employeeId = this.authService.getUserId();
    this.role = this.authService.getUserRole();
    this.canManageTeam = this.authService.hasRole(["Manager", "Admin"]);

    if (!this.employeeId) {
      this.errorMessage = "Unable to read employee information from token.";
      return;
    }

    // initialize reactive form
    this.leaveForm = this.fb.group({
      leaveTypeId: [null as number | null, Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      reason: ["", [Validators.required, Validators.minLength(5)]],
    });

    this.valueChangesSub = this.leaveForm.valueChanges.subscribe(() => {
      this.updateDerivedMetrics();
    });

    this.loadLeaveTypes();
    this.loadMyRequests();
    this.loadLeaveBalancesSummary();
  }

  ngOnDestroy(): void {
    this.valueChangesSub?.unsubscribe();
  }

  submitRequest(): void {
    if (!this.employeeId || this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    const formValue = this.leaveForm.value;
    const payload = {
      employeeId: this.employeeId,
      leaveTypeId: Number(formValue.leaveTypeId),
      startDate: new Date(formValue.startDate!).toISOString(),
      endDate: new Date(formValue.endDate!).toISOString(),
      reason: formValue.reason!.trim(),
    };

    this.isSubmitting = true;
    this.successMessage = "";
    this.errorMessage = "";

    this.leaveService.applyLeave(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = "Leave request submitted successfully.";
        this.resetForm();
        this.loadMyRequests();
      },
      error: (error) => {
        this.isSubmitting = false;
        const serverMessage =
          error?.error?.message ||
          error?.error?.title ||
          (typeof error?.error === "string" ? error.error : null);
        this.errorMessage =
          serverMessage ||
          "Failed to submit leave request. Please review the form and retry.";
      },
    });
  }

  resetForm(): void {
    this.leaveForm.reset();
    this.leaveForm.markAsPristine();
    this.leaveForm.markAsUntouched();
    this.leaveForm.setErrors(null);
    this.totalLeaveDays = null;
    this.remainingDays = null;
    this.defaultAllowed = null;
    this.selectedLeaveType = null;
  }

  approve(request: LeaveRequest): void {
    this.updateRequestStatus(request, "Approved");
  }

  reject(request: LeaveRequest): void {
    this.updateRequestStatus(request, "Rejected");
  }

  private loadMyRequests(): void {
    if (!this.employeeId) return;
    this.isLoadingMy = true;
    // Use history endpoint with empiid (employee id) as requested
    this.leaveService.getLeaveHistory(this.employeeId).subscribe({
      next: (requests) => {
        console.log("My leave history loaded:", requests);
        this.myRequests = requests || [];
        this.notifications = this.buildNotifications(this.myRequests);
        this.recalculateLeaveStatsFromHistory();
        this.isLoadingMy = false;
      },
      error: () => {
        this.errorMessage = "Unable to load your leave history at the moment.";
        this.isLoadingMy = false;
      },
    });
  }

  private updateRequestStatus(
    request: LeaveRequest,
    status: Exclude<LeaveStatus, "Pending">
  ): void {
    this.leaveService.updateLeaveStatus(request.id, { status }).subscribe({
      next: () => {
        this.successMessage = `Leave request ${status.toLowerCase()} successfully.`;
        if (request.employeeId === this.employeeId) {
          this.loadMyRequests();
        }
      },
      error: () => {
        this.errorMessage = `Unable to ${status.toLowerCase()} this request.`;
      },
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  private loadLeaveTypes(): void {
    // Prefer calling the policy GUID endpoint to retrieve leave types
    // Fallback to employee-scoped endpoint when GUID is not set or request fails.
    const POLICY_GUID = "A9BB5F91-26B2-4F69-BF53-C039B9EC8838";
    this.isLoadingLeaveTypes = true;
    this.leaveService.getLeaveTypesByGuid(POLICY_GUID).subscribe({
      next: (types) => {
        // The API returns an array matching the LeaveType interface
        this.leaveTypes = types || [];
        // Recalculate consumed leave types donut purely from this data
        this.recalculateConsumedFromLeaveTypes();
        this.isLoadingLeaveTypes = false;
      },
      error: () => {
        // fallback to existing behavior: try employee-specific types
        if (this.employeeId) {
          this.leaveService.getLeaveTypes().subscribe({
            next: (types) => {
              this.leaveTypes = types || [];
              this.isLoadingLeaveTypes = false;
            },
            error: () => {
              this.errorMessage = "Unable to load leave types at the moment.";
              this.isLoadingLeaveTypes = false;
            },
          });
        } else {
          this.errorMessage = "Unable to load leave types at the moment.";
          this.isLoadingLeaveTypes = false;
        }
      },
    });
  }

  /**
   * Recalculate weekly/monthly patterns and consumed leave types
   * based purely on the employee's leave history (myRequests).
   *
   * - Weekly pattern: number of approved leave days taken on each weekday
   * - Monthly pattern: number of approved leave days taken in each month
   * - Consumed leave types: total approved leave days per leave type
   *
   * Days are counted per calendar day between start and end date (inclusive).
   */
  private recalculateLeaveStatsFromHistory(): void {
    // Always initialise with all days/months so charts show 0 bars when empty
    const weeklyApproved = new Array(7).fill(0); // Mon..Sun
    const monthlyApproved = new Array(12).fill(0); // Jan..Dec
    const typeTotals = new Map<string, number>();

    if (!this.myRequests || this.myRequests.length === 0) {
      this.weeklyApproved = weeklyApproved;
      this.monthlyApproved = monthlyApproved;
      this.consumedByType = [];
      return;
    }

    const approvedRequests = this.myRequests.filter(
      (req) => this.getStatusLabel(req.status) === "Approved"
    );

    for (const req of approvedRequests) {
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
        continue;
      }

      // Walk each calendar day in the approved leave range
      for (
        let d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        d <= end;
        d.setDate(d.getDate() + 1)
      ) {
        // Convert JS getDay() (Sun=0..Sat=6) to Mon=0..Sun=6
        const dow = (d.getDay() + 6) % 7;
        weeklyApproved[dow] = (weeklyApproved[dow] || 0) + 1;

        const monthIdx = d.getMonth(); // 0..11
        monthlyApproved[monthIdx] = (monthlyApproved[monthIdx] || 0) + 1;

        const typeName = req.leaveTypeName || `Type ${req.leaveTypeId}`;
        typeTotals.set(typeName, (typeTotals.get(typeName) || 0) + 1);
      }
    }

    this.weeklyApproved = weeklyApproved;
    this.monthlyApproved = monthlyApproved;
    this.consumedByType = Array.from(typeTotals.entries()).map(
      ([name, value]) => ({ name, value })
    );
  }

  /**
   * Recalculate consumed leave types (for the pie/donut chart)
   * using ONLY the data coming from the policy GUID types API:
   *   GET /api/Leave/types/A9BB5F91-26B2-4F69-BF53-C039B9EC8838
   *
   * For each leave type we derive "consumed days" using getConsumedDays,
   * then aggregate by leave type name for the donut.
   */
  private recalculateConsumedFromLeaveTypes(): void {
    if (!this.leaveTypes || this.leaveTypes.length === 0) {
      this.consumedByType = [];
      return;
    }

    const totals = this.leaveTypes.map((lt: any) => {
      const consumed = this.getConsumedDays(lt);
      return {
        name: lt.leaveTypeName || `Type ${lt.leaveTypeId}`,
        value: typeof consumed === "number" ? consumed : 0,
      };
    });

    this.consumedByType = totals.filter((t) => t.value >= 0);
  }

  private loadLeaveBalancesSummary(): void {
    this.leaveService.getLeaveBalances().subscribe({
      next: (balances) => {
        // Transform balances map/object into an array for display cards
        if (!balances) {
          this.leaveBalancesSummary = [];
          return;
        }
        // If API returns array already
        if (Array.isArray(balances)) {
          this.leaveBalancesSummary = balances;
          return;
        }
        // Convert object to array
        this.leaveBalancesSummary = Object.keys(balances).map((k) => ({
          type: k,
          available: balances[k]?.available ?? balances[k],
          consumed: balances[k]?.consumed ?? 0,
        }));
      },
      error: () => {
        console.log("Unable to load leave balances summary");
        this.leaveBalancesSummary = [];
      },
    });
  }

  private updateDerivedMetrics(): void {
    const { leaveTypeId, startDate, endDate } = this.leaveForm.value;
    this.selectedLeaveType =
      this.leaveTypeOptions.find(
        (option) => option.id === Number(leaveTypeId)
      ) || null;

    if (this.selectedLeaveType?.isUnlimited) {
      this.defaultAllowed = null;
    } else {
      this.defaultAllowed = this.selectedLeaveType?.defaultDays ?? null;
    }

    const totalDays = this.calculateTotalDays(startDate, endDate);
    this.totalLeaveDays = totalDays;

    if (
      typeof totalDays === "number" &&
      this.selectedLeaveType &&
      !this.selectedLeaveType.isUnlimited
    ) {
      this.remainingDays = this.selectedLeaveType.defaultDays - totalDays;
    } else {
      this.remainingDays = null;
    }

    this.updateFormErrors(totalDays);
  }

  private calculateTotalDays(
    startDate?: string | null,
    endDate?: string | null
  ): number | null {
    if (!startDate || !endDate) {
      return null;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return null;
    }
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const diff = end.getTime() - start.getTime();
    return diff < 0 ? null : Math.floor(diff / millisecondsPerDay) + 1;
  }

  private updateFormErrors(totalDays: number | null): void {
    const errors: Record<string, boolean> = {};
    const { startDate, endDate } = this.leaveForm.value;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        errors["invalidDateRange"] = true;
      }
      if (
        this.selectedLeaveType &&
        !this.selectedLeaveType.isUnlimited &&
        typeof totalDays === "number" &&
        totalDays > this.selectedLeaveType.defaultDays
      ) {
        errors["exceedsBalance"] = true;
      }
    }

    this.leaveForm.setErrors(Object.keys(errors).length > 0 ? errors : null);
  }

  private buildNotifications(requests: LeaveRequest[]): string[] {
    return requests
      .filter((req) => !this.isPendingStatus(req.status))
      .map((req) => {
        const label = this.getStatusLabel(req.status).toLowerCase();
        return `Your ${req.leaveTypeName} from ${this.formatDate(
          req.startDate
        )} to ${this.formatDate(req.endDate)} was ${label}.`;
      });
  }

  // Status helpers to support both string (Pending/Approved/Rejected)
  // and numeric (0/1/2) values from the API.
  getStatusLabel(status: any): string {
    if (status === 1 || status === "1" || status === "Approved") {
      return "Approved";
    }
    if (status === 2 || status === "2" || status === "Rejected") {
      return "Rejected";
    }
    return "Pending";
  }

  getStatusClass(status: any): string {
    return this.getStatusLabel(status).toLowerCase();
  }

  private isPendingStatus(status: any): boolean {
    return status === 0 || status === "0" || status === "Pending";
  }

  // Helpers for Leave Types donuts and values
  getDefaultDaysForType(id: number): number | null {
    const opt = this.leaveTypeOptions.find((o) => o.id === Number(id));
    return opt ? opt.defaultDays : null;
  }

  getAvailableDays(leaveType: any): number | string {
    console.log("Available days:", leaveType.remainingDays);
    if (leaveType.isUnlimited) return "∞";
    if (typeof leaveType.remainingDays === "number") {
      console.log("Remaining days:", leaveType.remainingDays);
      return leaveType.remainingDays;
    }
    if (typeof leaveType.available === "number") return leaveType.available;
    return 0;
  }

  getConsumedDays(leaveType: any): number {
    if (typeof leaveType.consumed === "number") return leaveType.consumed;
    const defaultDays = this.getDefaultDaysForType(
      leaveType.leaveTypeId || leaveType.id || 0
    );
    const remaining =
      typeof leaveType.remainingDays === "number"
        ? leaveType.remainingDays
        : typeof leaveType.available === "number"
          ? leaveType.available
          : null;
    if (defaultDays !== null && typeof remaining === "number") {
      return Math.max(0, defaultDays - remaining);
    }
    return 0;
  }

  getAnnualQuota(leaveType: any): number | string {
    if (leaveType.isUnlimited) return "∞";
    if (typeof leaveType.annualQuota === "number") return leaveType.annualQuota;
    const defaultDays = this.getDefaultDaysForType(
      leaveType.leaveTypeId || leaveType.id || 0
    );
    return defaultDays ?? "-";
  }

  getDonutPercent(leaveType: any): number {
    if (leaveType.isUnlimited) return 100;
    const quota = Number(this.getAnnualQuota(leaveType));
    const available = this.getAvailableDays(leaveType);
    if (!quota || quota <= 0 || available === "∞") return 0;
    const availNum = Number(available || 0);
    const percent = Math.round((availNum / quota) * 100);
    return Math.min(100, Math.max(0, percent));
  }

  getDonutStyle(leaveType: any, index: number): any {
    const percent = this.getDonutPercent(leaveType);
    const colors = [
      "#E7D9FF",
      "#DFF3E0",
      "#FFF2D9",
      "#F4ECEA",
      "#E6F7F9",
      "#F7EAF6",
    ];
    const fill = colors[index % colors.length] || "#E7D9FF";
    const empty = "#f1f1f1";
    return {
      background: `conic-gradient(${fill} ${percent}%, ${empty} ${percent}%)`,
    };
  }

  // ===== Consumed leave types donut (stats header card) =====

  getConsumedDonutStyle(): any {
    if (!this.consumedByType || this.consumedByType.length === 0) {
      return { background: "#f7f3ff" };
    }

    const total = this.consumedByType.reduce(
      (sum, t) => sum + (typeof t.value === "number" ? t.value : 0),
      0
    );

    if (!total || total <= 0) {
      return { background: "#f7f3ff" };
    }

    let current = 0;
    const segments: string[] = [];

    this.consumedByType.forEach((t, index) => {
      const v = typeof t.value === "number" ? t.value : 0;
      if (v <= 0) {
        return;
      }
      const start = (current / total) * 100;
      current += v;
      const end = (current / total) * 100;
      const color = this.statsColors[index % this.statsColors.length];
      segments.push(`${color} ${start}% ${end}%`);
    });

    if (segments.length === 0) {
      return { background: "#f7f3ff" };
    }

    return {
      background: `conic-gradient(${segments.join(", ")})`,
    };
  }

  getConsumedTypeColor(index: number): string {
    return this.statsColors[index % this.statsColors.length];
  }
}
