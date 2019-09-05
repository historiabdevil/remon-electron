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
      this.textlog += token + '\n';
    },
    onCreate: (channelId) => {
      this.textlog += channelId + '\n';
    },
    onJoin: (channelId) => {
      this.textlog += channelId + '\n';
    },
    onConnect: (channelId) => {
      this.textlog += channelId + '\n';
    },
    onComplete: () => {
    },
    onClose: () => {
    },
    onError: (error) => {
      this.textlog += error + '\n';
    },
    onStateChange: (state) => {
      this.textlog += state + '\n';
    },
    onStat: (report) => {
      this.textlog += report + '\n';
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
      this.remon.joinCast(cast[0].id);
      console.log(cast);
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
