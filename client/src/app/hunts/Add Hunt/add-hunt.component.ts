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
      Validators.maxLength(50)
    ])),

    est: new FormControl<number>(null, Validators.compose([
      Validators.required,
      Validators.min(0),
      Validators.max(20),
      Validators.pattern('^[0-9]+$')
    ])),
  })};


