import { Component } from '@angular/core';
import { Country } from '../../../types/country-type';
import { CountryService } from '../../../services/country.service';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StateService } from '../../../services/state.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [RouterLink, MatTooltipModule, MatSnackBarModule],
  templateUrl: './country.component.html',
  styleUrl: './country.component.css',
})
export class CountryComponent {
  countries: Country[] = [];
  stateCounts: { [key: number]: number } = {};

  constructor(
    private countryService: CountryService,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.countryService.getAllCountries().subscribe((data: Country[]) => {
      this.countries = data;
      this.loadStateCounts();
    });
  }

  loadStateCounts(): void {
    this.countries.forEach((country) => {
      this.countryService
        .countStatesByCountryName(country.country)
        .subscribe((count) => {
          this.stateCounts[country.id] = count;
        });
    });
  }

  deleteCountry(id: number): void {
    if (confirm('Are you sure you want to delete this country?')) {
      this.countryService.deleteCountry(id).subscribe({
        next: () => {
          this.snackBarService.openSnackBar('Country deleted successfully!');
          this.loadCountries();
        },
        error: (err: Error) => {
          this.snackBarService.openSnackBar(err.message);
        },
      });
    }
  }

  /*deleteCountry(id: number): void {
    if (confirm('Are you sure you want to delete this country?')) {
      this.countryService.deleteCountry(id).subscribe({
        next: () => {
          this.countries = this.countries.filter(
            (country) => country.id !== id
          );
        },
        error: (err) => {
          console.log('Error while deleting country', err);
        },
      });
    }
    this.openSnackBar('Country deleted successfully');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }*/

  /*deleteCountry(id: number): void {
    if (confirm('Are you sure you want to delete this country?')) {
      this.countryService.deleteCountry(id).subscribe({
        next: () => {
          this.countries = this.countries.filter(
            (country) => country.id !== id
          );
        },
        error: (err) => {
          if (err.status === 403 && err.error?.associatedStates) {
            const stateNames = err.error.associatedStates.join(', ');
            alert(
              `Cannot delete country. The following states are associated: ${stateNames}`
            );
          } else {
            console.log('Error while deleting country', err);
          }
        },
      });
    }
  }*/
}
