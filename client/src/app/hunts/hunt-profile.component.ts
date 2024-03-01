import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { Hunt } from './hunt';
import { HuntCardComponent } from './hunt-card.component';
import { HuntService } from './hunt.service';

@Component({
    selector: 'app-hunt-profile',
    templateUrl: './hunt-profile.component.html',
    styleUrls: ['./hunt-profile.component.scss'],
    standalone: true,
    imports: [HuntCardComponent, MatCardModule]
})
export class HuntProfileComponent implements OnInit, OnDestroy {
  hunt: Hunt;
  error: { help: string, httpResponse: string, message: string };

  private ngUnsubscribe = new Subject<void>();

  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private huntService: HuntService, private router: Router) { }

  ngOnInit(): void {

    this.route.paramMap.pipe(

      map((paramMap: ParamMap) => paramMap.get('id')),

      switchMap((id: string) => this.huntService.getHuntById(id)),

      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: hunt => {
        this.hunt = hunt;
        return hunt;
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
    this.huntService.deleteHunt(id).subscribe(() => {
      this.router.navigate(['/todos']);
    });
  }

  ngOnDestroy() {
    // When the component is destroyed, we'll emit an empty
    // value as a way of saying that any active subscriptions should
    // shut themselves down so the system can free up any associated
    // resources, like memory.
    this.ngUnsubscribe.next();
    // Calling `complete()` says that this `Subject` is done and will
    // never send any further values.
    this.ngUnsubscribe.complete();
  }
}
