import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { MockHostService } from '../../testing/host.service.mock';
import { HuntCardComponent } from './hunt-card.component';
import { HuntProfileComponent } from './hunt-profile.component';
import { HostService } from '../hosts/host.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CompleteHunt } from './completeHunt';
import { HttpClientModule } from '@angular/common/http';
import { Location } from '@angular/common';


describe('HuntProfileComponent', () => {
  let component: HuntProfileComponent;
  let fixture: ComponentFixture<HuntProfileComponent>;
  const mockHostService = new MockHostService();
  const chrisId = 'chris_id';
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({
    id : chrisId
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        HttpClientModule,
        RouterTestingModule,
        MatCardModule,
        HuntProfileComponent, HuntCardComponent, HttpClientModule, HttpClientTestingModule
    ],
    providers: [
        { provide: HostService, useValue: mockHostService },
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
    const expectedHunt: CompleteHunt = MockHostService.testCompleteHunts[0];
    activatedRoute.setParamMap({ id: expectedHunt.hunt._id });
    expect(component.completeHunt).toEqual(expectedHunt);
  });

  it('should navigate to correct hunt when the id parameter changes', () => {
    let expectedHunt: CompleteHunt = MockHostService.testCompleteHunts[0];
    activatedRoute.setParamMap({ id: expectedHunt.hunt._id });
    expect(component.completeHunt).toEqual(expectedHunt);

    expectedHunt = MockHostService.testCompleteHunts[1];
    activatedRoute.setParamMap({ id: expectedHunt.hunt._id });
    expect(component.completeHunt).toEqual(expectedHunt);
  });

  it('should have `null` for the hunt for a bad ID', () => {
    activatedRoute.setParamMap({ id: 'badID' });
    expect(component.completeHunt).toBeNull();
  });

  it('should set error data on observable error', () => {
    activatedRoute.setParamMap({ id: chrisId });

    const mockError = { message: 'Test Error', error: { title: 'Error Title' } };
    const getHuntSpy = spyOn(mockHostService, 'getHuntById')
      .and
      .returnValue(throwError(() => mockError));

    component.ngOnInit();

    expect(component.error).toEqual({
      help: 'There was a problem loading the hunt – try again.',
      httpResponse: mockError.message,
      message: mockError.error.title,
    });
    expect(getHuntSpy).toHaveBeenCalledWith(chrisId);
  });
});

describe('DeleteHunt()', () => {
  let component: HuntProfileComponent;
  let fixture: ComponentFixture<HuntProfileComponent>;
  let hostService: HostService;
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
      providers: [HostService]
    }).compileComponents();

    fixture = TestBed.createComponent(HuntProfileComponent);
    component = fixture.componentInstance;
    hostService = TestBed.inject(HostService);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
  });

  it('should call deleteHunt on HuntService when deleteHunt is called in HuntProfileComponent', () => {
    const deleteHuntSpy = spyOn(hostService, 'deleteHunt').and.callThrough();
    component.deleteHunt(fryId);
    expect(deleteHuntSpy).toHaveBeenCalledWith(fryId);
  });

  it('should delete a hunt and navigate to /hosts', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const deleteHuntSpy = spyOn(hostService, 'deleteHunt').and.returnValue(of(null));

    component.deleteHunt('testId');

    expect(deleteHuntSpy).toHaveBeenCalledWith('testId');
    expect(navigateSpy).toHaveBeenCalledWith(['/hosts']);
  });

  it('should call deleteTask on HuntService when deleteTask is called in HuntProfileComponent', () => {
    const deleteTaskSpy = spyOn(hostService, 'deleteTask').and.callThrough();
    component.deleteTask(fryId);
    expect(deleteTaskSpy).toHaveBeenCalledWith(fryId);
  });

  it('should open delete hunt dialog and delete hunt on confirmation', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of('confirm'), close: null });
    spyOn(component.dialog, 'open').and.returnValue(dialogRefSpyObj);
    const deleteHuntSpy = spyOn(component, 'deleteHunt');

    component.openDeleteHuntDialog('testHuntId');

    expect(component.dialog.open).toHaveBeenCalled();
    expect(deleteHuntSpy).toHaveBeenCalledWith('testHuntId');
  });

  it('should open delete task dialog and delete task on confirmation', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of('confirm'), close: null });
    spyOn(component.dialog, 'open').and.returnValue(dialogRefSpyObj);
    const deleteTaskSpy = spyOn(component, 'deleteTask');

    component.openDeleteTaskDialog('testTaskId');

    expect(component.dialog.open).toHaveBeenCalled();
    expect(deleteTaskSpy).toHaveBeenCalledWith('testTaskId');
  });
});


