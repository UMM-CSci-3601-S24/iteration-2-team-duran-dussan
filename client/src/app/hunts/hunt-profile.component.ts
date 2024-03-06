import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { HuntCardComponent } from './hunt-card.component';
import { CompleteHunt } from './completeHunt';
import { HostService } from '../hosts/host.service';
import { AddTaskComponent } from './addTask/add-task.component';
import { MatDivider } from '@angular/material/divider';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DeleteHuntDialogComponent } from './deleteHunt/delete-hunt-dialog.component';
import { DeleteTaskDialogComponent } from './deleteTask/delete-task-dialog.component';

@Component({
    selector: 'app-hunt-profile',
    templateUrl: './hunt-profile.component.html',
    styleUrls: ['./hunt-profile.component.scss'],
    standalone: true,
    imports: [HuntCardComponent, MatCardModule, AddTaskComponent, MatDivider, MatIconButton, MatIcon, HttpClientModule]
})
export class HuntProfileComponent implements OnInit, OnDestroy {
  confirmDeleteHunt: boolean =false;
  completeHunt: CompleteHunt;
  error: { help: string, httpResponse: string, message: string };

  private ngUnsubscribe = new Subject<void>();

  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private hostService: HostService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {

    this.route.paramMap.pipe(

      map((paramMap: ParamMap) => paramMap.get('id')),

      switchMap((id: string) => this.hostService.getHuntById(id)),

      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: completeHunt => {
        this.completeHunt = completeHunt;
        return ;
      },
      error: _err => {
        this.error = {
          help: 'There was a problem loading the hunt – try again.',
          httpResponse: _err.message,
          message: _err.error?.title,
        };
      }

    });
  }

  deleteHunt(id: string): void {
    console.log('Deleting hunt with ID:', id);
    this.hostService.deleteHunt(id).subscribe(() => {
      console.log('Hunt deleted successfully.');
      this.router.navigate(['/hosts']);
    });
  }

  deleteTask(id: string): void {
    this.hostService.deleteTask(id).subscribe(() => {
      location.reload();
    });
  }

  openDeleteHuntDialog(huntId: string): void {
    const dialogRef = this.dialog.open(DeleteHuntDialogComponent, {
      width: '400px',
      height: '300px',
      data: { huntId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.deleteHunt(huntId);
      }
    });
  }

  openDeleteTaskDialog(taskId: string): void {
    const dialogRef = this.dialog.open(DeleteTaskDialogComponent, {
      width: '400px',
      height: '300px',
      data: { taskId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.deleteTask(taskId);
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
