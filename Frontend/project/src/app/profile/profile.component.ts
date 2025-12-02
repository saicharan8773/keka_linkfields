import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidebarComponent } from "../shared/components/sidebar.component";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  user = {
    name: "",
    email: "",
    phone: "",
    avatar: "",
  };

  constructor() {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {}

  updateProfile(): void {}

  onFileSelect(event: any): void {
    // Handle avatar upload
  }
}
