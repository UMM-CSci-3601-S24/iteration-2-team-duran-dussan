import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JoinHuntComponent } from './join-hunt.component';

describe('JoinHuntComponent', () => {
  let component: JoinHuntComponent;
  let fixture: ComponentFixture<JoinHuntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinHuntComponent, NoopAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinHuntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('numericOnly', () => {
    it('should return true for numeric input', () => {
      const event = {
        which: 50, // represents '2'
        preventDefault: jasmine.createSpy('preventDefault')
      };
      expect(component.numericOnly(event)).toBeTrue();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should return false for non-numeric input', () => {
      const event = {
        which: 65, // represents 'A'
        preventDefault: jasmine.createSpy('preventDefault')
      };
      expect(component.numericOnly(event)).toBeFalse();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should use keyCode if which is not available', () => {
      const event = {
        keyCode: 50, // represents '2'
        preventDefault: jasmine.createSpy('preventDefault')
      };
      expect(component.numericOnly(event)).toBeTrue();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });
});


