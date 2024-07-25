import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    MatSnackBarModule,
    MatSidenavModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'country-system';

  @ViewChild('sidenav') sidenav!: MatSidenav;

  isBrowser: boolean;

  options = this.formBuilder.group({
    bottom: 0,
    fixed: true,
    top: 0,
  });

  constructor(
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      const savedState = localStorage.getItem('sidenavOpened');
      if (savedState !== null) {
        const isOpened = JSON.parse(savedState);
        if (isOpened) {
          this.sidenav.open();
        } else {
          this.sidenav.close();
        }
      }
    }
  }

  toggleSidenav() {
    this.sidenav.toggle().then(() => {
      if (this.isBrowser) {
        localStorage.setItem(
          'sidenavOpened',
          JSON.stringify(this.sidenav.opened)
        );
      }
    });
  }
}
