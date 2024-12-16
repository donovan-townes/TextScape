import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
    postDetail: any = {}; // or use a specific type (if i knew it)
    currentUser: any;
    following: any[] = [];

    constructor(private postService: PostService,
                private route: ActivatedRoute,
                public authService: AuthService
      ) {}

    ngOnInit(): void {
      console.log("Fetching POST DETAILS: ")
      this.currentUser = this.authService.getUser();
      // Get the ID from the route
      const postIdstr = this.route.snapshot.paramMap.get('id'); // + shortcut - converts string to an integer
      if (!postIdstr) {
        console.error('Post ID not provided');
        return;
      }
      const postId = +postIdstr
      this.fetchFollowers();
      // Fetch post details using ID
      this.postService.getPostDetail(postId).subscribe(
        (data) => {
          console.log("POST DETAILS: ", data);
          this.postDetail = data;
        },
        (error) => {
          console.error(`Error fetching post-details: `, error);
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
  
    isFollowing(user: any): boolean {
      if (!this.currentUser.username || !this.following) {
        return false;
      }
      return this.following.some(follower => follower.username === user);
    }

    followOrUnfollowUser(post: any): void {
      this.postService.followUser(post).subscribe(
        (data) => {
          console.log('(Un)Follow operation successful:', data);
          this.ngOnInit();
      },
        (error) => {
          console.error('There was an error following the user:', error);
        }
      );
    }

    fetchFollowers(): void {
      this.postService.followers(this.currentUser?.username).subscribe(
        (data) => {
          // console.log('Followers fetched successfully:', data);
          this.following = data;
        },
        (error) => {
          console.error('Error fetching followers:', error);
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
