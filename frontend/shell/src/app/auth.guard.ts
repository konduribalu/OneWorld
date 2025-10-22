import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // TEMPORARY: Disable auth to fix issues
    // TODO: Re-enable after user-mfe is properly integrated
    return true;
    
    /* Original auth code - commented out for now
    const userMfe = (window as any).userMfe;
    let isLoggedIn = false;
    
    if (userMfe && typeof userMfe.isLoggedIn === 'function') {
      isLoggedIn = userMfe.isLoggedIn();
    } else {
      isLoggedIn = !!localStorage.getItem('userToken');
    }
    
    if (!isLoggedIn) {
      console.log('User not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
    
    console.log('User is logged in');
    return true;
    */
  }
}
