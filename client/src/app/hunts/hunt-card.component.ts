import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { Hunt } from './hunt';
import { Subject, takeUntil } from 'rxjs';
import { HuntService } from './hunt.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-hunt-card',
    templateUrl: './hunt-card.component.html',
    styleUrls: ['./hunt-card.component.scss'],
    standalone: true,
    imports: [MatCardModule, MatButtonModule, MatListModule, MatIconModule, RouterLink]
})
export class HuntCardComponent implements OnInit, OnDestroy  {
  hunt = input.required<Hunt>();
  simple = input(false);

  public serverFilteredHunts: Hunt[];
  public filteredHunts: Hunt[];

  public huntName: string;
  public huntEst: number;
  public huntDescription: string;
  public huntnumberOfTasks: number;
  public viewType: 'card' | 'list' = 'card';

  errMsg = '';
  private ngUnsubscribe = new Subject<void>();

  constructor(private huntService: HuntService, private snackBar: MatSnackBar) {
    // Nothing here – everything is in the injection parameters.
  }

  getHuntsFromServer(): void {

    this.huntService.getHunts({
      name: this.huntName,
      est: this.huntEst
    }).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({

      next: (returnedHunts) => {

        this.serverFilteredHunts = returnedHunts;

        //this.updateFilter();
      },

      error: (err) => {
        if (err.error instanceof ErrorEvent) {
          this.errMsg = `Problem in the client – Error: ${err.error.message}`;
        } else {
          this.errMsg = `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`;
        }
        this.snackBar.open(
          this.errMsg,
          'OK',
          // The message will disappear after 6 seconds.
          { duration: 6000 });
      },

    });
  }

  /*
  public updateFilter(): void {
    this.filteredHunts = this.huntService.filterHunts(
      this.serverFilteredHunts, { name: this.huntName, company: this.huntCompany });
  } */


  ngOnInit(): void {
    this.getHuntsFromServer();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}

