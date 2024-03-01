import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { throwError } from 'rxjs';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { MockHostService } from '../../testing/host.service.mock';
import { Hunt } from './hunt';
import { HuntCardComponent } from './hunt-card.component';
import { HuntProfileComponent } from './hunt-profile.component';
import { HuntService } from './hunt.service';
//import { HttpClientTestingModule } from '@angular/common/http/testing';
//import { ReactiveFormsModule } from '@angular/forms';
//import { MatInputModule } from '@angular/material/input';
//import { MatSelectModule } from '@angular/material/select';
//import { MatSnackBarModule } from '@angular/material/snack-bar';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('HuntProfileComponent', () => {
  let component: HuntProfileComponent;
  let fixture: ComponentFixture<HuntProfileComponent>;
  const mockHuntService = new MockHostService();
  const chrisId = 'chris_id';
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({
    id : chrisId
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        RouterTestingModule,
        MatCardModule,
        HuntProfileComponent, HuntCardComponent
    ],
    providers: [
        { provide: HuntService, useValue: mockHuntService },
        { provide: ActivatedRoute, useValue: activatedRoute }
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HuntProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to a specific hunt profile', () => {
    const expectedHunt: Hunt = MockHostService.testHunts[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `HuntProfileComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedHunt._id });
    expect(component.hunt).toEqual(expectedHunt);
  });

  it('should navigate to correct hunt when the id parameter changes', () => {
    let expectedHunt: Hunt = MockHostService.testHunts[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `HuntProfileComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedHunt._id });
    expect(component.hunt).toEqual(expectedHunt);

    // Changing the paramMap should update the displayed hunt profile.
    expectedHunt = MockHostService.testHunts[1];
    activatedRoute.setParamMap({ id: expectedHunt._id });
    expect(component.hunt).toEqual(expectedHunt);
  });

  it('should have `null` for the hunt for a bad ID', () => {
    activatedRoute.setParamMap({ id: 'badID' });

    // If the given ID doesn't map to a hunt, we expect the service
    // to return `null`, so we would expect the component's hunt
    // to also be `null`.
    expect(component.hunt).toBeNull();
  });

  it('should set error data on observable error', () => {
    activatedRoute.setParamMap({ id: chrisId });

    const mockError = { message: 'Test Error', error: { title: 'Error Title' } };

    // const errorResponse = { status: 500, message: 'Server error' };
    // "Spy" on the `.addHunt()` method in the hunt service. Here we basically
    // intercept any calls to that method and return the error response
    // defined above.
    const getHuntSpy = spyOn(mockHuntService, 'getHuntById')
      .and
      .returnValue(throwError(() => mockError));

    // component.hunt = throwError(() => mockError) as Observable<Hunt>;

    component.ngOnInit();

    expect(component.error).toEqual({
      help: 'There was a problem loading the hunt – try again.',
      httpResponse: mockError.message,
      message: mockError.error.title,
    });
    expect(getHuntSpy).toHaveBeenCalledWith(chrisId);
  });
});

/*

describe('DeleteHunt()', () => {
  let component: HuntProfileComponent;
  let fixture: ComponentFixture<HuntProfileComponent>;
  let huntService: HuntService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let location: Location;
  let router: Router;
  const fryId = 'fry_id';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({
    id : fryId
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'hunts/1', component: HuntProfileComponent }
        ]),
        HttpClientTestingModule
      ],
      providers: [HuntService]
    }).compileComponents();

    fixture = TestBed.createComponent(HuntProfileComponent);
    component = fixture.componentInstance;
    huntService = TestBed.inject(HuntService);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
  });

  it('should call deleteHunt on HuntService when deleteHunt is called in HuntProfileComponent', () => {
    const deleteHuntSpy = spyOn(huntService, 'deleteHunt').and.callThrough();
    component.deleteHunt(fryId);
    expect(deleteHuntSpy).toHaveBeenCalledWith(fryId);
  });

  it('should delete a hunt and navigate to /hunts', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const deleteHuntSpy = spyOn(huntService, 'deleteHunt').and.returnValue(of(null));

    component.deleteHunt('testId');

    expect(deleteHuntSpy).toHaveBeenCalledWith('testId');
    expect(navigateSpy).toHaveBeenCalledWith(['/hunts']);
  });
});
*/
