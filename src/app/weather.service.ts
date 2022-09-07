import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

export interface ResponseListObject {
  clouds: any;
  main: any;
  rain: any;
  weather: any;
  wind: any;
}

export interface ResponseData {
  calctime: number;
  city_id: number;
  cnt: number;
  cod: string;
  list: ResponseListObject;
}

export class Response {
  record: any;
  successCode: string;
}

@Injectable()
export class WeatherService {

  constructor(private _http: HttpClient) { }

  dailyForecast() {
    const URL = 'http://samples.openweathermap.org/data/2.5/history/city?q=Warren,OH&appid=b6907d289e10d714a6e88b30761fae22';

    return this._http.get<ResponseData>(URL)
    .pipe(map(data => {
      // We get back an array of objects
      console.log(data);
      return data;
      })
    );
  }
}
