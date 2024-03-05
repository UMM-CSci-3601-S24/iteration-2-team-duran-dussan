import { Component, input, } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { Hunt } from './hunt';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-hunt-card',
    templateUrl: './hunt-card.component.html',
    styleUrls: ['./hunt-card.component.scss'],
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule, MatIconModule, RouterLink]
})
export class HuntCardComponent {

  hunt = input.required<Hunt>();
  simple = input(true);
}


