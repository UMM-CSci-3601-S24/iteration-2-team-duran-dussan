import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { AddHuntComponent } from "./add-hunt.component";
import { MockHostService } from "src/testing/host.service.mock";
import { HostService } from "src/app/hosts/host.service";


describe('AddHuntComponent', () => {
  let addHuntComponent: AddHuntComponent;
  let addHuntForm: FormGroup;
  let fixture: ComponentFixture<AddHuntComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(HostService, { useValue: new MockHostService() });
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        AddHuntComponent
      ]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHuntComponent);
    addHuntComponent = fixture.componentInstance;
    fixture.detectChanges();
    addHuntForm = addHuntComponent.addHuntForm;
    expect(addHuntForm).toBeDefined();
    expect(addHuntForm.controls).toBeDefined();
  });

  it('should create the component and form', () => {
    expect(addHuntComponent).toBeTruthy();
    expect(addHuntForm).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(addHuntForm.valid).toBeFalsy();
  });

  describe('The name field', () => {
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = addHuntComponent.addHuntForm.controls.name;
    });

    it('should not allow empty names', () => {
      nameControl.setValue('');
      expect(nameControl.valid).toBeFalsy();
    });

    it('should be fine with "The Best Hunt"', () => {
      nameControl.setValue('The Best Hunt');
      expect(nameControl.valid).toBeTruthy();
    });

    it('should fail on really long names', () => {
      nameControl.setValue('t'.repeat(100));
      expect(nameControl.valid).toBeFalsy();
      expect(nameControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the name', () => {
      nameControl.setValue('Bad2Th3B0ne');
      expect(nameControl.valid).toBeTruthy();
    });
  });
})
