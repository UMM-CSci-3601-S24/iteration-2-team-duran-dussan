import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { HuntCardComponent } from './hunt-card.component';
import { CompleteHunt } from './completeHunt';
import { HostService } from '../hosts/host.service';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-hunt-profile',
    templateUrl: './hunt-profile.component.html',
    styleUrls: ['./hunt-profile.component.scss'],
    standalone: true,
    imports: [HuntCardComponent, MatCardModule, MatIconButton, MatIcon, HttpClientModule]
})
export class HuntProfileComponent implements OnInit, OnDestroy {
  completeHunt: CompleteHunt;
  error: { help: string, httpResponse: string, message: string };

  private ngUnsubscribe = new Subject<void>();

  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private hostService: HostService, private router: Router) { }

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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
