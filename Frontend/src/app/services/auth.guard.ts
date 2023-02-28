import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../model/User';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    currentUser: User;
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.currentUser = JSON.parse(localStorage.getItem("user"))

        if (this.currentUser) {
            return true;
        }

        this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}