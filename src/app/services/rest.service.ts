import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DisplayObj} from '../models/displayObj.model';
import {PositionObj} from '../models/position.model';

@Injectable()
export class RestService {
  constructor(private http: HttpClient) {

  }

 getDisplay(): Observable<DisplayObj> {
   return this.http.get<any>(`https://ng-otter.herokuapp.com/otter-api/display`);
 }
 getPosition(): Observable<PositionObj> {
   return this.http.get<any>(`https://ng-otter.herokuapp.com/otter-api/position`);
 }
}
