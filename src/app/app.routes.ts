import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CityComponent } from './components/city/city/city.component';
import { AddCityComponent } from './components/city/add-city/add-city.component';
import { StateComponent } from './components/state/state/state.component';
import { AddStateComponent } from './components/state/add-state/add-state.component';
import { CountryComponent } from './components/country/country/country.component';
import { AddCountryComponent } from './components/country/add-country/add-country.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cities', component: CityComponent },
  { path: 'cities/new', component: AddCityComponent },
  { path: 'cities/:id/edit', component: AddCityComponent },
  { path: 'states', component: StateComponent },
  { path: 'states/new', component: AddStateComponent },
  { path: 'states/:id/edit', component: AddStateComponent },
  { path: 'countries', component: CountryComponent },
  { path: 'countries/new', component: AddCountryComponent },
  { path: 'countries/:id/edit', component: AddCountryComponent },
  { path: '**', redirectTo: '' },
];
