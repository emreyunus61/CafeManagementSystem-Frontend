import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private roter:Router) { }

  isAuthenticated(): boolean {
    const token= localStorage.getItem('token');
    if(!token){
      this.roter.navigate(['/']);
      return false;
    }else{
      return true;
    }
  }
  
}
