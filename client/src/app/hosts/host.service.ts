import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Host } from './host';
import { Hunt } from '../hunts/hunt';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  readonly hostUrl: string = `${environment.apiUrl}hosts`;
  readonly huntUrl: string = `${environment.apiUrl}hunts`;

  private readonly nameKey = 'name';
  private readonly userNameKey = 'username';

  constructor(private httpClient: HttpClient){
  }

  getHosts(filters?: {name?: string; userName?: string }) : Observable<Host[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.name) {
        httpParams = httpParams.set(this.nameKey, filters.name);
      }
      if (filters.userName) {
        httpParams = httpParams.set(this.userNameKey, filters.userName);
      }
    }

    return this.httpClient.get<Host[]>(this.hostUrl, {
      params: httpParams,
    });

  }

  getHunts(filters?: { hostId?: string }): Observable<Hunt[]> {
    let httpParams: HttpParams = new HttpParams();
    if(filters) {
      if (filters.hostId){
        httpParams = httpParams.set(this.nameKey, filters.hostId);
      }
    }
    return this.httpClient.get<Hunt[]>(this.huntUrl, {
      params: httpParams,
    });

  }

  getHuntById(id: string): Observable<Hunt> {
    return this.httpClient.get<Hunt>(`${this.huntUrl}/${id}`);
  }

}
