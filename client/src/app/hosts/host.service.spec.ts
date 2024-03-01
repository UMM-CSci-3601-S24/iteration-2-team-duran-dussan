import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { Hunt } from "../hunts/hunt";
import { HostService } from "./host.service";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { of } from "rxjs";

describe('HostService', () => {
  const testHunts: Hunt[] = [
    {
      _id: "ann_id",
      hostId: "ann_hid",
      name: "Anns Hunt",
      description: "exciting hunt",
      est: 30,
      numberOfTasks: 10,
    },
    {
      _id: "fran_id",
      hostId: "fran_hid",
      name: "Frans Hunt",
      description: "super exciting hunt",
      est: 45,
      numberOfTasks: 13,
    },
    {
      _id: "jan_id",
      hostId: "jan_hid",
      name: "Jans Hunt",
      description: "super fun and exciting hunt",
      est: 60,
      numberOfTasks: 18,
    }
  ];
  let hostService: HostService;
  let httpClient: HttpClient
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
  })

  describe('When getHunts() is called with a hostId', () => {
    it('calls api/hosts/:hostId', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testHunts));

      hostService.getHunts('ann_id').subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);

        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(`${hostService.hostUrl}/ann_id`);
      });
    });
  });

  describe('When getHuntById() is given an ID', () => {
    it('calls api/hunts/id with the correct ID', waitForAsync(() => {
      const targetHunt: Hunt = testHunts[1];
      const targetId: string = targetHunt._id;

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
});
