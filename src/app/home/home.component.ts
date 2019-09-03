import {Component, OnInit} from '@angular/core';
// @ts-ignore
import Remon from '@remotemonster/sdk';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

export interface Device {
  value: string;
  viewValue: string;
}

// @ts-ignore
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  test: FormGroup;

  constructor(fb: FormBuilder) {
    // this.test = fb.group({});group
  }

  ngOnInit() {



  }




}
