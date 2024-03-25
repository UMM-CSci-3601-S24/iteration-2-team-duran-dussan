import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-join-hunt',
  standalone: true,
  imports: [
    MatInputModule,
    MatCardModule,
    CommonModule,
    MatButtonModule,
    RouterModule,
  ReactiveFormsModule],
  templateUrl: './join-hunt.component.html',
  styleUrl: './join-hunt.component.scss'
})
export class JoinHuntComponent {

  accessCodePart1Control = new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]);
  accessCodePart2Control = new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]);
  isAccessCodeValid = false;

  constructor() {
    this.accessCodePart1Control.valueChanges.subscribe(value => {
      this.isAccessCodeValid = this.accessCodePart1Control.valid && this.accessCodePart2Control.valid;
    });

    this.accessCodePart2Control.valueChanges.subscribe(value => {
      this.isAccessCodeValid = this.accessCodePart1Control.valid && this.accessCodePart2Control.valid;
    });
  }

  numericOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

}
