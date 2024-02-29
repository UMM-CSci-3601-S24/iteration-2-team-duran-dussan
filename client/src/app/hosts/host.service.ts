import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
//import { Host } from './host';
import { Hunt } from '../hunts/hunt';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  readonly hostUrl: string = `${environment.apiUrl}hosts`;
  readonly huntUrl: string = `${environment.apiUrl}hunts`;

  private readonly nameKey = 'name';
  private readonly userNameKey = 'username';
  private readonly hostIdKey = 'hostId'

  constructor(private httpClient: HttpClient){
  }

  getHunts(hostId: string): Observable<Hunt[]> {
    return this.httpClient.get<Hunt[]>(`${this.hostUrl}/${hostId}`);
  }

  getHuntById(id: string): Observable<Hunt> {
    return this.httpClient.get<Hunt>(`${this.huntUrl}/${id}`);
  }

}
