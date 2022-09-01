import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  taskpost(data: any) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      this.http.post(environment.baseURL, data, httpOptions)
        .subscribe((response) => {
          resolve(response);
        });
    })
  }

  taskget() {
    return new Promise((resolve, reject) => {
      this.http.get(environment.baseURL)
      .subscribe((res) => {
        resolve(res);
      });
    })
  }



}
