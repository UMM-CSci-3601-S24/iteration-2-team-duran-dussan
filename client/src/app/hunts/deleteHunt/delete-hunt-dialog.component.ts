import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

export interface DialogData {
  huntId: string;
}

@Component({
  selector: 'app-delete-hunt-dialog',
  templateUrl: './delete-hunt-dialog.component.html',
  styleUrls: ['./delete-hunt-dialog.component.scss'],
  standalone: true,
  imports: [MatButton]
})
export class DeleteHuntDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteHuntDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close('confirm');
  }
}
