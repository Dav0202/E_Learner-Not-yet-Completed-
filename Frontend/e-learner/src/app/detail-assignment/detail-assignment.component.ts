import { ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AssignmentService } from '../services/assignment.service';
import { MatStepper } from "@angular/material/stepper";
import { FormBuilder, FormGroup, Validators, NgForm, FormGroupDirective, FormControl, FormArray } from '@angular/forms';import { pluck } from "rxjs/operators";
import { NewUserService } from '../services/new-user.service';


@Component({
  selector: 'app-detail-assignment',
  templateUrl: './detail-assignment.component.html',
  styleUrls: ['./detail-assignment.component.css']
})
export class DetailAssignmentComponent implements OnInit {

  assignmentdetail:any;
  state!:string;
  isAtEnd: number = 1
  isAtstart!:number
  length:any
  assignmentanswer: any[] = []
  answer!: string;
  radioSelected!:string;
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    private route: ActivatedRoute,
    private as: AssignmentService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ns: NewUserService
  ){ }
  isLinear = false;
  questionForm!:FormGroup

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        const id: any = params.get('id')
        this.as.getAssignmentDetail(id).subscribe(
                    list => {
            this.assignmentdetail = list;
            this.length = list.questions.length
            console.log(this.assignmentdetail, this.length);
          }
        )
      }
    )
  }

  goBack(stepper: MatStepper){
    stepper.previous();
    if (this.isAtEnd > this.length) {
      this.isAtEnd--
    }
  }

  goForward(stepper: MatStepper){
    stepper.next();
    if (this.isAtEnd < this.length) {
      this.isAtEnd++
    }
    this.assignmentanswer.push(this.answer)

  }

  setstudent(){
    let decryptcookies = this.ns.toDecryptStudentEducator()
    console.log(decryptcookies)
    if (decryptcookies.educator === "false" && decryptcookies.student === "true") {
      return JSON.parse(decryptcookies.email)
    }
  }

  submit(){
    this.questionForm = this.fb.group({
      email: this.setstudent(),
      id: [this.assignmentdetail['id'], Validators.required],
      answers: [this.assignmentanswer, Validators.required],
    });
    this.assignmentanswer.push(this.answer)
    this.as.createdGradedAssignment(this.questionForm.value).subscribe()
    console.log(this.questionForm.value)
    this.snackBar.open('Assignment submited', 'Close', {
      duration: 3000,
      verticalPosition:this.verticalPosition
    })
  }

}
