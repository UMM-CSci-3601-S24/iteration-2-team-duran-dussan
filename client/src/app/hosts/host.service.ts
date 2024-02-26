import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Host } from './host';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  readonly hostUrl: string = `${environment.apiUrl}hosts`;

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

  getHostByUserName(userName: string): Observable<Host> {
    // The input to get could also be written as (this.userUrl + '/' + id)
    return this.httpClient.get<Host>(`${this.hostURL}/${userName}`);
  }

  filterHosts(hosts: Host[], filters: { name?: string; userName?: string }): Host[] {
    let filteredHosts = hosts;

    // Filter by name
    if (filters.name) {
      filters.name = filters.name.toLowerCase();
      filteredHosts = filteredHosts.filter(host => host.name.toLowerCase().indexOf(filters.name) !== -1);
    }

    // Filter by userName
    if (filters.userName) {
      filters.userName = filters.userName.toLowerCase();
      filteredHosts = filteredHosts.filter(host => host.userName.toLowerCase().indexOf(filters.userName) !== -1);
    }

    return filteredHosts;
  }

}
