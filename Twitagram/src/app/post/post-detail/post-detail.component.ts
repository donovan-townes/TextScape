import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
    postDetail: any = {}; // or use a specific type (if i knew it)


    constructor(private postService: PostService,
                private route: ActivatedRoute
      ) {}

    ngOnInit(): void {
      console.log("Fetching POST DETAILS: ")
      // Get the ID from the route
      const postIdstr = this.route.snapshot.paramMap.get('id'); // + shortcut - converts string to an integer
      if (!postIdstr) {
        console.error('Post ID not provided');
        return;
      }
      const postId = +postIdstr
      // Fetch post details using ID
      this.postService.getPostDetail(postId).subscribe(
        (data) => {
          this.postDetail = data;
        },
        (error) => {
          console.error(`Error fetching post-details: `, error);
        }
      );
    }

}
