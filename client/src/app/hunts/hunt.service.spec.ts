import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Hunt } from './hunt';
import { HuntService } from './hunt.service';

describe('HuntService', () => {
const testHunts: Hunt[] = [
  {
    _id: "ann_id",
  hostId: "ann_hid",
  name: "Ann",
  description: "exciting hunt",
  est: 30,
  numberOfTasks: 10,
  },
  {
    _id: "fran_id",
  hostId: "fran_hid",
  name: "Fran",
  description: "super exciting hunt",
  est: 45,
  numberOfTasks: 13,
  },
  {
    _id: "jan_id",
  hostId: "jan_hid",
  name: "Jan",
  description: "super fun and exciting hunt",
  est: 60,
  numberOfTasks: 18,
  },

];
let huntService: HuntService;
let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

beforeEach(() => {
  // Set up the mock handling of the HTTP requests
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  });
  // Construct an instance of the service with the mock
  // HTTP client.
  httpClient = TestBed.inject(HttpClient);
  httpTestingController = TestBed.inject(HttpTestingController);
  huntService = new HuntService(httpClient);
});

afterEach(() => {
  // After every test, assert that there are no more pending requests.
  httpTestingController.verify();
});

describe('When getHunts() is called with no parameters', () => {

   it('calls `api/hunts`', waitForAsync(() => {

     const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testHunts));

     huntService.getHunts().subscribe(() => {

       expect(mockedMethod)
         .withContext('one call')
         .toHaveBeenCalledTimes(1);

       expect(mockedMethod)
         .withContext('talks to the correct endpoint')
         .toHaveBeenCalledWith(huntService.huntUrl, { params: new HttpParams() });
     });
   }));
 });



})
