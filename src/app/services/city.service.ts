import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { City } from '../types/city-type';
import { State } from '../types/state-type';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private baseUrl = 'http://localhost:8080/api/cities';

  constructor(private httpClient: HttpClient) {}

  getAllCities(): Observable<City[]> {
    return this.httpClient.get<City[]>(`${this.baseUrl}`);
  }

  getCityById(id: number): Observable<City> {
    return this.httpClient.get<City>(`${this.baseUrl}/${id}`);
  }

  createCity(city: City): Observable<City> {
    return this.httpClient.post<City>(`${this.baseUrl}`, city);
  }

  updateCity(id: number, city: City): Observable<City> {
    return this.httpClient.put<City>(`${this.baseUrl}/${id}`, city);
  }

  deleteCity(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  /*deleteCity(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        if (error.status === 403) {
          alert('Cannot delete state with associated cities.');
        }
        return throwError(() => new Error(error.message));
      })
    );
  }*/

  getAllStates(): Observable<State[]> {
    return this.httpClient.get<State[]>('http://localhost:8080/api/states');
  }
}
