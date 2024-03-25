import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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

  accessCodeControl = new FormControl('');
  isAccessCodeValid = false;

  constructor() {
    this.accessCodeControl.valueChanges.subscribe(value => {
      this.isAccessCodeValid = value.length === 6;
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
