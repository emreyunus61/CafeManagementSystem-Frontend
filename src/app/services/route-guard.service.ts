import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { jwtDecode } from 'jwt-decode';
import { GlobalConstans } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(private auth:AuthService,
    private router: Router,
    private snackbarService: SnackbarService) { }

    canActivate(route: ActivatedRouteSnapshot): boolean{

      //expectedRoleArray` değişkeni,erişim izni için beklenen rolleri içerir.
      let expectedRoleArray=route.data;
      expectedRoleArray=expectedRoleArray.expectedRole;
      // - Kullanıcının oturum açmış olup olmadığını belirlemek için `localStorage`'dan token alınır.
      const token:any = localStorage.getItem('token');

      var tokenPayload:any;

      try{
        tokenPayload= jwtDecode(token);
      }
      catch(err){
        localStorage.clear();
        this.router.navigate(['/']);
      }

      let expectedRole = '';

      //eklenen rollerden biriyle eşleşiyorsa, `expectedRole` değişkenine atanır.
      for(let i=0; i<expectedRoleArray.length;i++){
        if(expectedRoleArray[i] == tokenPayload.role){
          expectedRole=tokenPayload.role;
        }
      }

      if(tokenPayload.role == 'user' || tokenPayload.role == 'admin'){
        if(this.auth.isAuthenticated() && tokenPayload.role == expectedRole){
          return true;
        }
        this.snackbarService.openSnackBar(GlobalConstans.unauthroized,GlobalConstans.error);
        this.router.navigate(['/cafe/dashboard']);
        return false;
      }
      else{
        this.router.navigate(['/']);
        localStorage.clear();
        return false;
      }

    }
}
