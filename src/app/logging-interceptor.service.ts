import { Injectable } from '@angular/core';
import {HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LoggingInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Ongoing request!');
    console.log(req.url);
    console.log(req.headers);
    return next.handle(req).pipe(tap(event => {
      console.log(event);
      if (event.type === HttpEventType.Response) {
        // Response ma 4, Sent ma 0
        console.log('Incoming response');
        console.log(event.body);
      }
    }));
  }

  constructor() { }
}
