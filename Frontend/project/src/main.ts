import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { Router, NavigationEnd, RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { filter } from "rxjs/operators";
import { appConfig } from "./app/app.config";
import { NavbarComponent } from "./app/shared/components/navbar/navbar";
import { SpinnerComponent } from "./app/shared/components/spinner.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SpinnerComponent],
  template: `
    <app-spinner></app-spinner>
    <app-navbar *ngIf="!isAuthPage"></app-navbar>
    <router-outlet></router-outlet>
  `,
})
export class App {
  isAuthPage = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        this.isAuthPage = url === "/login" || url === "/signup";
      });
  }
}

bootstrapApplication(App, appConfig);
