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

  it('should handle change with invalid access code', () => {
    component.input1 = { nativeElement: { value: '1' } };
    component.input2 = { nativeElement: { value: '2' } };
    component.input3 = { nativeElement: { value: '3' } };
    component.input4 = { nativeElement: { value: '4' } };
    component.input5 = { nativeElement: { value: '5' } };
    component.input6 = { nativeElement: { value: '6' } };
    hostService.getStartedHunt.and.returnValue(throwError(new Error()));
    component.checkAccessCode();
    expect(component.accessCode).toEqual('123456');
    expect(component.isAccessCodeValid).toEqual(false);
    expect(snackBar.open).toHaveBeenCalledWith('Invalid access code. No hunt was found.', 'Close', { duration: 6000 });
  });

  it('should handle change with valid access code', () => {
    component.input1 = { nativeElement: { value: '1' } };
    component.input2 = { nativeElement: { value: '2' } };
    component.input3 = { nativeElement: { value: '3' } };
    component.input4 = { nativeElement: { value: '4' } };
    component.input5 = { nativeElement: { value: '5' } };
    component.input6 = { nativeElement: { value: '6' } };
    const startedHunt: StartedHunt = {
      accessCode: '123456', completeHunt: null,
      _id: ''
    };
    hostService.getStartedHunt.and.returnValue(of(startedHunt));
    component.checkAccessCode();
    expect(component.accessCode).toEqual('123456');
    expect(component.isAccessCodeValid).toEqual(true);
  })

  it('should handle type access code will move to next box', () => {
    component.input1 = { nativeElement: { focus: jasmine.createSpy() } };
    component.input2 = { nativeElement: { focus: jasmine.createSpy() } };
    component.input3 = { nativeElement: { focus: jasmine.createSpy() } };
    component.input4 = { nativeElement: { focus: jasmine.createSpy() } };
    component.input5 = { nativeElement: { focus: jasmine.createSpy() } };
    component.input6 = { nativeElement: { focus: jasmine.createSpy() } };

    component.onKeyUp({ target: { value: '1' } }, 1);
    expect(component.input2.nativeElement.focus).toHaveBeenCalled();
    component.onKeyUp({ target: { value: '1' } }, 2);
    expect(component.input3.nativeElement.focus).toHaveBeenCalled();
    component.onKeyUp({ target: { value: '1' } }, 3);
    expect(component.input4.nativeElement.focus).toHaveBeenCalled();
    component.onKeyUp({ target: { value: '1' } }, 4);
    expect(component.input5.nativeElement.focus).toHaveBeenCalled();
    component.onKeyUp({ target: { value: '1' } }, 5);
    expect(component.input6.nativeElement.focus).toHaveBeenCalled();
  });

  it('should handle delete access code will move to next box', () => {
    component.input1 = { nativeElement: { focus: jasmine.createSpy() } };
    component.input2 = { nativeElement: { focus: jasmine.createSpy() } };
    component.input3 = { nativeElement: { focus: jasmine.createSpy() } };
    component.input4 = { nativeElement: { focus: jasmine.createSpy() } };
    component.input5 = { nativeElement: { focus: jasmine.createSpy() } };
    component.input6 = { nativeElement: { focus: jasmine.createSpy() } };

    component.onKeyUp({ target: { value: '1' } }, 1);
    expect(component.input2.nativeElement.focus).toHaveBeenCalled();
    component.onKeyDown({ key: 'Backspace', target: { value: '' } }, 2);
    expect(component.input1.nativeElement.focus).toHaveBeenCalled();

    component.onKeyUp({ target: { value: '2' } }, 2);
    expect(component.input3.nativeElement.focus).toHaveBeenCalled();
    component.onKeyDown({ key: 'Backspace', target: { value: '' } }, 3);
    expect(component.input2.nativeElement.focus).toHaveBeenCalled();

    component.onKeyUp({ target: { value: '3' } }, 3);
    expect(component.input4.nativeElement.focus).toHaveBeenCalled();
    component.onKeyDown({ key: 'Backspace', target: { value: '' } }, 4);
    expect(component.input3.nativeElement.focus).toHaveBeenCalled();

    component.onKeyUp({ target: { value: '4' } }, 4);
    expect(component.input5.nativeElement.focus).toHaveBeenCalled();
    component.onKeyDown({ key: 'Backspace', target: { value: '' } }, 5);
    expect(component.input4.nativeElement.focus).toHaveBeenCalled();

    component.onKeyUp({ target: { value: '5' } }, 5);
    expect(component.input6.nativeElement.focus).toHaveBeenCalled();
    component.onKeyDown({ key: 'Backspace', target: { value: '' } }, 6);
    expect(component.input5.nativeElement.focus).toHaveBeenCalled();
  })

  it('should paste access code in right order', () => {
    component.input1 = { nativeElement: { focus: jasmine.createSpy() } };
    component.input2 = { nativeElement: { focus: jasmine.createSpy() } };
    component.input3 = { nativeElement: { focus: jasmine.createSpy() } };
    component.input4 = { nativeElement: { focus: jasmine.createSpy() } };
    component.input5 = { nativeElement: { focus: jasmine.createSpy() } };
    component.input6 = { nativeElement: { focus: jasmine.createSpy() } };

    component.input1 = { nativeElement: { value: '' } };
    component.input2 = { nativeElement: { value: '' } };
    component.input3 = { nativeElement: { value: '' } };
    component.input4 = { nativeElement: { value: '' } };
    component.input5 = { nativeElement: { value: '' } };
    component.input6 = { nativeElement: { value: '' } };

    const pasteData = '123456'; // Mock paste data
    const clipboardEvent = {
      clipboardData: {
        getData: () => pasteData
      },
      preventDefault: () => {}
    } as unknown as ClipboardEvent;

    component.onPaste(clipboardEvent);

    expect(component.input1.nativeElement.value).toBe('1');
    expect(component.input2.nativeElement.value).toBe('2');
    expect(component.input3.nativeElement.value).toBe('3');
    expect(component.input4.nativeElement.value).toBe('4');
    expect(component.input5.nativeElement.value).toBe('5');
    expect(component.input6.nativeElement.value).toBe('6');
  });

  it('should prevent default action for non-numeric keys', () => {
    const event = new KeyboardEvent('keypress', { key: 'a' });
    spyOn(event, 'preventDefault');

    component.numericOnly(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should not prevent default action for numeric keys', () => {
    const event = new KeyboardEvent('keypress', { key: '1' });
    spyOn(event, 'preventDefault');

    component.numericOnly(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
