import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface SearchablePage {
  name: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  userName: string = 'User';
  searchControl = new FormControl();
  searchResults: SearchablePage[] = [];

  private pages: SearchablePage[] = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Profile', path: '/profile' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Employees', path: '/employees' },
    { name: 'Departments', path: '/departments' },
    { name: 'Designations', path: '/designations' },
    { name: 'Teams', path: '/teams' },
    { name: 'Salary Structures', path: '/salary-structures' },
    { name: 'Leave', path: '/leave' },
  ];

  constructor(
    private employeeService: EmployeeService,
    private auth: AuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.employeeService.getEmployeeById(this.auth.getEmployeeId()).subscribe(employee => {
      if (employee && employee.displayName) {
        this.userName = employee.displayName;
      }
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query === '') {
        this.searchResults = [];
        return;
      }
      this.searchResults = this.pages.filter(page =>
        page.name.toLowerCase().includes(query.toLowerCase())
      );
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.searchControl.setValue('');
    this.searchResults = [];
  }
}
