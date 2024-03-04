import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Hunt } from '../hunts/hunt';
import { CompleteHunt } from '../hunts/completeHunt';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  readonly hostUrl: string = `${environment.apiUrl}hosts`;
  readonly huntUrl: string = `${environment.apiUrl}hunts`;

  constructor(private httpClient: HttpClient){
  }

  getHunts(hostId: string): Observable<Hunt[]> {
    return this.httpClient.get<Hunt[]>(`${this.hostUrl}/${hostId}`);
  }

  getHuntById(id: string): Observable<CompleteHunt> {
    return this.httpClient.get<CompleteHunt>(`${this.huntUrl}/${id}`);
  }

  addHunt(newHunt: Partial<Hunt>): Observable<string> {
    newHunt.hostId = "588945f57546a2daea44de7c";
    return this.httpClient.post<{id: string}>(this.huntUrl, newHunt).pipe(map(result => result.id));
  }

  deleteHunt(id: string): Observable<void> {
    return this.httpClient.delete<void>(`/api/hunts/${id}`);
  }

}
