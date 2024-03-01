import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { Hunt } from "../hunts/hunt";
import { HostService } from "./host.service";
import { TestBed } from "@angular/core/testing";

describe
('HostService', () => {
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

  
})
