import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Hunt } from '../hunts/hunt';
import { Task } from '../hunts/task';
import { CompleteHunt } from '../hunts/completeHunt';
import { StartedHunt } from '../startHunt/startedHunt';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  readonly hostUrl: string = `${environment.apiUrl}hosts`;
  readonly huntUrl: string = `${environment.apiUrl}hunts`;
  readonly taskUrl: string = `${environment.apiUrl}tasks`;
  readonly startHuntUrl: string = `${environment.apiUrl}startHunt`;
  readonly startedHuntUrl: string = `${environment.apiUrl}startedHunts`;
  readonly endHuntUrl: string = `${environment.apiUrl}endHunt`;

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

  addTask(newTask: Partial<Task>): Observable<string> {
    return this.httpClient.post<{id: string}>(this.taskUrl, newTask).pipe(map(res => res.id));
  }

  deleteHunt(id: string): Observable<void> {
    return this.httpClient.delete<void>(`/api/hunts/${id}`);
  }

  deleteTask(id: string): Observable<void> {
    return this.httpClient.delete<void>(`/api/tasks/${id}`);
  }

  startHunt(id: string): Observable<string> {
    return this.httpClient.get<string>(`${this.startHuntUrl}/${id}`);
  }

  getStartedHunt(accessCode: string): Observable<StartedHunt> {
    return this.httpClient.get<StartedHunt>(`${this.startedHuntUrl}/${accessCode}`);
  }

  // This is a put request that ends the hunt by setting its status to false
  endStartedHunt(id: string): Observable<void> {
    return this.httpClient.put<void>(`${this.endHuntUrl}/${id}`, null);
  }

  // This is a get request that gets all the ended StartedHunts
  getEndedHunts(): Observable<StartedHunt[]> {
    return this.httpClient.get<StartedHunt[]>(`${this.endHuntUrl}`);
  }

}
