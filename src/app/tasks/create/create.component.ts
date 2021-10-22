import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { TaskService } from "../task.service";
import { imageTypeValidator } from "./image-type.validator"



@Component({
  selector: 'app-create-task',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})


export class CreateTaskComponent implements OnInit {

  mode = "Create";
  private taskId: string | null = null;
  task: any;

  taskForm: FormGroup;
  imagePreview: any = null;

  isLoading = false;


  constructor(public taskService: TaskService, public route: ActivatedRoute) {

  }


  ngOnInit() {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has("taskId")) {

        this.taskForm = new FormGroup({
          'title': new FormControl(null,{validators: [Validators.required, Validators.maxLength(30)]}),
          'description': new FormControl(null,{validators: [Validators.required]}),
          'image': new FormControl(null, {validators: [Validators.required]})
        })

        this.mode = "Edit";
        this.taskId = paramMap.get('taskId');

        this.isLoading = true;
        // get task info from services
        this.taskService.getTaskInfo(this.taskId)
          .subscribe((res)=> {
            console.log(res.data)
            this.task = res.data;
            this.taskForm.setValue({
              'title': this.task.title,
              'description': this.task.description,
              'image': this.task.imagePath
            })
            this.isLoading = false;
          });

      } else {

        this.taskForm = new FormGroup({
          'title': new FormControl(null,{validators: [Validators.required, Validators.maxLength(30)]}),
          'description': new FormControl(null,{validators: [Validators.required]}),
          'image': new FormControl(null, {validators: [Validators.required, imageTypeValidator]})
        })

        this.mode = "Create";
        this.taskId = null;
      }
    })
  }


  onSaveTask() {

    if(!this.taskForm.valid){

     return;

    } else {

      if(this.mode == "Edit") {

        const task = {
          _id : this.task._id,
          title: this.taskForm.value.title,
          description: this.taskForm.value.description,
          imagePath: this.taskForm.value.image,
          creator: this.task.creator
        }

        this.taskService.updateTask(task);
      } else {

        const task = {
          _id : "",
          title: this.taskForm.value.title,
          description: this.taskForm.value.description,
          imagePath: "",
          creator: ""
        }

        this.taskService.addTask(task, this.taskForm.value.image);
      }

      this.taskForm.reset();
    }

  }


  onImagePick(event: Event) {

    event.preventDefault();

    const file = (event.target as HTMLInputElement).files[0];
    this.taskForm.patchValue({image: file});
    this.taskForm.get('image')?.updateValueAndValidity();

    this.imageToDataUrl(file);
  }

  imageToDataUrl(file: File) {
    const reader = new FileReader();
    reader.onload = ()=> {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);
  }
}


