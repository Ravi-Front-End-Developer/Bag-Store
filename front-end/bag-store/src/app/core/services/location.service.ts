import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}
  // Create reusable headers
  private httpOptions = {
    headers: new HttpHeaders({
      'X-CSCAPI-KEY':
        environment.locationAPIkey,
    }),
  };
  getCountries() {
    return this.http.get(
      environment.locationBaseURL,
      this.httpOptions
    );
  }

  getStates(countryId: string) {
    return this.http.get(
      `${environment.locationBaseURL}/${countryId}/states`,
      this.httpOptions
    );
  }

  getCities(countryId: string, stateId: string) {
    return this.http.get(
      `${environment.locationBaseURL}/${countryId}/states/${stateId}/cities`,
      this.httpOptions
    );
  }

}
