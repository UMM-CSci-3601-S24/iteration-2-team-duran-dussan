import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { NgxOtpInputConfig } from 'ngx-otp-input';


@Component({
  selector: 'app-join-hunt',
  standalone: true,
  imports: [
    NgxOtpInputModule,
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

  isAccessCodeValid = false;

  accessCode = '';
  otpInputConfig:NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true,
    classList: {
      inputBox: 'my-super-box-class',
      input: 'my-super-class',
      inputFilled: 'my-super-filled-class',
      inputDisabled: 'my-super-disabled-class',
      inputSuccess: 'my-super-success-class',
      inputError: 'my-super-error-class'
    }
  };

  handleOtpChange(value:string[]) : void {
    this.accessCode = value.join('');
    this.isAccessCodeValid = this.accessCode.length === 6;
  }

  // handleFillEvent(value:string) : void {
  //   console.log(value);
  // }

  // numericOnly(event): boolean {
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   if ((charCode < 48 || charCode > 57)) {
  //     event.preventDefault();
  //     return false;
  //   }
  //   return true;
  // }

}
