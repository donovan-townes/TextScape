import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Input } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {


  postForm: FormGroup;
  isEditMode: boolean = false;
  postId: number | null = null;


  constructor(private fb: FormBuilder,
              private postService: PostService,
              private router: Router,
              private route: ActivatedRoute,
              public authService: AuthService
              ) {

    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', [Validators.required, Validators.maxLength(120)]]
    });
  }

  ngOnInit(): void {
    this.postId = this.route.snapshot.params['id'];
      

    if (this.postId) {
      this.isEditMode = true;
      this.postService.getPostDetail(this.postId).subscribe(post => {
        this.postForm.patchValue(post);
      });

      this.postForm = this.fb.group({
        title: ['', Validators.required],
        content: ['', [Validators.required, Validators.maxLength(120)]]
      });
      }  
    }  

  onSubmit(): void {
    if (this.isEditMode) {
      this.updateExistingPost();
    } else {
      this.createNewPost();
    }
  }

  createNewPost(): void {
    if (this.postForm.valid) {
      this.postService.createPost(this.postForm.value).subscribe(
        
        (response) => {
          alert('Post Created! Redirecting to feed.');
          this.router.navigate(['/posts/feed']) // redirect to posts/feed
        },
        (error) => {
          if (error.status === 401) {
            alert('You must be logged in to create a post! Redirecting to login');
            this.authService.logOut();
            this.router.navigate(['/login']);
          }
          else {
          console.error('There was an error while creating the post', error)
        }
      }
      );
    }
  }

  updateExistingPost(): void {
    if (this.postForm.valid) {
      if (!this.postId) {
        console.error('Post ID not provided');
        return;
      }
      this.postService.updatePost(this.postId, this.postForm.value).subscribe(
        (response) => {
          alert('Post Updated! Redirecting to feed.');
          this.router.navigate(['/posts/feed']) // redirect to posts/feed
        },
        (error) => {
          if (error.status === 401) {
            alert('You must be logged in to update a post! Redirecting to login');
            this.router.navigate(['/login']);
          }
          else {
          console.error('There was an error while updating the post', error)
        }
      }
     )
    }
  }

}
