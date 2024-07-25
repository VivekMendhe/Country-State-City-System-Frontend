import { Component } from '@angular/core';
import { State } from '../../../types/state-type';
import { Country } from '../../../types/country-type';
import { StateService } from '../../../services/state.service';
import { CountryService } from '../../../services/country.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-add-state',
  standalone: true,
  imports: [FormsModule, CommonModule, MatTooltipModule],
  templateUrl: './add-state.component.html',
  styleUrl: './add-state.component.css',
})
export class AddStateComponent {
  state: State = {
    id: 0,
    state: '',
    population: '',
    countryId: 0,
  };
  countries: Country[] = [];
  isEditMode = false;

  validationError: {
    state?: string;
    population?: string;
  } = {};

  constructor(
    private stateService: StateService,
    private countryService: CountryService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.countryService.getAllCountries().subscribe((data: Country[]) => {
      this.countries = data;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.stateService.getStateById(+id).subscribe((data: State) => {
        this.state = data;
      });
    }
  }

  saveState(): void {
    this.validationError = {};
    let hasError = false;

    if (!this.state.state) {
      this.validationError.state = 'State name is required';
      hasError = true;
    }
    if (!this.state.population) {
      this.validationError.population = 'Population is required';
      hasError = true;
    }

    if (hasError) return;

    if (this.isEditMode) {
      this.stateService
        .updateState(this.state.id!, this.state)
        .subscribe(() => {
          this.snackBarService.openSnackBar('State updated successfully');
          this.router.navigate(['/states']);
        });
    } else {
      this.stateService.createState(this.state).subscribe(() => {
        this.snackBarService.openSnackBar('State created successfully');
        this.router.navigate(['/states']);
      });
    }
  }
}
