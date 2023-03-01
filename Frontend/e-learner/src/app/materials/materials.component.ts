import { NewUserService } from './../services/new-user.service';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { MaterialService } from './../services/material.service';
import { Component, Input, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']
})
export class MaterialsComponent implements OnInit {

  constructor(
    private uploadService: MaterialService,
    private formBuilder: FormBuilder,
    private ns: NewUserService
  ) { }

  fileName = '';
  uploadProgress!:number;
  uploadSub!: Subscription;


  ngOnInit(): void {

  }

  myForm = new FormGroup({
    uploader: new FormControl(''),
    material: new FormControl(''),
    description: new FormControl('')
  });

  get f(){
    return this.myForm.controls;
  }

  setstudent(){
    let decryptcookies = this.ns.toDecryptStudentEducator()
    console.log(decryptcookies)
    return JSON.parse(decryptcookies.email)
  }

  onFileChange(event:any) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        uploader: this.setstudent(),
        material: file
      });
    }
  }

  submit(){
    const formData = new FormData();
    formData.append('material', this.myForm.get('material')!.value);
    formData.append('uploader', this.myForm.get('uploader')!.value);
    formData.append('description', this.myForm.get('description')!.value);
    console.log(this.myForm.value);
    this.uploadService.postdata(formData).subscribe(res => {
      console.log(res)
        if (res.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (res.loaded / res.total));
        }
    })
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null as any;
    this.uploadSub = null as any;
  }
}
