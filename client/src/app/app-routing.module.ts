import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HostProfileComponent } from './hosts/host-profile.component';
import { HuntProfileComponent } from './hunts/hunt-profile.component';
import { HuntCardComponent } from './hunts/hunt-card.component';
import { AddHuntComponent } from './hunts/addHunt/add-hunt.component';

// Note that the 'users/new' route needs to come before 'users/:id'.
// If 'users/:id' came first, it would accidentally catch requests to
// 'users/new'; the router would just think that the string 'new' is a user ID.
const routes: Routes = [
  {path: '', component: HomeComponent, title: 'Home'},
  {path: 'hosts', component: HostProfileComponent, title: 'Host Profile'},
  {path: 'hunts/new', component: AddHuntComponent, title: 'Add Hunt'},
  {path: 'hunts/:id', component: HuntProfileComponent, title: 'Hunts Profile'},
  {path: 'hunts', component: HuntCardComponent, title: 'Hunts'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
