import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  posts: any[] = [];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPosts().subscribe(
      (data) => {
        this.posts = data.results;
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  likeOrUnlikePost(post: any): void {
    this.postService.likePost(post.id).subscribe(
      (data) => {
        console.log('(Like/Unlike) Post operation successful:', data);
        this.ngOnInit();
    },
      (error) => {
        console.error('There was an error liking the post:', error);
      }
    );
  }
}
