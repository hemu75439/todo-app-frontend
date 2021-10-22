import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  constructor(private authSrevice: AuthService) {}

  ngOnInit() {
    this.authSrevice.autoAuthUser();
  }

  //@Input task = []
  updatedTasks: {title: string, description: string}[] = [];

  addTask(task: {title: string, description: string}) {
    this.updatedTasks.push(task);
  }

}
