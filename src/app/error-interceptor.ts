import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorComponent } from "./error/error.component";



@Injectable()

export class ErrorInterceptor implements HttpInterceptor {


  constructor(public dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log("err inter - ", err);
        let errorMsg = "Unknown Error.!";

        if(err.error.status.msg) errorMsg = err.error.status.msg;

        this.dialog.open(ErrorComponent, {
          width: '300px',
          data: {
            message: errorMsg
          }
        });

        return throwError(err);
      })
    );

  }


}
