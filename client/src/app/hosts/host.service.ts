import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//import { map } from 'rxjs/operators';
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

  getHostById(id: string): Observable<Host> {
    // The input to get could also be written as (this.userUrl + '/' + id)
    return this.httpClient.get<Host>(`${this.hostUrl}/${id}`);
  }

}
