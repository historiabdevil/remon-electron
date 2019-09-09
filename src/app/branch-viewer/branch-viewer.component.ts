import {Component, OnDestroy, OnInit} from '@angular/core';
import {ElectronService} from '../core/services';
// @ts-ignore
import Remon from '@remotemonster/sdk';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-branch-viewer',
  templateUrl: './branch-viewer.component.html',
  styleUrls: ['./branch-viewer.component.scss']
})
export class BranchViewerComponent implements OnInit, OnDestroy {

  listener = {
    onInit: (token) => {
      this.textlog += 'Init : ' + token + '\n';
    },
    onCreate: (channelId) => {
      this.textlog += 'Created : ' + channelId + '\n';
    },
    onJoin: (channelId) => {
      this.textlog += 'Join : ' + channelId + '\n';
    },
    onConnect: (channelId) => {
      this.textlog += 'Connect : ' + channelId + '\n';
    },
    onComplete: () => {
      this.textlog += 'Completed : ' + '\n';
    },
    onClose: () => {
      this.textlog += 'Close : ' + '\n';
    },
    onError: (error) => {
      this.textlog += '[' + Date.now() + ']' + 'Error: ' + error + '\n';
    },
    onStateChange: (state) => {
      this.textlog += '[' + Date.now() + ']' + 'State: ' + state + '\n';
    },
    onStat: (report) => {
      this.textlog += '[' + Date.now() + ']' + 'Report: ' + JSON.stringify(report) + '\n';
    }
  };

  remon: Remon;
  config = {
    credential: {
      serviceId: 'hdyang@catenoid.net',
      key: '21c728d5182241392c20021c33d3a604c3e5380076406d11'
    },
    view: {
      remote: '#viewer',
    },
    media: {
      audio: true,
      video: {
        width: {max: '1920', min: '1920'},
        height: {max: '1080', min: '1080'},
        codec: 'H264',
        frameRate: 29.97
      },
    },
    dev: {
      logLevel: 'DEBUG'
    },
    rtc: {
      simulate: false
    }
  };
  textlog = '';
  branch: string;

  constructor(public electronService: ElectronService, private route: ActivatedRoute,
              private router: Router) {
    this.branch = this.route.snapshot.params['id'];
  }


  ngOnInit() {
    this.createViewer();
  }

  createViewer() {
    const setting = this.electronService.fs.readFileSync('./setting.json').toString();
    const jsonSetting = JSON.parse(setting);
    const config = this.config;
    config.credential.serviceId = jsonSetting.serviceid;
    config.credential.key = jsonSetting.servicekey;
    const argu = {
      listener: this.listener,
      config: config
    };
    this.remon = undefined;
    this.remon = new Remon(argu);
    console.log(JSON.stringify(this.branch));
    this.remon.connectCall(this.branch);
  }

  fullsize($event: MouseEvent) {
    const viewer = document.getElementById('viewer');
    //@ts-ignore
    viewer.webkitRequestFullscreen();
  }

  refresh($event: MouseEvent) {
    if (this.remon) {
      this.remon.close();
    }
  }

  ngOnDestroy(): void {
    if (this.remon) {
      this.remon.close();
    }
  }

}
