import { Injectable } from '@angular/core';
import {Post} from "./post.model";
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from "@angular/common/http";
import {map, catchError, tap} from "rxjs/operators";
import {Subject, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  errorProperty = new Subject<string>();

  constructor(private http: HttpClient) { }

  createAndStorePosts(title: string, content: string) {
    const post: Post = {title: title, content: content};
    this.http
      .post<{name: string}>('https://ng-complete-guide-41326-default-rtdb.firebaseio.com/posts.json', post,
        {
          // observe: 'body'
          observe: 'response'
        }
        )
      .subscribe(
        responseData => {
        console.log(responseData);
      },
      error => {
          this.errorProperty.next(error);
      });
  }

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key'); // nic nie robi, ot taki example

    return this.http
      .get<{[key: string]: Post}>('https://ng-complete-guide-41326-default-rtdb.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({"Custom-Header": 'HELLLLLLOOOOOOOOOOOOOO'}),
          // params: new HttpParams().set('print', 'pretty')
          params: searchParams,
          responseType: 'json' // ale nie text, bo przekazujemy obiekt a nie string
        })
      .pipe(
        map((responseData) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({...responseData[key], id: key})
            }
          }
          return postArray;
        }),
        catchError(errorRes => {
          // send to analytics server
          return throwError(errorRes);
        })
      );
  }

  deletePosts() {
    return this.http.delete('https://ng-complete-guide-41326-default-rtdb.firebaseio.com/posts.json',
      {
        observe: 'events',
        responseType: 'text' // json, blob, itp
      })
      .pipe(tap(event => {
        console.log(event);
        if (event.type === HttpEventType.Response) {
          // Response ma 4, Sent ma 0
          console.log(event.body);
        }
      }));
  }


}
