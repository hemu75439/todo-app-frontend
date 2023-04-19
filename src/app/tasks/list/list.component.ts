import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  private takeSub: Subscription;

  private authListenerSubs: Subscription;
  public userIsAuthenticated = false;

  isLoading = false;

  userId: string;

  totalTasks = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOption = [1,5,10,20];


  constructor(public taskService: TaskService, public authService: AuthService) {

  }

  tasks: {_id: string, title: string, description: string, imagePath: string, creator: string}[] = [];

  ngOnInit() {

    this.isLoading = true;
    this.taskService.getTask(this.pageSize, this.pageIndex);
    this.takeSub = this.taskService.getTaskUpdateListener()
      .subscribe((taskData: any) => {
        this.tasks = taskData.tasks;
        this.totalTasks = taskData.totalCount;
        this.isLoading = false;
      })

    this.userIsAuthenticated = this.authService.getAuthStatus();

    this.userId = this.authService.getUserId();

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      })

  }

  onChangePage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.taskService.getTask(this.pageSize, this.pageIndex);
  }

  onDelete(id: string) {
    this.taskService.deleteTask(id);
  }


  ngOnDestroy() {
    this.takeSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

}
