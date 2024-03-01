import { Location } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { MockHostService } from 'src/testing/host.service.mock';
import { AddHuntComponent } from './add-hunt.component';
import { HostService } from 'src/app/hosts/host.service';
import { HuntProfileComponent } from '../hunt-profile.component';


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

  describe('The description field', () => {
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = addHuntComponent.addHuntForm.controls.description;
    });

    it('should be fine with "This is the Best Hunt"', () => {
      nameControl.setValue('The Best Hunt');
      expect(nameControl.valid).toBeTruthy();
    });

    it('should fail on really long description', () => {
      nameControl.setValue('t'.repeat(201));
      expect(nameControl.valid).toBeFalsy();
      expect(nameControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the description', () => {
      nameControl.setValue('Bad2Th3B0ne');
      expect(nameControl.valid).toBeTruthy();
    });
  });

  describe('The EST field', () => {
    let ageControl: AbstractControl;

    beforeEach(() => {
      ageControl = addHuntComponent.addHuntForm.controls.est;
    });

    it('should not allow empty est', () => {
      ageControl.setValue('');
      expect(ageControl.valid).toBeFalsy();
    });

    it('should be fine with "25"', () => {
      ageControl.setValue('25');
      expect(ageControl.valid).toBeTruthy();
    });

    it('should fail on negative est', () => {
      ageControl.setValue('-20');
      expect(ageControl.valid).toBeFalsy();
      expect(ageControl.hasError('min')).toBeTruthy();
    });

    it('should fail on ages that are too high', () => {
      ageControl.setValue(300);
      expect(ageControl.valid).toBeFalsy();
      expect(ageControl.hasError('max')).toBeTruthy();
    });

    it('should not allow an est to contain a decimal point', () => {
      ageControl.setValue(20.5);
      expect(ageControl.valid).toBeFalsy();
      expect(ageControl.hasError('pattern')).toBeTruthy();
    });
  });

  describe('getErrorMessage()', () => {
    it('should return the correct error message', () => {
      let controlName: keyof typeof addHuntComponent.addHuntValidationMessages = 'name';
      addHuntComponent.addHuntForm.get(controlName).setErrors({'required': true});
      expect(addHuntComponent.getErrorMessage(controlName)).toEqual('Name is required');

      controlName = 'est';
      addHuntComponent.addHuntForm.get(controlName).setErrors({'required': true});
      expect(addHuntComponent.getErrorMessage(controlName)).toEqual('Estimated time is required');

    });

    it('should return "Unknown error" if no error message is found', () => {
      const controlName: keyof typeof addHuntComponent.addHuntValidationMessages = 'name';
      addHuntComponent.addHuntForm.get(controlName).setErrors({'unknown': true});
      expect(addHuntComponent.getErrorMessage(controlName)).toEqual('Unknown error');
    });
  });
});

describe('AddHuntComponent#submitForm()', () => {
  let component: AddHuntComponent;
  let fixture: ComponentFixture<AddHuntComponent>;
  let hostService: HostService;
  let location: Location;

  beforeEach(() => {
    TestBed.overrideProvider(HostService, { useValue: new MockHostService() });
    TestBed.configureTestingModule({
    imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
            { path: 'hunts/1', component: HuntProfileComponent }
        ]),
        HttpClientTestingModule,
        AddHuntComponent, HuntProfileComponent
    ],
}).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHuntComponent);
    component = fixture.componentInstance;
    hostService = TestBed.inject(HostService);
    location = TestBed.inject(Location);
    TestBed.inject(Router);
    TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.addHuntForm.controls.name.setValue('Best Hunt');
    component.addHuntForm.controls.description.setValue('This is the best hunt');
    component.addHuntForm.controls.est.setValue(30);
  });

  it('should call addHunt() and handle success response', fakeAsync(() => {
    fixture.ngZone.run(() => {
      const addHuntSpy = spyOn(hostService, 'addHunt').and.returnValue(of('1'));
      component.submitForm();
      expect(addHuntSpy).toHaveBeenCalledWith(component.addHuntForm.value);
      tick();
      expect(location.path()).toBe('/hunts/1');
      flush();
    });
  }));

  it('should call addHunt() and handle error response', () => {
    const path = location.path();
    const errorResponse = { status: 500, message: 'Server error' };
    const addHuntSpy = spyOn(hostService, 'addHunt')
      .and
      .returnValue(throwError(() => errorResponse));
    component.submitForm();
    expect(addHuntSpy).toHaveBeenCalledWith(component.addHuntForm.value);
    expect(location.path()).toBe(path);
  });
});
