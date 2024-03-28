// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JoinHuntComponent } from './join-hunt.component';

describe('JoinHuntComponent', () => {
  let component: JoinHuntComponent;

  beforeEach(() => {
    component = new JoinHuntComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle OTP change', () => {
    const otp = ['1', '2', '3', '4', '5', '6'];
    component.handleOtpChange(otp);
    expect(component.accessCode).toEqual('123456');
    expect(component.isAccessCodeValid).toEqual(true);
  });

  it('should handle OTP change with invalid length', () => {
    const otp = ['1', '2', '3'];
    component.handleOtpChange(otp);
    expect(component.accessCode).toEqual('123');
    expect(component.isAccessCodeValid).toEqual(false);
  });
});


