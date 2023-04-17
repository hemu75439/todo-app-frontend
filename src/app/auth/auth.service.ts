import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";
import { environment } from "src/environments/environment";

const USER_URL = environment.api + "api/users/";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private token: string;
  tokenTimer: any = null;
  private userId: string;

  private authStatusListener = new Subject<boolean>();
  private authStatus = false;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAuthStatus() {
    return this.authStatus;
  }

  createUser(authData: AuthData) {
    this.http.post(USER_URL + "signup", authData).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(["/"]);
      },
      (err) => {
        console.log(err);
        this.authStatusListener.next(false);
      }
    );
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();

    if (authInfo) {
      let expiresIn = authInfo.expirationDate.getTime() - new Date().getTime();

      if (expiresIn > 0) {
        this.token = authInfo.token;
        this.authStatus = true;

        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, expiresIn);

        this.authStatusListener.next(true);
      }
    }
  }

  login(authData: AuthData) {
    this.http
      .post<{
        status: {};
        data: { token: string; expiresIn: number; userId: string };
      }>(USER_URL + "login", authData)
      .subscribe(
        (res) => {
          this.token = res.data.token;
          if (this.token) {
            const expiresIn = res.data.expiresIn;

            let now = new Date();
            let expirationDate = new Date(now.getTime() + expiresIn * 1000);

            this.userId = res.data.userId;

            this.saveAuthData(this.token, expirationDate, this.userId);
            this.tokenTimer = setTimeout(() => {
              this.logout();
            }, expiresIn * 1000);

            this.authStatusListener.next(true);
            this.authStatus = true;
            this.router.navigate(["/"]);
          }
        },
        (err) => {
          console.log(err);
          this.authStatusListener.next(false);
        }
      );
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.authStatus = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    const authInfo = {
      token: token,
      expirationDate: expirationDate.toISOString(),
      userId: userId,
    };

    localStorage.setItem("todo-app-auth-info", JSON.stringify(authInfo));
  }

  private clearAuthData() {
    localStorage.removeItem("todo-app-auth-info");
  }

  private getAuthData() {
    if (localStorage.getItem("todo-app-auth-info")) {
      const authInfo = JSON.parse(localStorage.getItem("todo-app-auth-info"));
      authInfo.expirationDate = new Date(authInfo.expirationDate);

      return authInfo;
    }
  }
}
