import { Component } from "@angular/core";
import { NgxSpinnerService, NgxSpinnerComponent } from "ngx-spinner";

@Component({
  selector: "app-spinner",
  standalone: true,
  imports: [NgxSpinnerComponent],
  template: `<ngx-spinner
    bdColor="rgba(0,0,0,0.8)"
    size="medium"
    color="#fff"
    type="pacman"
    [fullScreen]="true"
    zIndex="999"
  ><p style="font-size: 20px; color: white">Loading...</p></ngx-spinner>`,
})
export class SpinnerComponent {
  constructor(private spinner: NgxSpinnerService) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 2500);
  }
}
