import { Component } from '@angular/core';
import { CountryComponent } from '../country/country/country.component';
import { MatSidenavModule } from '@angular/material/sidenav';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CountryComponent, MatSidenavModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
