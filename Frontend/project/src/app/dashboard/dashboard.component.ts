import { Component, OnInit, OnDestroy } from "@angular/core";
import { formatDate } from "@angular/common";
import { CommonModule } from "@angular/common";
import { SidebarComponent } from "../shared/components/sidebar.component";
// import { WeeklyPatternChartComponent } from "../shared/components/weekly-pattern-chart.component";
import { LeaveService } from "../shared/services/leave.service";
import { EmployeeService } from "../shared/services/employee.service";
import { FormsModule } from "@angular/forms";

interface EmployeeOnLeave {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
}

interface Employee {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  dateOfBirth?: string;
  workAnniversaryDate?: string;
  joinDate?: string;
}

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  employeesOnLeave: any[] = [];
  selectedLeaveDate: string = formatDate(new Date(), "yyyy-MM-dd", "en");
  birthdaysToday: Employee[] = [];
  upcomingBirthdays: Employee[] = [];
  workAnniversariesToday: Employee[] = [];
  upcomingWorkAnniversaries: Employee[] = [];
  newJoiners: Employee[] = [];
  leaveBalances: any = null;
  currentTime: Date = new Date();
  private timeInterval: any;
  isLoading = true;
  errorMessage = "";
  sidebarOpen: boolean = true;

  constructor(
    private leaveService: LeaveService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  onSidebarToggle(isOpen: boolean): void {
    this.sidebarOpen = isOpen;
  }

  private loadDashboardData(): void {
    this.fetchEmployeesOnLeave(this.selectedLeaveDate);
    this.loadBirthdaysFromEmployees();
    this.loadLeaveBalances();
    this.loadServerTime();
    this.loadCelebrations();
  }

  fetchEmployeesOnLeave(date: string) {
    this.isLoading = true;
    this.leaveService.getEmployeesOnLeave(date).subscribe({
      next: (employees) => {
        this.employeesOnLeave = employees;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Failed to load employees on leave";
        this.isLoading = false;
      },
    });
  }

  private loadLeaveBalances(): void {
    this.leaveService.getLeaveBalances().subscribe({
      next: (balances) => {
        this.leaveBalances = balances || null;
      },
      error: () => {
        console.log("Unable to load leave balances");
        this.leaveBalances = null;
      },
    });
  }

  private loadServerTime(): void {
    this.leaveService.getServerTime().subscribe({
      next: (data: any) => {
        let base: Date | null = null;
        if (data && data.currentTime) {
          const parsed = new Date(data.currentTime);
          base = isNaN(parsed.getTime()) ? null : parsed;
        } else if (typeof data === "string") {
          const parsed = new Date(data);
          base = isNaN(parsed.getTime()) ? null : parsed;
        }

        if (!base) {
          base = new Date();
        }

        // set current time and start ticking every second
        this.currentTime = base;
        this.startClock();
      },
      error: () => {
        // fallback to client time when server time is not available
        this.currentTime = new Date();
        this.startClock();
      },
    });
  }

  private startClock(): void {
    // clear existing interval if any
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }

    this.timeInterval = setInterval(() => {
      this.currentTime = new Date(this.currentTime.getTime() + 1000);
    }, 1000);
  }

  private loadBirthdaysFromEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees: any[]) => {
        const today = new Date();
        this.birthdaysToday = [];
        this.upcomingBirthdays = [];

        employees.forEach((emp) => {
          if (!emp.dateOfBirth) return;

          const empBirthDate = new Date(emp.dateOfBirth);
          // Create a date for this year's birthday
          const thisYearBirthday = new Date(
            today.getFullYear(),
            empBirthDate.getMonth(),
            empBirthDate.getDate()
          );

          // Check if birthday is today
          if (this.isSameDay(today, thisYearBirthday)) {
            this.birthdaysToday.push({
              id: emp.id,
              name: emp.firstName + " " + emp.lastName,
              initials: this.getInitials(emp.firstName + " " + emp.lastName),
              avatarColor: this.getAvatarColor(this.birthdaysToday.length),
              dateOfBirth: emp.dateOfBirth,
            });
          }
        });

        // Filter upcoming birthdays for next 15 days
        this.upcomingBirthdays = this.filterNext15DaysBirthdays(employees);
      },
      error: () => {
        console.log("Unable to load employees for birthdays");
      },
    });
  }

  private filterNext15DaysBirthdays(employees: any[]): Employee[] {
    const today = new Date();
    const fifteenDaysLater = new Date(
      today.getTime() + 15 * 24 * 60 * 60 * 1000
    );
    const upcoming: Employee[] = [];

    employees.forEach((emp) => {
      if (!emp.dateOfBirth) return;

      const empBirthDate = new Date(emp.dateOfBirth);
      // Create a date for this year's birthday
      const thisYearBirthday = new Date(
        today.getFullYear(),
        empBirthDate.getMonth(),
        empBirthDate.getDate()
      );

      // Check if birthday is in the next 15 days (excluding today)
      if (thisYearBirthday > today && thisYearBirthday <= fifteenDaysLater) {
        upcoming.push({
          id: emp.id,
          name: emp.firstName + " " + emp.lastName,
          initials: this.getInitials(emp.firstName + " " + emp.lastName),
          avatarColor: this.getAvatarColor(upcoming.length),
          dateOfBirth: emp.dateOfBirth,
        });
      }
    });

    // Sort by date
    upcoming.sort((a, b) => {
      const dateA = new Date(a.dateOfBirth || "");
      const dateB = new Date(b.dateOfBirth || "");
      const monthDayA = dateA.getMonth() * 100 + dateA.getDate();
      const monthDayB = dateB.getMonth() * 100 + dateB.getDate();
      return monthDayA - monthDayB;
    });

    return upcoming;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  private loadCelebrations(): void {
    this.leaveService.getCelebrations().subscribe({
      next: (data: any) => {
        this.workAnniversariesToday = data.workAnniversariesToday || [];
        this.upcomingWorkAnniversaries = data.upcomingWorkAnniversaries || [];
        this.newJoiners = data.newJoiners || [];
      },
      error: () => {
        console.log("Unable to load celebrations data");
      },
    });
  }

  private filterNext15Days(
    employees: Employee[],
    dateField: "dateOfBirth" | "workAnniversaryDate"
  ): Employee[] {
    const today = new Date();
    const fifteenDaysLater = new Date(
      today.getTime() + 15 * 24 * 60 * 60 * 1000
    );

    return employees.filter((emp) => {
      const dateStr = emp[dateField];
      if (!dateStr) return false;

      const empDate = new Date(dateStr);
      // Only compare month and day, ignoring the year
      const empMonthDay = new Date(
        today.getFullYear(),
        empDate.getMonth(),
        empDate.getDate()
      );

      return empMonthDay >= today && empMonthDay <= fifteenDaysLater;
    });
  }

  getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  getAvatarColor(index: number): string {
    const colors = [
      "#64B5F6",
      "#81C784",
      "#FFB74D",
      "#E57373",
      "#BA68C8",
      "#4DD0E1",
    ];
    return colors[index % colors.length];
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
    });
  }
}
