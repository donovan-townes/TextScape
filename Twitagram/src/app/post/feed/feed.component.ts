import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  posts: any[] = [];
  currentUser: any;



  constructor(private postService: PostService,
              private router: Router        ,
              public authService: AuthService  
    ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();

    this.postService.getPosts().subscribe(
      (data) => {
        this.posts = data.results.map((post: any) => {
          post.comments = post.comments || [];
          return post;
        });
      },
      (error) => {
        if (error.status === 401) {
          alert('You must be logged in to view this page.');
          this.router.navigate(['/login']);
        } else { 
          console.error('Error fetching posts:', error);
        };
        }
    );
  }

  deletePost(post: any): void {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    if (!post || !post.id) {
      console.error('Post ID not provided');
      return;
    }

    this.postService.deletePost(post.id).subscribe(
      (data) => {
        console.log('Post deleted successfully:', data);
        this.ngOnInit();
      },
      (error) => {
        console.error('Error deleting post:', error);
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

  addComment(post: any): void {
    this.postService.createComment(post.id, {content: post.newComment}).subscribe(
      (data) => {
        console.log('Comment added successfully:', data);
        post.comments.push(data); // Push the new comment to the list of comments
        post.newComment = ''; // Clear the comment box
        this.ngOnInit(); // Refresh the page
      },
      (error) => {
        console.error('Error adding comment:', error);
      }
    );
  }

}
