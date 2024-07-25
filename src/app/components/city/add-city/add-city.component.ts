import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { City } from '../../../types/city-type';
import { State } from '../../../types/state-type';
import { CityService } from '../../../services/city.service';
import { StateService } from '../../../services/state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Country } from '../../../types/country-type';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-add-city',
  standalone: true,
  imports: [FormsModule, MatTooltipModule],
  templateUrl: './add-city.component.html',
  styleUrl: './add-city.component.css',
})
export class AddCityComponent {
  city: City = {
    id: 0,
    city: '',
    stateId: 0,
  };
  states: State[] = [];
  filteredStates: State[] = [];
  countries: Country[] = [];
  selectedCountryId: number | undefined;
  isEditMode = false;

  validationError: {
    city?: string;
    stateId?: string;
  } = {};

  constructor(
    private cityService: CityService,
    private stateService: StateService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.stateService.getAllStates().subscribe((data: State[]) => {
      this.states = data;
      this.filteredStates = this.states;
      if (this.city.stateId) {
        this.updateSelectedCountry();
      }
    });

    this.stateService.getAllCountries().subscribe((data: Country[]) => {
      this.countries = data;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.cityService.getCityById(+id).subscribe((data: City) => {
        this.city = data;
        this.selectedCountryId = this.states.find(
          (state) => state.id === this.city.stateId
        )?.countryId;
        this.filterStatesByCountry(this.selectedCountryId);
      });
    }
  }

  saveCity(): void {
    this.validationError = {};
    let hasError = false;

    if (!this.city.city) {
      this.validationError.city = 'City name is required';
      hasError = true;
    }
    if (!this.city.stateId) {
      this.validationError.stateId = 'State selection is required';
      hasError = true;
    }

    if (hasError) return;

    if (this.isEditMode) {
      this.cityService.updateCity(this.city.id!, this.city).subscribe(() => {
        this.snackBarService.openSnackBar('City updated successfully');
        this.router.navigate(['/cities']);
      });
    } else {
      this.cityService.createCity(this.city).subscribe(() => {
        this.snackBarService.openSnackBar('City created successfully');
        this.router.navigate(['/cities']);
      });
    }
  }

  onCountryChange(event: Event): void {
    const selectedCountryId = +(event.target as HTMLSelectElement).value;
    this.filterStatesByCountry(selectedCountryId);
  }

  onStateChange(event: Event): void {
    const selectedStateId = +(event.target as HTMLSelectElement).value;
    const selectedState = this.states.find(
      (state) => state.id === selectedStateId
    );
    if (selectedState) {
      this.selectedCountryId = selectedState.countryId;
    }
  }

  filterStatesByCountry(countryId: number | undefined): void {
    if (countryId) {
      this.filteredStates = this.states.filter(
        (state) => state.countryId === countryId
      );
    } else {
      this.filteredStates = this.states;
    }
  }

  updateSelectedCountry(): void {
    const state = this.states.find((state) => state.id === this.city.stateId);
    if (state) {
      this.selectedCountryId = state.countryId;
    }
  }
}
