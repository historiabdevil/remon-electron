import {AfterContentInit, Component, OnInit} from '@angular/core';
// @ts-ignore
import Remon from '@remotemonster/sdk';
import {ElectronService} from '../core/services';
import BrowserWindow = Electron.BrowserWindow;


@Component({
  selector: 'app-branch-viewer-list',
  templateUrl: './branch-viewer-list.component.html',
  styleUrls: ['./branch-viewer-list.component.scss']
})
export class BranchViewerListComponent implements OnInit, AfterContentInit {
  casts: Promise<any>;
  remon: Remon;

  constructor(public electronService: ElectronService) {
  }

  ngOnInit() {


  }

  ngAfterContentInit(): void {
    const setting = this.electronService.fs.readFileSync('./setting.json');
    const jsonSetting = JSON.parse(setting.toString());
    const config = {
      credential: {
        serviceId: jsonSetting.serviceid,
        key: jsonSetting.key
      }
    };
    this.remon = new Remon({
      config: config,
      listener: null
    });
    this.casts = this.remon.fetchCalls();
    setInterval(() => {
      this.casts = this.remon.fetchCalls();
    }, 2000);
    // tempcast.then((cs) => {
    //   this.casts = cs.length > 1 ? cs : [];
    //   console.log(cs);
    // });
    // console.log(this.casts);
  }

  onConnectCall($event: MouseEvent, id: string) {

    var win = new this.electronService.remote.BrowserWindow({
      width: 1024,
      height: 768,
      center: true,
      resizable: false,
      frame: true,
      transparent: false,
      webPreferences: {
        nodeIntegration: true
      }
    });
    win.loadURL('file://' + __dirname + '/index.html#/branch-viewer/' + id);
    console.log(win);
  }
}
