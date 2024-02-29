import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { HuntService } from "../hunt.service";


@Component ({
  selector: 'app-add-hunt',
  templateUrl: './add-hunt.component.html',
  styleUrls: ['./add-hunt.component.scss'],
  standalone: true,
  imports: []
})
export class AddHuntComponent {

  addHuntForm = new FormGroup({
    name: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50)
    ])),

    description: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(200)
    ])),

    est: new FormControl<number>(null, Validators.compose([
      Validators.required,
      Validators.min(0),
      Validators.max(240),
      Validators.pattern('^[0-9]+$')
    ])),
  });

  readonly addHuntValidationMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'minlength', message: 'Name must be at least 1 character long' },
      { type: 'maxlength', message: 'Name cannot be more than 50 characters long' }
    ],

    description: [
      { type: 'required', message: 'Description is required' },
      { type: 'minlength', message: 'Description must be at least 1 character long' },
      { type: 'maxlength', message: 'Description cannot be more than 200 characters long' }
    ],

    est: [
      { type: 'required', message: 'Estimated time is required' },
      { type: 'min', message: 'Estimated time must be at least 0' },
      { type: 'max', message: 'Estimated time cannot be more than 4 hours' },
      { type: 'pattern', message: 'Estimated time must be a number' }
    ]
  };

  constructor(
    private huntService: HuntService,
    private snackBar: MatSnackBar,
    private router: Router) {
    }

  formControlHasError(controlName: string): boolean {
    return this.addHuntForm.get(controlName).invalid &&
      (this.addHuntForm.get(controlName).dirty || this.addHuntForm.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.addHuntValidationMessages): string {
    for(const {type, message} of this.addHuntValidationMessages[name]) {
      if (this.addHuntForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  submitForm() {
    this.huntService.addHunt(this.addHuntForm.value).subscribe({
      next: (newId) => {
        this.snackBar.open(
          `Added hunt ${this.addHuntForm.value.name}`,
          null,
          { duration: 2000 }
        );
        this.router.navigate(['/hunts/', newId]);
      },
      error: err => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          { duration: 5000 }
        );
      },
    });
  }

}


