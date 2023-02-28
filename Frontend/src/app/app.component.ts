import { Component } from '@angular/core';
import { User } from './model/User';
import { WebsocketService } from "./services/websocket.service";
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})

export class AppComponent {
  content = '';
  sent = [];
  user: User;
  username: string;
  error = '';

  constructor(private WebsocketService: WebsocketService, private AuthenticationService: AuthenticationService, private router: Router) {
    this.AuthenticationService.userSubject.subscribe((data) => {
      this.user = data;
    })
  }

  createUser() {
    if (this.username == undefined || (this.username != undefined && this.username.length == 0)) {
      this.error = "Invalid username.";
      return
    }


    let message = {
      source: 'change-username',
      content: {
        name: this.username
      }
    };

    this.error = ''
    this.WebsocketService.messages.next(message);
  }

}