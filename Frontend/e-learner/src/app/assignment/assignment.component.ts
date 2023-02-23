import { AssignmentService } from './../services/assignment.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {

  assignmentList:any
  constructor(
    private as: AssignmentService,
  ) { }

  ngOnInit(): void {
    this.as.getAssignment().subscribe(
      assignment => {
        this.assignmentList = assignment
        console.log(this.assignmentList);
      }
    )
  }

}
