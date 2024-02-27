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

 describe('When getHunts() is called with parameters, it correctly forms the HTTP request (Javalin/Server filtering)', () => {

  it('correctly calls api/hunts with filter parameter \'name\'', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testHunts));

      huntService.getHunts({ name: 'Ann' }).subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);

        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(huntService.huntUrl, { params: new HttpParams().set('name', 'Ann') });
      });
  });

  it('correctly calls api/users with filter parameter \'est\'', () => {
    const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testHunts));

    huntService.getHunts({ est: 30 }).subscribe(() => {
      expect(mockedMethod)
        .withContext('one call')
        .toHaveBeenCalledTimes(1);
      expect(mockedMethod)
        .withContext('talks to the correct endpoint')
        .toHaveBeenCalledWith(huntService.huntUrl, { params: new HttpParams().set('est', '30') });
    });
  });

  it('correctly calls api/users with filter parameter \'numberOfTasks\'', () => {
    const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testHunts));

    huntService.getHunts({ numberOfTasks: 10 }).subscribe(() => {
      expect(mockedMethod)
        .withContext('one call')
        .toHaveBeenCalledTimes(1);
      expect(mockedMethod)
        .withContext('talks to the correct endpoint')
        .toHaveBeenCalledWith(huntService.huntUrl, { params: new HttpParams().set('numberOfTasks', '10') });
    });
  });

  it('correctly calls api/users with filter parameter \'description\'', () => {
    const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testHunts));

    huntService.getHunts({ description: 'exciting hunt' }).subscribe(() => {
      expect(mockedMethod)
        .withContext('one call')
        .toHaveBeenCalledTimes(1);
      expect(mockedMethod)
        .withContext('talks to the correct endpoint')
        .toHaveBeenCalledWith(huntService.huntUrl, { params: new HttpParams().set('description', 'exciting hunt') });
    });
  });

  it('correctly calls api/users with multiple filter parameters', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testHunts));

      huntService.getHunts({ name: 'Fran', est: 45, numberOfTasks: 13 }).subscribe(() => {

        const [url, options] = mockedMethod.calls.argsFor(0);

        const calledHttpParams: HttpParams = (options.params) as HttpParams;
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(url)
          .withContext('talks to the correct endpoint')
          .toEqual(huntService.huntUrl);
        expect(calledHttpParams.keys().length)
          .withContext('should have 3 params')
          .toEqual(3);
        expect(calledHttpParams.get('name'))
          .withContext('name of hunt')
          .toEqual('Fran');
        expect(calledHttpParams.get('est'))
          .withContext('estimated time')
          .toEqual('45');
        expect(calledHttpParams.get('numberOfTasks'))
          .withContext('numberOfTasks being 13')
          .toEqual('13');
      });
  });
});



})
