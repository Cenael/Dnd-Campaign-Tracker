import { Component } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  user;
  showBackButton = true;

  constructor(private userService: UserService, private router: Router, public location: Location) {
    this.user = this.userService.currentUser;

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showBackButton = event.url !== '/' && event.url !== '/login';
      });
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  goBack() {
    this.location.back();
  }
}
