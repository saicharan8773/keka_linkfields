import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { SidebarComponent } from '../shared/components/sidebar.component';
import { LeaveService } from '../shared/services/leave.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HttpClientModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnInit {
  sidebarOpen = true;
  selectedPeriod: string = 'month';
  employeesOnLeave: any[] = [];
  selectedLeaveDate: string = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

  stats = {
    totalEmployees: 521,
    totalDepartments: 12,
    newJoinees: 23,
    avgSalary: 75000,
    employeeTrend: 8.5,
    attritionRate: 3.2
  };

  departmentData = [
    { name: 'Engineering', value: 160, color: '#3b82f6' },
    { name: 'Sales', value: 110, color: '#10b981' },
    { name: 'Marketing', value: 75, color: '#f59e0b' },
    { name: 'HR', value: 38, color: '#8b5cf6' },
    { name: 'Finance', value: 50, color: '#ec4899' },
    { name: 'Operations', value: 88, color: '#06b6d4' }
  ];

  growthData = [
    { month: 'Jan', employees: 420, newHires: 15, exits: 8 },
    { month: 'Feb', employees: 432, newHires: 18, exits: 6 },
    { month: 'Mar', employees: 445, newHires: 20, exits: 7 },
    { month: 'Apr', employees: 458, newHires: 19, exits: 6 },
    { month: 'May', employees: 471, newHires: 22, exits: 9 },
    { month: 'Jun', employees: 487, newHires: 23, exits: 7 },
    { month: 'Jul', employees: 495, newHires: 18, exits: 10 },
    { month: 'Aug', employees: 505, newHires: 21, exits: 11 },
    { month: 'Sep', employees: 510, newHires: 15, exits: 10 },
    { month: 'Oct', employees: 515, newHires: 12, exits: 7 },
    { month: 'Nov', employees: 520, newHires: 10, exits: 5 },
    { month: 'Dec', employees: 521, newHires: 8, exits: 7 },
  ];

  newJoinees = [
    { name: 'Sarah Chen', role: 'Senior Developer', dept: 'Engineering', date: '2024-12-15', avatar: '👩‍💻' },
    { name: 'Michael Torres', role: 'Sales Manager', dept: 'Sales', date: '2024-12-14', avatar: '👨‍💼' },
    { name: 'Priya Sharma', role: 'Marketing Lead', dept: 'Marketing', date: '2024-12-12', avatar: '👩‍💼' },
    { name: 'James Liu', role: 'Data Analyst', dept: 'Operations', date: '2024-12-10', avatar: '👨‍💻' }
  ];

  birthdays = [
    { name: 'Alex Johnson', dept: 'Engineering', date: 'Dec 18', avatar: '🎂' },
    { name: 'Emma Davis', dept: 'HR', date: 'Dec 19', avatar: '🎂' },
    { name: 'Ryan Park', dept: 'Sales', date: 'Dec 20', avatar: '🎂' }
  ];

  anniversaries = [
    { name: 'David Miller', years: 5, dept: 'Engineering', date: 'Dec 17', avatar: '🏆' },
    { name: 'Lisa Anderson', years: 3, dept: 'Marketing', date: 'Dec 18', avatar: '🏆' },
    { name: 'Tom Wilson', years: 7, dept: 'Finance', date: 'Dec 22', avatar: '🏆' }
  ];

  private professionalColors = [
    '#2c3e50', '#34495e', '#7f8c8d', '#95a5a6',
    '#2980b9', '#3498db', '#8e44ad', '#9b59b6',
    '#f39c12', '#f1c40f', '#d35400', '#e67e22',
    '#c0392b', '#e74c3c', '#16a085', '#1abc9c'
  ];

  constructor(private leaveService: LeaveService) {}

  ngOnInit() {
    this.fetchEmployeesOnLeave(this.selectedLeaveDate);
  }

  ngAfterViewInit() {
    this.createEmployeeGrowthChart();
    this.createDepartmentDistributionChart();
    this.createHiringVsExitsChart();
  }

  fetchEmployeesOnLeave(date: string) {
    this.leaveService.getEmployeesOnLeave(date).subscribe(employees => {
      this.employeesOnLeave = employees;
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getAvatarBackgroundColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % this.professionalColors.length);
    return this.professionalColors[index];
  }

  onSidebarToggle(isOpen: boolean) {
    this.sidebarOpen = isOpen;
  }

  setSelectedPeriod(period: string) {
    this.selectedPeriod = period;
    // Here you would typically refetch data based on the selected period
  }

  onEventClick(person: any, eventType: string): void {
    console.log(`${eventType} clicked:`, person);
  }

  createEmployeeGrowthChart() {
    const canvas = <HTMLCanvasElement>document.getElementById('employeeGrowthChart');
    if(canvas){
      const ctx = canvas.getContext('2d');
      if(ctx){
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.growthData.map(d => d.month),
            datasets: [{
              label: 'Employees',
              data: this.growthData.map(d => d.employees),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    }
  }

  createDepartmentDistributionChart() {
    const canvas = <HTMLCanvasElement>document.getElementById('departmentDistributionChart');
    if(canvas){
       const ctx = canvas.getContext('2d');
       if(ctx){
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: this.departmentData.map(d => d.name),
            datasets: [{
              data: this.departmentData.map(d => d.value),
              backgroundColor: this.departmentData.map(d => d.color)
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
              }
            }
          }
        });
       }
    }
  }

  createHiringVsExitsChart() {
    const canvas = <HTMLCanvasElement>document.getElementById('hiringVsExitsChart');
    if(canvas){
       const ctx = canvas.getContext('2d');
       if(ctx){
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: this.growthData.map(d => d.month),
              datasets: [
                {
                  label: 'New Hires',
                  data: this.growthData.map(d => d.newHires),
                  backgroundColor: '#10b981',
                  borderRadius: 8,
                },
                {
                  label: 'Exits',
                  data: this.growthData.map(d => d.exits),
                  backgroundColor: '#ef4444',
                  borderRadius: 8,
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { grid: { display: false } },
                y: { grid: { display: true } }
              }
            }
          });
        }
    }
  }
}
