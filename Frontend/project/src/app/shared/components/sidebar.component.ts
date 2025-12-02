import { Component, HostBinding, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  isOpen = true; // Sidebar starts open
  canManageOrg = false;

  @HostBinding("class.sidebar-open")
  get sidebarOpenClass(): boolean {
    return this.isOpen;
  }

  @HostBinding("class.sidebar-closed")
  get sidebarClosedClass(): boolean {
    return !this.isOpen;
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check if user has Admin or Manager role
    this.canManageOrg = this.authService.hasRole(["Admin", "Manager"]);
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
