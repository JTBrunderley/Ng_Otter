import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IssObject} from '../models/iss-object.model';
import {Tweet} from '../models/tweet.model';

@Injectable()
export class RestService {
  constructor(private http: HttpClient) {

  }
  getIss(): Observable<IssObject> {
    return this.http.get<IssObject>(`https://api.wheretheiss.at/v1/satellites/25544`);
  }
  getPlace(lat: number, lon: number): Observable<any> {
    return this.http.get<any>(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
  }
 getTweets(lat: number, lon: number): Observable<Tweet[]> {
   return this.http.get<any>(`https://ng-otter.herokuapp.com/otter-api/tweets?lat=${lat}&lon=${lon}`);
 }
}



