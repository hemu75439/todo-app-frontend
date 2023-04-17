import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
interface Task {
  _id: string;
  title: string;
  description: string;
  imagePath: string;
  creator: string;
}
const TASKS_URL = environment.api + "api/tasks/";
@Injectable({ providedIn: "root" })
export class TaskService {
  private tasks: Task[] = [];
  private taskUpdated = new Subject<{ tasks: Task[]; totalCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getTask(taskPerPage?: number, currentPage?: number) {
    let url = TASKS_URL;

    if (taskPerPage && currentPage > -1) {
      url += `?pagesize=${taskPerPage}&currentpage=${currentPage}`;
    }

    this.http
      .get<{ status: {}; data: Task[]; totalCount: number }>(url)
      .subscribe((taskData) => {
        this.tasks = taskData.data;
        this.taskUpdated.next({
          tasks: [...this.tasks],
          totalCount: taskData.totalCount,
        });
      });

    //return [...this.tasks];
  }

  getTaskUpdateListener() {
    return this.taskUpdated.asObservable();
  }

  addTask(task: Task, image: File) {
    const taskData = new FormData();
    taskData.append("title", task.title);
    taskData.append("description", task.description);
    taskData.append("image", image, task.title);

    this.http
      .post<{ status: {}; data: Task[] }>(TASKS_URL + "create", taskData)
      .subscribe(() => {
        this.router.navigate(["/"]);
      });
  }

  deleteTask(id: string) {
    return this.http.delete(TASKS_URL + "delete/" + id);
  }

  getTaskInfo(id: string | null) {
    return this.http.get<{ status: {}; data: Task }>(TASKS_URL + id);
  }

  updateTask(task: Task) {
    let taskData = null;

    if (typeof task.imagePath == "string") {
      taskData = task;
    } else {
      taskData = new FormData();
      taskData.append("_id", task._id);
      taskData.append("title", task.title);
      taskData.append("description", task.description);
      taskData.append("image", task.imagePath, task.title);
    }

    this.http
      .patch(TASKS_URL + "update/" + task._id, taskData)
      .subscribe((res) => {
        this.router.navigate(["/"]);
      });
  }
}
