import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterLink, Router } from "@angular/router";
import { HostService } from "../hosts/host.service";
import { StartedHunt } from "../startHunt/startedHunt";

@Component({
  selector: 'app-ended-hunt-card',
  templateUrl: './ended-hunt-card.component.html',
  styleUrls: ['./ended-hunt-card.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule, MatIconModule, RouterLink]
})
export class EndedHuntCardComponent {
  startedHunt = input.required<StartedHunt>();
  simple = input(true);

  constructor(private hostService: HostService, private router: Router) {}

}
