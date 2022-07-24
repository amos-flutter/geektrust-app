import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private readonly http: HttpClient) { }

  /**Method to call GET api */
  get(url): any {
    return this.http.get(`${url}`, {
      headers: new HttpHeaders({ 'Access-Control-Allow-Methods': 'GET' })
    });
  }
}
