import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Hunt } from '../hunts/hunt';
import { HostService } from './host.service';

describe('HostService', () => {
const testHunts: Hunt[] = [
  {
    _id: "5889",
    hostId: "588",
    name: "Default Hunt 1",
    description: "This is the default hunt 1",
    est: 20,
    numberOfTasks: 4
  },
  {
    _id: "5754",
    hostId: "575",
    name: "Default Hunt 2",
    description: "This is the default hunt 2",
    est: 17,
    numberOfTasks: 4
  },
  {
    _id: "de7c",
    hostId: "e7c",
    name: "Default Hunt 3",
    description: "This is the default hunt 3",
    est: 15,
    numberOfTasks: 4
  },
];
let hostService: HostService;
let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
  });
  httpClient = TestBed.inject(HttpClient);
  httpTestingController = TestBed.inject(HttpTestingController);
  hostService = new HostService(httpClient);
  });

afterEach(() => {
  httpTestingController.verify();
});

describe('When getHunts() is called', () => {

  it('calls `api/hosts/575`', waitForAsync(() => {

    const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testHunts));

    hostService.getHunts("575").subscribe(() => {

     expect(mockedMethod)
      .withContext('one call')
      .toHaveBeenCalledTimes(1);

     expect(mockedMethod)
      .withContext('talks to the correct endpoint')
      .toHaveBeenCalledWith(`${hostService.hostUrl}/575`);
    });
  }));
 });

 describe('When getUserById() is given an ID', () => {

   it('calls api/hosts/hostId with the correct hostId', waitForAsync(() => {

     const targetHunt: Hunt = testHunts[1];
     const targetId: string = targetHunt.hostId;

     const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(targetHunt));

     hostService.getHuntById(targetId).subscribe(() => {
       expect(mockedMethod)
         .withContext('one call')
         .toHaveBeenCalledTimes(1);
       expect(mockedMethod)
         .withContext('talks to the correct endpoint')
         .toHaveBeenCalledWith(`${hostService.huntUrl}/${targetId}`);
     });
   }));
 });
})
