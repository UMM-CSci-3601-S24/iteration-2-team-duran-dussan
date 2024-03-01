import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Hunt } from './hunt';

@Injectable({
  providedIn: `root`
})
export class HuntService {
  readonly huntUrl: string = `${environment.apiUrl}hunts`;

  private readonly nameKey = 'name';
  private readonly estKey = 'est';
  private readonly descriptionKey = 'description';
  private readonly numberOfTasksKey = 'numberOfTasks'

  constructor(private httpClient: HttpClient) {
  }

  getHunts(filters?: { name?: string; numberOfTasks?: number; est?: number; description?: string; hostId?: string }): Observable<Hunt[]> {
    let httpParams: HttpParams = new HttpParams();
    if(filters) {
      if (filters.name){
        httpParams = httpParams.set(this.nameKey, filters.name);
      }
      if (filters.est){
        httpParams = httpParams.set(this.estKey, filters.est.toString());
      }
      if (filters.description){
        httpParams = httpParams.set(this.descriptionKey, filters.description);
      }
      if (filters.numberOfTasks){
        httpParams = httpParams.set(this.numberOfTasksKey, filters.numberOfTasks.toString());
      }
    }
    return this.httpClient.get<Hunt[]>(this.huntUrl, {
      params: httpParams,
    });

  }

  getHuntById(id: string): Observable<Hunt> {
    return this.httpClient.get<Hunt>(`${this.huntUrl}/${id}`);
  }

  deleteHunt(id: string): Observable<void> {
    return this.httpClient.delete<void>(`/api/hunts/${id}`);
  }
}
