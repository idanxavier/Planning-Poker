import { Component } from '@angular/core';
import { User } from 'src/app/model/User';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor() {
  }

}
