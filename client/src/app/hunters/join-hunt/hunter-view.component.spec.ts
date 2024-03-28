import { of, Subject, throwError } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HunterViewComponent } from './hunter-view.component';
import { HostService } from 'src/app/hosts/host.service';
import { StartedHunt } from 'src/app/startHunt/startedHunt'
import { Task } from 'src/app/hunts/task';

describe('HunterViewComponent', () => {
  let component: HunterViewComponent;
  let fixture: ComponentFixture<HunterViewComponent>;
  let mockHostService: jasmine.SpyObj<HostService>;
  let mockRoute: { paramMap: Subject<ParamMap> };
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    mockHostService = jasmine.createSpyObj('HostService', ['getStartedHunt']);
    mockRoute = {
      paramMap: new Subject<ParamMap>()
    };
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [HunterViewComponent],
      providers: [
        { provide: HostService, useValue: mockHostService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HunterViewComponent);
    component = fixture.componentInstance;

    const initialStartedHunt: StartedHunt = {
      completeHunt: {
        hunt: {
          _id: '',
          hostId: '',
          name: '',
          description: '',
          est: 0,
          numberOfTasks: 0
        },
        tasks: []
      },
      accessCode: ''
    };
    component.startedHunt = initialStartedHunt;

    fixture.detectChanges();
  });

  it('should navigate to the right hunt page by access code',() => {
    const startedHunt: StartedHunt = {
      completeHunt: {
        hunt: {
          _id: '1',
          hostId: '1',
          name: 'Hunt 1',
          description: 'Hunt 1 Description',
          est: 10,
          numberOfTasks: 1
        },
        tasks: [
          {
            _id: '1',
            huntId: '1',
            name: 'Task 1',
            status: true
          }
        ]
      },
      accessCode: '123456'
    };
    mockHostService.getStartedHunt.and.returnValue(of(startedHunt));
    // Emit a paramMap event to trigger the hunt retrieval
    mockRoute.paramMap.next({ get: () => '123456', has: () => true, getAll: () => [], keys: [] });
    component.ngOnInit();
    expect(component.startedHunt).toEqual(startedHunt);

  });

  it('should handle error when getting hunt by access code', () => {
    const error = { message: 'Error', error: { title: 'Error Title' } };
    mockHostService.getStartedHunt.and.returnValue(throwError(error));
    // Emit a paramMap event to trigger the hunt retrieval
    mockRoute.paramMap.next({ get: () => '1', has: () => true, getAll: () => [], keys: [] });
    component.ngOnInit();
    expect(component.error).toEqual({
      help: 'There is an error trying to load the tasks - Please try to run the hunt again',
      httpResponse: error.message,
      message: error.error.title,
    });
  });

  it('should handle file selected event', () => {
    const task: Task = { _id: '1', huntId: '1', name: 'Task 1', status: true };
    const event = {
      target: {
        files: [
          {
            type: 'image/png',
            result: 'data:image/png;base64,'
          }
        ]
      }
    };
    const reader = jasmine.createSpyObj('FileReader', ['readAsDataURL', 'onload']);
    spyOn(window, 'FileReader').and.returnValue(reader);

    component.onFileSelected(event, task);

    expect(reader.readAsDataURL).toHaveBeenCalledWith(event.target.files[0]);

    reader.onload({ target: { result: event.target.files[0].result } });
    expect(component.imageUrls[task._id]).toBe(event.target.files[0].result);
  });

  it('should not replace image if user choose cancel', () => {
    const task: Task = { _id: '1', huntId: '1', name: 'Task 1', status: true };
    const event = {
      target: {
        files: [
          {
            type: 'image/png',
            result: 'data:image/png;base64,'
          }
        ]
      }
    };
    const reader = jasmine.createSpyObj('FileReader', ['readAsDataURL', 'onload']);
    spyOn(window, 'FileReader').and.returnValue(reader);

    component.imageUrls[task._id] = 'data:image/png;base64,';
    spyOn(window, 'confirm').and.returnValue(false);

    component.onFileSelected(event, task);

    expect(reader.readAsDataURL).not.toHaveBeenCalled();
  });

  it('should replace image if user choose ok', () => {
    const task: Task = { _id: '1', huntId: '1', name: 'Task 1', status: true };
    const event = {
      target: {
        files: [
          {
            type: 'image/png',
            result: 'data:image/png;base64,'
          }
        ]
      }
    };
    const reader = jasmine.createSpyObj('FileReader', ['readAsDataURL', 'onload']);
    spyOn(window, 'FileReader').and.returnValue(reader);

    component.imageUrls[task._id] = 'data:image/png;base64,';
    spyOn(window, 'confirm').and.returnValue(true);

    component.onFileSelected(event, task);

    expect(reader.readAsDataURL).toHaveBeenCalledWith(event.target.files[0]);

    reader.onload({ target: { result: event.target.files[0].result } });
    expect(component.imageUrls[task._id]).toBe(event.target.files[0].result);
  });
});

