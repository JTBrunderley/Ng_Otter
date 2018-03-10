import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class HttpUtil {

    public handleError(err: HttpErrorResponse) {
        const errMsg = err.error.message ? err.error.message : err.error.toString();
        return Observable.throw(errMsg);
    }

}
