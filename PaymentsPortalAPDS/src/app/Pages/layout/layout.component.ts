import { CommonModule } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  loggedUser: any;
  isLoggedIn: boolean = false;

  constructor(private _router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.checkUserLogin();
  }

  checkUserLogin() {
    if (isPlatformBrowser(this.platformId)) {
      const localUser = localStorage.getItem('loggedUser');
      if (localUser != null) {
        this.loggedUser = JSON.parse(localUser);
        this.isLoggedIn = true;
      }
    }
  }

  onLogOut() {
    if (isPlatformBrowser(this.platformId)) { 
      localStorage.removeItem('loggedUser');
    }
    this.isLoggedIn = false;
    this._router.navigateByUrl('/login');
  }
}
