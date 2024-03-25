import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { CompleteHunt } from 'src/app/hunts/completeHunt';
import { Task } from 'src/app/hunts/task';
import { HuntCardComponent } from 'src/app/hunts/hunt-card.component';
import { HostService } from 'src/app/hosts/host.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-hunter-view',
  standalone: true,
  imports: [HuntCardComponent, CommonModule, MatCardModule],
  templateUrl: './hunter-view.component.html',
  styleUrl: './hunter-view.component.scss'
})
export class HunterViewComponent implements OnInit, OnDestroy {
  completeHunt: CompleteHunt;
  tasks: Task[] = [];
  error: { help: string, httpResponse: string, message: string };
  imageUrls = {};
  url = 'https://img.icons8.com/ios/100/000000/contract-job.png';

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private hostService: HostService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
      this.route.paramMap.pipe(
        map((params: ParamMap) => params.get('id')),
        switchMap((id: string) => this.hostService.getHuntById(id)),
        takeUntil(this.ngUnsubscribe)
        ).subscribe({
          next: (completeHunt: CompleteHunt) => {
            this.completeHunt = completeHunt;
            this.tasks = completeHunt.tasks;
          },
          error: _err => {
            this.error = {
              help: 'There is an error trying to load the tasks - Please try to run the hunt again',
              httpResponse: _err.message,
              message: _err.error?.title,
            };
          }
        });
    }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onFileSelected(event, task: Task): void {
    const fileType = event.target.files[0].type;
    if (fileType.match(/image\/*/)) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: ProgressEvent<FileReader>) => {
        this.imageUrls[task._id] = event.target.result.toString();
      };
    } else {
      window.alert('Please select correct image format');
    }
  }

}
