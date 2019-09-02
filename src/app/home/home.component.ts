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

  config = {
    credential: {
      serviceId: 'hdyang@catenoid.net',
      key: '21c728d5182241392c20021c33d3a604c3e5380076406d11'
    },
    view: {
      local: '#video',
    },
    media: {
      audio: true,
      video: {
        width: {max: '1920', min: '320'},
        height: {max: '1080', min: '240'},
        codec: 'H264',
        frameRate: 29.97
      },
    },
    dev: {
      logLevel: 'VERBOSE'
    },
    rtc: {
      simulate: false
    }
  };

  listener = {
    onInit: function () {
    },
    onCreate: function () {
    }
  };

  remon: Remon;
  selectedVideoDevice: string;
  selectedAudioDevice: string;
  v_devices: Promise<Device[]>;
  a_devices: Promise<Device[]>;
  src_video: Promise<any>;

  test: FormGroup;

  constructor(fb: FormBuilder) {
    // this.test = fb.group({});group
  }

  ngOnInit() {

    const argu = {
      listener: null,
      config: this.config
    };
    this.remon = new Remon(argu);
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(function (stream) {
        console.log(stream);
      }
    );
    // this.v_devices = this.getDevice('video');
    // this.a_devices = this.getDevice('audio');
  }


  getDevice(type: string): Promise<any> {
    return new Promise(resolve => {
      const devs: Device[] = [];
      navigator.mediaDevices.enumerateDevices().then(function (devices) {
        devices.forEach(function (item) {
          if (item.kind === (type + 'input')) {
            devs.push({viewValue: item.label, value: item.deviceId});
          }
        });
      }).then(function () {
        resolve(devs);
      });

    });
  }

  getStream(): Promise<any> {
    return new Promise(resolve => {
      const constraint = {
        video: true,
        audio: true
      };
      navigator.mediaDevices.getUserMedia(constraint).then(function (stream) {
        window['stream'] = stream;
        resolve(stream);
        // window.URL.createObjectURL(stream);
      });
    });
  }

  onLiveCastStart(event: any) {
    this.remon.createCast();
  }

  onLiveCastStop(event: any) {
    this.remon.close();
  }

  onLiveCastSwitch(event: any) {
    this.remon.switchCamera();
  }

  onChangeVideoSource(event: any) {
    this.src_video = this.getStream();
  }

  onChangeAudioSource(event: any) {
    this.src_video = this.getStream();
  }

}
