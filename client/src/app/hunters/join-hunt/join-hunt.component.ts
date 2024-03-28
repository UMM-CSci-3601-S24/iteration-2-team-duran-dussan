import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { NgxOtpInputConfig } from 'ngx-otp-input';
import { HostService } from 'src/app/hosts/host.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  accessCode: string;
errorMessage: string;
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

  constructor(private hostService: HostService, private router: Router, private snackBar: MatSnackBar) { }
  handleOtpChange(value:string[]) : void {
    this.accessCode = value.join('');
    if (this.accessCode.length === 6) {
      this.hostService.getStartedHunt(this.accessCode).subscribe({
        next: startedHunt => {
          // The access code is valid, enable the "Join Hunt" button
          this.isAccessCodeValid = true;
          this.router.navigate(['hunt', startedHunt.accessCode]);
        },
        error: err => {
          this.isAccessCodeValid = false;
          this.snackBar.open('Invalid access code. No hunt was found.', 'Close', {
            duration: 6000,
          });
        }
      });
    }
  }
}
