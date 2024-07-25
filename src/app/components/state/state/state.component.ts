import { Component } from '@angular/core';
import { State } from '../../../types/state-type';
import { StateService } from '../../../services/state.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Country } from '../../../types/country-type';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-state',
  standalone: true,
  imports: [RouterLink, CommonModule, MatTooltipModule],
  templateUrl: './state.component.html',
  styleUrl: './state.component.css',
})
export class StateComponent {
  states: State[] = [];
  countries: Country[] = [];
  countryMap: Map<number, string> = new Map();
  counts: Map<string, number> = new Map();
  selectedCountryId: number | undefined;
  selectedStateId: number | undefined;

  constructor(
    private stateService: StateService,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.route.queryParams.subscribe((params) => {
      this.selectedStateId = +params['stateId'];
      this.selectedCountryId = +params['countryId'];
    });
  }

  getData() {
    this.stateService.getAllStates().subscribe((data: State[]) => {
      this.states = data;
      this.states.forEach((state) => {
        this.stateService
          .getCityCountByStateName(state.state)
          .subscribe((count) => {
            this.counts.set(state.state, count);
          });
      });
    });

    this.stateService.getAllCountries().subscribe((data: Country[]) => {
      this.countries = data;
      this.countryMap = new Map(
        this.countries.map((country) => [country.id, country.country])
      );
    });
  }

  deleteState(id: number): void {
    if (confirm('Are you sure you want to delete this state?')) {
      this.stateService.deleteState(id).subscribe({
        next: () => {
          this.snackBarService.openSnackBar('State deleted successfully!');
          this.getData();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
        error: (err: Error) => {
          this.snackBarService.openSnackBar(err.message);
        },
      });
    }
  }

  getCountryName(countryId: number): string {
    return this.countryMap.get(countryId) || 'Country';
  }

  getCityCount(stateName: string): number {
    return this.counts.get(stateName) || 0;
  }
}
