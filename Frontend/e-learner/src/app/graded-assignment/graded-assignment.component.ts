import { NewUserService } from './../services/new-user.service';
import { AssignmentService } from './../services/assignment.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-graded-assignment',
  templateUrl: './graded-assignment.component.html',
  styleUrls: ['./graded-assignment.component.css']
})
export class GradedAssignmentComponent implements OnInit {

  constructor(
    private as:AssignmentService,
    private ns:NewUserService
  ) { }

  grade: any

  setstudent(){
    let decryptcookies = this.ns.toDecryptStudentEducator()
    console.log(decryptcookies)
    if (decryptcookies.educator === "false" && decryptcookies.student === "true") {
      return JSON.parse(decryptcookies.email)
    }
  }

  ngOnInit(): void {

    let email: string= this.setstudent()
    this.as.getGradedAssignment(email).subscribe(
      (assignment: any) => {
        console.log(assignment)
        this.grade = assignment
      }
    )
  }

}
