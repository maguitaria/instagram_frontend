import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(
    public jwtHelper: JwtHelperService,
    private cookieService: CookieService,
  ) { }

  public isAuthenticated(): boolean {
    const token = this.cookieService.get('token');
    // console.log(token);
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

}
