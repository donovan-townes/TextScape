import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import jwtDecode from "jwt-decode";

@Injectable({
  providedIn: "root"
})
export class AuthService {

    constructor(private router: Router) { }

    getUser(): any {
        // Get token from local storage
        const username = localStorage.getItem('username');
        if (!username) return null;
        return {username: username};
        }
    

    isLoggedIn(): boolean {
        // Simple check, but we can also verify if the token is still valid
        // by sending a request to the server and checking the response
        
        // CHECK VALIDATION API URL (localstorage token)

        return localStorage.getItem('token') ? true : false;
        
    };

    logOut() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.router.navigate(['/login']);
    };
}
