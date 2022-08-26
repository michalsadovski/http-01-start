import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from "rxjs/operators";
import {Post} from "./post.model";
import {PostService} from "./post.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  constructor(
    private http: HttpClient,
    private postService: PostService) {}

  ngOnInit() {
    this.errorSub = this.postService.errorProperty.subscribe(errorMessage => {
      console.log(errorMessage);
      this.error = errorMessage;
    });

    // this.isFetching = true;
    // this.fetchPosts();
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  onCreatePost(postData: Post) {
    this.postService.createAndStorePosts(postData.title, postData.content);
  }

  onFetchPosts() {
    this.fetchPosts();
  }

  onClearPosts() {
    this.postService.deletePosts().subscribe(() => {
        this.loadedPosts = []
      });
  }

  private fetchPosts() {
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(
      posts => {
        console.log(posts);
      this.isFetching = false;
      this.loadedPosts = posts;
    },
      error => {
        console.log(error);
        this.isFetching = false;
        this.error = error;

    });
  }

  onHandleError() {
    this.error = null;
  }
}
