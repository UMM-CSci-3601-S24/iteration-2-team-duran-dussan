import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteHuntDialogComponent } from './delete-hunt-dialog.component';

describe('DeleteHuntDialogComponent', () => {
  let component: DeleteHuntDialogComponent;
  let fixture: ComponentFixture<DeleteHuntDialogComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({ close: null });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteHuntDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteHuntDialogComponent);
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
