import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NewRoomComponent } from './pages/modal/new-room/new-room.component';
import { JoinRoomComponent } from './pages/modal/join-room/join-room.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { RoomComponent } from './pages/room/room.component';
import { WebsocketService } from './services/websocket.service';
import { AuthenticationService } from './services/authentication.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewRoomComponent,
    JoinRoomComponent,
    NavbarComponent,
    RoomComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
