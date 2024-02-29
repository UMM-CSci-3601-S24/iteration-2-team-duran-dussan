import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";


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
  }

};


