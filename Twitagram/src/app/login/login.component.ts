import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user = {
    username: '',
    password: '',
  };

  constructor(private apiService: ApiService, private router: Router) {}

  onLogin() {
    this.apiService.login(this.user).subscribe(
      (data: any) => {
        console.log(data);
        localStorage.setItem('token', data.access);
        localStorage.setItem('username', data.username);
        alert('Login Successful - Redirecting to Home!');
        this.router.navigate(['/home']);
      },
      (error: any) => console.error(error)
    );
  };

  
}
