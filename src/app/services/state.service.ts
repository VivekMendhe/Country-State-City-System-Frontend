import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { State } from '../types/state-type';
import { Country } from '../types/country-type';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private baseUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) {}

  getAllStates(): Observable<State[]> {
    return this.httpClient.get<State[]>(`${this.baseUrl}`);
  }

  getStateById(id: number): Observable<State> {
    return this.httpClient.get<State>(`${this.baseUrl}/${id}`);
  }

  createState(state: State): Observable<State> {
    return this.httpClient.post<State>(`${this.baseUrl}`, state);
  }

  updateState(id: number, state: State): Observable<State> {
    return this.httpClient.put<State>(`${this.baseUrl}/${id}`, state);
  }

  // deleteState(id: number): Observable<void> {
  //   return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  // }

  /*deleteState(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        if (error.status === 403) {
          alert('Cannot delete state with associated cities.');
        }
        return throwError(() => new Error(error.message));
      })
    );
  }*/

  deleteState(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.baseUrl}/${id}`, { responseType: 'text' as 'json' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Error deleting state';
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

  getAllCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(
      'http://localhost:8080/api/countries'
    );
  }

  getCityCountByStateName(stateName: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count/${stateName}`);
  }
}
