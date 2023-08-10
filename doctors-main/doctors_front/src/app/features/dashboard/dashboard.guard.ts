import {AuthService} from "../../core/auth.service";
import {ActivatedRouteSnapshot, CanActivate, convertToParamMap, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
@Injectable({providedIn: 'root'})
export class DashboardGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isAuth = this.auth.getIsAuth()
    if (isAuth) {
      return true
    } else {
      this.router.navigate(['/login']).then(r => console.log("Unauthorised"));
      return false
    }
  }
}
