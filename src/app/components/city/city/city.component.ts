import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { City } from '../../../types/city-type';
import { CityService } from '../../../services/city.service';
import { State } from '../../../types/state-type';
import { StateService } from '../../../services/state.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-city',
  standalone: true,
  imports: [RouterLink, CommonModule, MatTooltipModule],
  templateUrl: './city.component.html',
  styleUrl: './city.component.css',
})
export class CityComponent {
  cities: City[] = [];
  states: State[] = [];
  stateMap: Map<number, string> = new Map();
  selectedStateId: number | undefined;

  constructor(
    private cityService: CityService,
    private stateService: StateService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.getCity();

    this.route.queryParams.subscribe((params) => {
      this.selectedStateId = +params['stateId'];
    });
  }

  getCity() {
    this.cityService.getAllCities().subscribe((data: City[]) => {
      this.cities = data;
    });

    this.stateService.getAllStates().subscribe((data: State[]) => {
      this.states = data;
      this.stateMap = new Map(
        this.states
          .filter((state) => state.id !== undefined)
          .map((state) => [state.id as number, state.state])
      );
    });
  }

  getReload() {
    window.location.reload();
  }

  deleteCity(id: number): void {
    if (confirm('Are you sure you want to delete this City?')) {
      this.cityService.deleteCity(id).subscribe(() => {
        this.cities = this.cities.filter((city) => city.id !== id);
        this.snackBarService.openSnackBar('City deleted successfully');
        this.getCity();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }

  /*deleteCity(id: number): void {
    if (confirm('Are you sure you want to delete this city?')) {
      this.cityService.deleteCity(id).subscribe({
        next: () => {
          this.cities = this.cities.filter((city) => city.id !== id);
          this.snackBarService.openSnackBar('City deleted successfully!');
          this.getCity();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }*/

  /* deleteCity(id: number): void {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this City?'
    );

    if (confirmDelete) {
      this.cityService.deleteCity(id).subscribe(
        () => {
          this.cities = this.cities.filter((city) => city.id !== id);
        },
        (error) => {
          console.error('Error deleting Country:', error);
        }
      );
    }
  }*/

  /*deleteCity(id: number): void {
    if (confirm('Are you sure you want to delete this city?')) {
      this.cityService.deleteCity(id).subscribe({
        next: () => {
          this.cities = this.cities.filter((city) => city.id !== id);
        },
        error: (err) => {
          alert('Error while deleting the city: ' + err.message);
          alert(err.error)  ;
          console.error('Error deleting city:', err);
        },
      });
    }
  }*/

  getStateName(stateId: number): string {
    return this.stateMap.get(stateId) || 'Unknown';
  }
}
