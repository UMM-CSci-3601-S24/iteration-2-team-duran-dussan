import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { Hunt } from './hunt';
import { HuntCardComponent } from './hunt-card.component';
import { HuntService } from './hunt.service';
import { MockHuntService } from 'src/testing/hunt.service.mock';

const COMMON_IMPORTS: unknown[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  MatSnackBarModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('Hunt card', () => {

  let huntCard: HuntCardComponent;
  let fixture: ComponentFixture<HuntCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [COMMON_IMPORTS, HuntCardComponent],

    providers: [{ provide: HuntService, useValue: new MockHuntService() }]
});
  });

  beforeEach(waitForAsync(() => {

    TestBed.compileComponents().then(() => {

      fixture = TestBed.createComponent(HuntCardComponent);
      huntCard = fixture.componentInstance;

      fixture.detectChanges();
    });
  }));

  it('contains all the hunts', () => {
    expect(huntCard.serverFilteredHunts.length).toBe(3);
  });

  it('contains a hunt named \'Anns Hunt\'', () => {
    expect(huntCard.serverFilteredHunts.some((hunt: Hunt) => hunt.name === 'Anns Hunt')).toBe(true);
  });

  it('contain a hunt named \'Frans Hunt\'', () => {
    expect(huntCard.serverFilteredHunts.some((hunt: Hunt) => hunt.name === 'Frans Hunt')).toBe(true);
  });

  it('doesn\'t contain a hunt named \'Carls Hunt\'', () => {
    expect(huntCard.serverFilteredHunts.some((hunt: Hunt) => hunt.name === 'Carls Hunt')).toBe(false);
  });

  it('has one hunt with 13 tasks', () => {
    expect(huntCard.serverFilteredHunts.filter((hunt: Hunt) => hunt.numberOfTasks === 13).length).toBe(1);
  });
  it('has one hunt with an est of 45', () => {
    expect(huntCard.serverFilteredHunts.filter((hunt: Hunt) => hunt.est === 45).length).toBe(1);
  });
});

describe('Misbehaving Hunt Card', () => {
  let huntCard: HuntCardComponent;
  let fixture: ComponentFixture<HuntCardComponent>;

  let huntServiceStub: {
    getHunts: () => Observable<Hunt[]>;
  };

  beforeEach(() => {

    huntServiceStub = {
      getHunts: () => new Observable(observer => {
        observer.error('getHunts() Observer generates an error');
      }),
    };

    TestBed.configureTestingModule({
    imports: [COMMON_IMPORTS, HuntCardComponent],

    providers: [{ provide: HuntService, useValue: huntServiceStub }]
});
  });


  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(HuntCardComponent);
      huntCard = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a HuntCardService', () => {
    const mockedMethod = spyOn(huntCard, 'getHuntsFromServer').and.callThrough();

    expect(huntCard.serverFilteredHunts)
      .withContext('service can\'t give values to the card if it\'s not there')
      .toBeUndefined();
    expect(huntCard.getHuntsFromServer)
      .withContext('will generate the right error if we try to getHuntsFromServer')
      .toThrow();
    expect(mockedMethod)
      .withContext('will be called')
      .toHaveBeenCalled();
    expect(huntCard.errMsg)
      .withContext('the error message will be')
      .toContain('Problem contacting the server – Error Code:');
      console.log(huntCard.errMsg);
  });
});
