import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Hunt } from '../app/hunts/hunt';
import { HostService } from '../app/hosts/host.service';

@Injectable({
  providedIn: AppComponent
})
export class MockHostService extends HostService {
  static testHunts: Hunt[] = [
    {
      _id: "ann_id",
    hostId: "ann_hid",
    name: "Anns Hunt",
    description: "exciting hunt",
    est: 30,
    numberOfTasks: 10,
    },
    {
      _id: "fran_id",
    hostId: "fran_hid",
    name: "Frans Hunt",
    description: "super exciting hunt",
    est: 45,
    numberOfTasks: 13,
    },
    {
      _id: "jan_id",
    hostId: "jan_hid",
    name: "Jans Hunt",
    description: "super fun and exciting hunt",
    est: 60,
    numberOfTasks: 18,
    },
  ];

  constructor() {
    super(null);
  }


  getHunts(): Observable<Hunt[]> {
    return of(MockHostService.testHunts);
  }

  getHuntById(id: string): Observable<Hunt> {

    if (id === MockHostService.testHunts[0]._id) {
      return of(MockHostService.testHunts[0]);
    } else if (id === MockHostService.testHunts[1]._id) {
      return of(MockHostService.testHunts[1]);
    } else {
      return of(null);
    }
  }
}
