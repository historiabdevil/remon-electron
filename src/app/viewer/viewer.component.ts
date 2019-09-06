import {Component, OnInit, ViewChild} from '@angular/core';
// @ts-ignore
import Remon from '@remotemonster/sdk';
import {ElectronService} from '../core/services';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {

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
      this.textlog +=  '[' + Date.now() + ']' + 'Report: ' + JSON.stringify(report) + '\n';
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

  constructor(public electronService: ElectronService) {
  }


  async ngOnInit() {
    const setting = this.electronService.fs.readFileSync('./setting.json').toString();
    const jsonSetting = JSON.parse(setting);
    let config = this.config;
    config.credential.serviceId = jsonSetting.serviceid;
    config.credential.key = jsonSetting.servicekey;
    const argu = {
      listener: this.listener,
      config: config
    };
    this.remon = new Remon(argu);
    this.remon.fetchCasts().then((cast) => {
      this.textlog += '[FIND CHANNEL] : ' + JSON.stringify(cast) + '\n';
      this.remon.joinCast(cast[0].id);

    });
  }

  fullsize($event: MouseEvent) {
    const viewer = document.getElementById('viewer');
    //@ts-ignore
    viewer.webkitRequestFullscreen();
  }

  refresh($event: MouseEvent) {
    this.remon.fetchCasts().then((cast) => {
      this.remon.joinCast(cast[0].id);
      console.log(cast);
    });
  }
}
