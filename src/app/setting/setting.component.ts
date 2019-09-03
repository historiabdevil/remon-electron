import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ElectronService} from '../core/services';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  constructor(public electronService: ElectronService) {
  }

  ngOnInit() {
  }

  onNgSubmit(settingForm: NgForm) {
    console.log(settingForm);
  }

}
