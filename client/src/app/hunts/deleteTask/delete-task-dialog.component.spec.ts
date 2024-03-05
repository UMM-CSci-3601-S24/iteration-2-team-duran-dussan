import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteTaskDialogComponent } from './delete-task-dialog.component';

describe('DeleteTaskDialogComponent', () => {
  let component: DeleteTaskDialogComponent;
  let fixture: ComponentFixture<DeleteTaskDialogComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({ close: null });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteTaskDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on no click', () => {
    component.onNoClick();
    expect(dialogRefSpyObj.close).toHaveBeenCalled();
  });

  it('should close dialog with confirm on yes click', () => {
    component.onYesClick();
    expect(dialogRefSpyObj.close).toHaveBeenCalledWith('confirm');
  });
});
