import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../shared/services/auth.service";
import { SignupRequest } from "../../shared/models/auth.model";
// Particles
import { NgxParticlesModule } from "@tsparticles/angular";
import { NgParticlesService } from "@tsparticles/angular";
import { MoveDirection, OutMode } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxParticlesModule],
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent {
  fullName: string = "";
  email: string = "";
  password: string = "";
  role: string = "";
  errorMessage: string = "";
  successMessage: string = "";
  isLoading: boolean = false;
  id = "tsparticles-signup";
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
    // console.log(container);
  }

  onSignup(): void {
    if (!this.fullName || !this.email || !this.password || !this.role) {
      this.errorMessage = "Please fill in all fields";
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = "Password must be at least 6 characters long";
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";
    this.successMessage = "";

    const signupData: SignupRequest = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      role: this.role,
    };
    this.authService.signup(signupData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message; // <-- Works now

        setTimeout(() => {
          this.router.navigate(["/login"]);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.message || "Signup failed. Please try again.";
      },
    });
  }
}
