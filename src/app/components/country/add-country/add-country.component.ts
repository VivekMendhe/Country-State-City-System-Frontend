import { Component } from '@angular/core';
import { Country } from '../../../types/country-type';
import { CountryService } from '../../../services/country.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-add-country',
  standalone: true,
  imports: [FormsModule, CommonModule, MatTooltipModule],
  templateUrl: './add-country.component.html',
  styleUrl: './add-country.component.css',
})
export class AddCountryComponent {
  country: Country = { id: 0, country: '', population: '' };
  isEditMode = false;

  isValidationError: {
    country?: string;
    population?: string;
  } = {};

  constructor(
    private countryService: CountryService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.countryService.getCountryById(+id).subscribe((data: Country) => {
        this.country = data;
      });
    }
  }

  saveCountry(): void {
    this.isValidationError = {};
    let hasError = false;

    if (!this.country.country) {
      this.isValidationError.country = 'Country name is required';
      hasError = true;
    }
    if (!this.country.population) {
      this.isValidationError.population = 'Population is required';
      hasError = true;
    }

    if (hasError) {
      return;
    }

    if (this.isEditMode) {
      this.countryService
        .updateCountry(this.country.id!, this.country)
        .subscribe(() => {
          this.snackBarService.openSnackBar('Country updated successfully!');
          this.router.navigate(['/countries']);
        });
    } else {
      this.countryService.createCountry(this.country).subscribe(() => {
        this.snackBarService.openSnackBar('Country created successfully!');
        this.router.navigate(['/countries']);
      });
    }
  }
}
