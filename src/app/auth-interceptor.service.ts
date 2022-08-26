import { Injectable } from '@angular/core';
import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // console.log('Request is on its way!');
    // console.log(req.url);
    const modifiedRequest = req.clone({headers: req.headers.append('Auth', 'xyz')});
    return next.handle(modifiedRequest)
    //   .pipe(tap(event => {
    //   console.log(event);
    //   if (event.type === HttpEventType.Response) {
    //     // Response ma 4, Sent ma 0
    //     console.log('Response arrived, body data: ');
    //     console.log(event.body);
    //   }
    // }))
      ;
  }

}
