import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { appConfig } from './app/app.config';
import { NavbarComponent } from './app/shared/components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar *ngIf="!isAuthPage"></app-navbar>
    <router-outlet></router-outlet>
  `
})
export class App {
  isAuthPage = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAuthPage = event.urlAfterRedirects === '/login' || event.urlAfterRedirects === '/signup';
    });
  }
}

bootstrapApplication(App, appConfig);