import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { HostProfileComponent } from "./host-profile.component";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HuntCardComponent } from "../hunts/hunt-card.component";
import { HostService } from "./host.service";
import { MockHostService } from "src/testing/host.service.mock";

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

describe("Hunt list", () => {

  let huntList: HostProfileComponent;
  let fixture: ComponentFixture<HostProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [COMMON_IMPORTS, HostProfileComponent, HuntCardComponent],
    providers: [{provide: HostService, useValue: new MockHostService()}]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(HostProfileComponent);
      huntList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it("contains all the hunts", () => {
    expect(huntList.serverHunts.length).toBe(3);
  });

  it("contains a hunt with name 'Anns Hunt'", () => {
    expect(huntList.serverHunts.some((hunt) => hunt.name === "Anns Hunt")).toBe(true);
  });

  it("contain a hunt with name 'Frans Hunt'", () => {
    expect(huntList.serverHunts.some((hunt) => hunt.name === "Frans Hunt")).toBe(true);
  });

  it("doesn't contain a hunt with name 'Fry's Hunt'", () => {
    expect(huntList.serverHunts.some((hunt) => hunt.name === "Fry's Hunt")).toBe(false);
  });

  it("has a hunt with name 'Anns Hunt' and hostId 'ann_hid'", () => {
    expect(huntList.serverHunts.some((hunt) => hunt.name === "Anns Hunt" && hunt.hostId === "ann_hid")).toBe(true);
  });

  it("has a hunt with description 'super exciting hunt' and est 45", () => {
    expect(huntList.serverHunts.some((hunt) => hunt.description === "super exciting hunt" && hunt.est === 45)).toBe(true);
  });

  it("has a hunt with number of tasks of 18", () => {
    expect(huntList.serverHunts.some((hunt) => hunt.numberOfTasks === 18)).toBe(true);
  });
});
