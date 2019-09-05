import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ElectronService} from '../core/services';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  serviceid: any;
  servicekey: any;
  user: any;

  constructor(public electronService: ElectronService) {
  }

  ngOnInit() {
    try {
      const setting = JSON.parse(this.electronService.fs.readFileSync('./setting.json').toString());
      this.serviceid = setting.serviceid;
      this.servicekey = setting.servicekey;
      this.user = setting.user;
    } catch (e) {
      console.log(e);
    }
  }

  onNgSubmit(settingForm: NgForm) {
    console.log(settingForm);
  }

  onClickSave($event: MouseEvent) {
    const setting = {
      serviceid : this.serviceid,
      servicekey: this.servicekey,
      user: this.user
    };
    this.electronService.fs.writeFileSync('./setting.json', JSON.stringify(setting));
  }

  onClickCancel($event: MouseEvent) {
    this.serviceid = '';
    this.servicekey = '';
    this.user = '';
  }
}
