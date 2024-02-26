import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Host } from './host';
import { HostService } from './host.service';

describe('HostService', () => {
const testHosts: Host[] = [
  {
    _id: 'chris_id',
    name: 'Chris',
    userName: '17chrispy',
    email: 'chris@this.that',
  },
  {
    _id: 'tom_id',
    name: 'Tom',
    userName: 'tomtastic8',
    email: 'tom@this.that',
  },
  {
    _id: 'ann_id',
    name: 'Ann',
    userName: '$4ann',
    email: 'ann@this.that',
  },
];
let hostService: HostService;
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
  hostService = new HostService(httpClient);
});

afterEach(() => {
  httpTestingController.verify();
});

describe('When getHosts() is called with no parameters', () => {

   it('calls `api/hosts`', waitForAsync(() => {

     const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testHosts));

     hostService.getHosts().subscribe(() => {

       expect(mockedMethod)
         .withContext('one call')
         .toHaveBeenCalledTimes(1);

       expect(mockedMethod)
         .withContext('talks to the correct endpoint')
         .toHaveBeenCalledWith(hostService.hostUrl, { params: new HttpParams() });
     });
   }));
 });

})
