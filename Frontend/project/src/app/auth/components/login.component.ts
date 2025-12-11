import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../shared/services/auth.service";

// Particles
import { NgxParticlesModule } from "@tsparticles/angular";
import { NgParticlesService } from "@tsparticles/angular";
import { MoveDirection, OutMode } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxParticlesModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  email = "";
  password = "";
  errorMessage = "";
  isLoading = false;
  id = "tsparticles-login";
  particlesOptions = {
    background: {
      color: {
        value: "#d27320ff",
      },
      },
      particles: {
        number: {
          value: 300,
          density: {
            enable: true,
            area: 867.2,
          },
        },
        color: {
          value: "#ffffff",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
          polygon: {
            nb_sides: 5,
          },
          image: {
            src: "img/github.svg",
            width: 100,
            height: 100,
          },
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        links: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 4,
          direction: "none",
          random: false,
          straight: false,
          outModes: {
            default: "out",
          },
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detectOn: "canvas",
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
          onClick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 255.23,
            links: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            quantity: 4,
          },
          remove: {
            quantity: 2,
          },
        },
      },
      detectRetina: true,
    };
    
  constructor( 
    private authService: AuthService,
    private router: Router,
    private readonly ngParticlesService: NgParticlesService
  ) {}

  ngOnInit(): void {
    this.ngParticlesService.init(async (engine) => {
      await loadSlim(engine);
    });
  }

  particlesLoaded(container: any): void {
    // You can add custom logic here if needed
    // console.log(container);
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = "Please fill in all fields";
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        if (this.authService.isAuthenticated())
          this.router.navigate(["/dashboard"]);
        else this.errorMessage = "Login failed. No token received.";
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.message || "Login failed. Please try again.";
      },
    });
  }
}
