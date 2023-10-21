import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  postForm: FormGroup;
  constructor(private fb: FormBuilder,
              private postService: PostService,
              private router: Router) {

    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', [Validators.required, Validators.maxLength(120)]]
    });
  }

  ngOnInit(): void {}


  onSubmit(): void {
    if (this.postForm.valid) {
      this.postService.createPost(this.postForm.value).subscribe(
        
        (response) => {
          alert('Post Created! Redirecting to feed.');
          this.router.navigate(['/posts/feed']) // redirect to posts/feed
        },
        (error) => {
          console.error('There was an error while creating the post', error)
        }
      )
      // send data to backend
    }
    console.log(this.postForm.value)
  }
}

