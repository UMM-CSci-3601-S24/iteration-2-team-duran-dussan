import { of, throwError } from 'rxjs';
import { JoinHuntComponent } from './join-hunt.component';
import { HostService } from 'src/app/hosts/host.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StartedHunt } from 'src/app/startHunt/startedHunt';

describe('JoinHuntComponent', () => {
  let component: JoinHuntComponent;
  let hostService: jasmine.SpyObj<HostService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    hostService = jasmine.createSpyObj('HostService', ['getStartedHunt']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    component = new JoinHuntComponent(hostService, router, snackBar);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle OTP change with invalid access code', () => {
    const otp = ['1', '2', '3', '4', '5', '6'];
    hostService.getStartedHunt.and.returnValue(throwError(new Error()));
    component.handleOtpChange(otp);
    expect(component.accessCode).toEqual('123456');
    expect(component.isAccessCodeValid).toEqual(false);
    expect(snackBar.open).toHaveBeenCalledWith('Invalid access code. No hunt was found.', 'Close', { duration: 6000 });
  });

  it('should handle OTP change with invalid length', () => {
    const otp = ['1', '2', '3'];
    component.handleOtpChange(otp);
    expect(component.accessCode).toEqual('123');
    expect(component.isAccessCodeValid).toEqual(false);
  });

  it('should handle OTP change with valid access code', () => {
    const otp = ['1', '2', '3', '4', '5', '6'];
    const startedHunt: StartedHunt = {
      accessCode: '123456', completeHunt: null,
      _id: ''
    };
    hostService.getStartedHunt.and.returnValue(of(startedHunt));
    component.handleOtpChange(otp);
    expect(component.isAccessCodeValid).toEqual(true);
    expect(router.navigate).toHaveBeenCalledWith(['hunt', startedHunt.accessCode]);
  });

});
