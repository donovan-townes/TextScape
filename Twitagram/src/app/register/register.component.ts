import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  user = {
    username: '',
    email: '',
    password: '',
    password2: ''
  };
  
  constructor(private apiService: ApiService, private router: Router) { }
  
  onsubmit() {
    
    this.apiService.register(this.user).subscribe(
      (data: any) => {
        console.log(data);
        alert('Registration successful! Redirecting to login.');
        this.router.navigate(['/login']) // Redirect to login
      },
      (error: any) => {
        console.error(error);
        if (error.status === 400 && error.error.email) {
          alert('Error: ' + error.error.email[0]); // Example error msg
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    );
  }
}
