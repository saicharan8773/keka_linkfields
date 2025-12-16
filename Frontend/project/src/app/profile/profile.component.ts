import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../shared/components/sidebar.component';
import { EmployeeService } from '../shared/services/employee.service';
import { AuthService } from '../shared/services/auth.service';
import { Employee } from '../shared/models/employee.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: Employee | any;
  
  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const userId = this.authService.getEmployeeId();
    this.employeeService.getEmployeeById(userId).subscribe((employee) => {
      this.user = employee;
    });
  }
}
