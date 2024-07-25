import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Country } from '../types/country-type';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private baseUrl = 'http://localhost:8080/api/countries';

  constructor(private httpClient: HttpClient) {}

  getAllCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(`${this.baseUrl}`);
  }

  getCountryById(id: number): Observable<Country> {
    return this.httpClient.get<Country>(`${this.baseUrl}/${id}`);
  }

  createCountry(country: Country): Observable<Country> {
    return this.httpClient.post<Country>(`${this.baseUrl}`, country);
  }

  updateCountry(id: number, country: Country): Observable<Country> {
    return this.httpClient.put<Country>(`${this.baseUrl}/${id}`, country);
  }

  // deleteCountry(id: number): Observable<void> {
  //   return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  // }

  /*deleteCountry(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        if (error.status === 403) {
          alert('Cannot delete country with associated states:' + error.error);
        }
        return throwError(() => new Error(error.message));
      })
    );
  }*/

  deleteCountry(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.baseUrl}/${id}`, { responseType: 'text' as 'json' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Error deleting country';
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // Server-side error
            try {
              const errorObj = JSON.parse(error.error);
              errorMessage = errorObj.message || errorObj;
            } catch {
              errorMessage = error.error || errorMessage;
            }
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /*deleteCountry(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          const errorMsg = error.error?.associatedStates
            ? `Cannot delete country. The following states are associated: ${error.error.associatedStates.join(
                ', '
              )}`
            : 'Cannot delete country due to associated states.';
          alert(errorMsg);
        } else {
          alert(`Error while deleting country: ${error.message}`);
        }
        return throwError(() => new Error(error.message));
      })
    );
  }*/

  countStatesByCountryName(countryName: string): Observable<number> {
    return this.httpClient.get<number>(
      `${this.baseUrl}/countStates?countryName=${countryName}`
    );
  }
}
