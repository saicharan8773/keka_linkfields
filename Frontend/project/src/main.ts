import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { appConfig } from './app/app.config';
import { NavbarComponent } from './app/shared/components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: '<app-navbar></app-navbar><router-outlet></router-outlet>'
})
export class App { }

bootstrapApplication(App, appConfig);
