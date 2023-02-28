import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { RoomComponent } from './pages/room/room.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent },
  { path: 'room', canActivate: [AuthGuard], component: RoomComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
