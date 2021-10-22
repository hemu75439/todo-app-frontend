import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthData } from '../auth-data.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;

  private authListenerSubs: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isLoading = isAuthenticated;
      })

  }

  onLogin(form: NgForm) {

    if(form.invalid) return;

    this.isLoading = true;
    const authData: AuthData = {
      email: form.value.email,
      password: form.value.password
    }

    this.authService.login(authData);

  }



  ngOnDestroy() {

    this.authListenerSubs.unsubscribe();

  }
}
