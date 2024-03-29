import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { HostService } from 'src/app/hosts/host.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-join-hunt',
  standalone: true,
  imports: [
    MatInputModule,
    MatCardModule,
    CommonModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './join-hunt.component.html',
  styleUrl: './join-hunt.component.scss'
})
export class JoinHuntComponent {

  isAccessCodeValid = false;

  accessCode: string;
  errorMessage: string;

  constructor(private hostService: HostService, private router: Router, private snackBar: MatSnackBar) { }

  @ViewChild('input1') input1: ElementRef;
  @ViewChild('input2') input2: ElementRef;
  @ViewChild('input3') input3: ElementRef;
  @ViewChild('input4') input4: ElementRef;
  @ViewChild('input5') input5: ElementRef;
  @ViewChild('input6') input6: ElementRef;

  onKeyUp(event, inputNumber) {
    if (event.target.value.length) {
      switch (inputNumber) {
        case 1: this.input2.nativeElement.focus(); break;
        case 2: this.input3.nativeElement.focus(); break;
        case 3: this.input4.nativeElement.focus(); break;
        case 4: this.input5.nativeElement.focus(); break;
        case 5: this.input6.nativeElement.focus(); break;
      }
      this.checkAccessCode();
    }
  }

  onKeyDown(event, inputNumber) {
    if (event.key === 'Backspace' && !event.target.value.length) {
      switch (inputNumber) {
        case 2: this.input1.nativeElement.focus(); break;
        case 3: this.input2.nativeElement.focus(); break;
        case 4: this.input3.nativeElement.focus(); break;
        case 5: this.input4.nativeElement.focus(); break;
        case 6: this.input5.nativeElement.focus(); break;
      }
    }
  }

  checkAccessCode() {
    this.accessCode = [this.input1.nativeElement.value, this.input2.nativeElement.value, this.input3.nativeElement.value, this.input4.nativeElement.value, this.input5.nativeElement.value, this.input6.nativeElement.value].join('');
    if (this.accessCode.length === 6) {
      this.hostService.getStartedHunt(this.accessCode).subscribe({
        next: () => {
          this.isAccessCodeValid = true;
        },
        error: () => {
          this.isAccessCodeValid = false;
          this.snackBar.open('Invalid access code. No hunt was found.', 'Close', {
            duration: 6000,
          });
        }
      });
    }
  }
}
