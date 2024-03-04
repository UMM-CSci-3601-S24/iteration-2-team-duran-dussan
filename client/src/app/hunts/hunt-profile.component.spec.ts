import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { throwError } from 'rxjs';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { MockHostService } from '../../testing/host.service.mock';
import { HuntCardComponent } from './hunt-card.component';
import { HuntProfileComponent } from './hunt-profile.component';
import { HostService } from '../hosts/host.service';
import { CompleteHunt } from './completeHunt';

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
        RouterTestingModule,
        MatCardModule,
        HuntProfileComponent, HuntCardComponent
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
