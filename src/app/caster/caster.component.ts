import {Component, OnInit} from '@angular/core';
import {Device} from '../home/home.component';
// @ts-ignore
import Remon from '@remotemonster/sdk';
import {desktopCapturer} from 'electron';

@Component({
  selector: 'app-caster',
  templateUrl: './caster.component.html',
  styleUrls: ['./caster.component.scss']
})
export class CasterComponent implements OnInit {

  play_status: string;
  isShowSrcBtn: boolean;
  isShowDstBtn: boolean;

  resolutions: SelectItem[] = [
    {name: '360p', value: '640X360'},
    {name: '540p', value: '960X540'},
    {name: '720p', value: '1280X720'},
    {name: '1080p', value: '1920X1080'}
  ];
  framerates: SelectItem[] = [
    {name: '23.976FPS', value: '23.976'},
    {name: '24FPS', value: '24'},
    {name: '25FPS', value: '25'},
    {name: '29.97FPS', value: '29.97'},
    {name: '30FPS', value: '30'},
    {name: '60FPS', value: '60'}
  ];
  codecs: SelectItem[] = [
    {name: 'H.264', value: 'H264'},
    {name: 'VP8', value: 'VP8'},
    {name: 'VP9', value: 'VP9'}
  ];
  bitrates: SelectItem[] = [
    {name: '400K', value: '400'},
    {name: '800K', value: '800'},
    {name: '1M', value: '1000'},
    {name: '1.5M', value: '1500'},
    {name: '2M', value: '2000'},
    {name: '2.5M', value: '2500'},
    {name: '3M', value: '3000'},
    {name: '3.5M', value: '3500'},
    {name: '4M', value: '4000'}
  ];


  config = {
    credential: {
      serviceId: 'hdyang@catenoid.net',
      key: '21c728d5182241392c20021c33d3a604c3e5380076406d11'
    },
    view: {
      local: '#v_cast',
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
  c_devices: Promise<MediaStream>;
  src_video: Promise<any>;

  v_src_obj: any;
  v_src: any;


  selectedResolution: SelectItem;
  selectedCodec: SelectItem;
  selectedFramerate: SelectItem;
  selectedBitrate: SelectItem;

  constructor() {
    const argu = {
      listener: null,
      config: this.config
    };
    this.remon = new Remon(argu);

  }

  ngOnInit() {
    this.play_status = 'play_circle_outline';
    this.v_devices = this.getDevice('video');
    this.a_devices = this.getDevice('audio');
    this.c_devices = this.getCaptureStream();
    console.log(this.remon);

  }

  onClickPlay($event: any) {

    if ($event.target.innerHTML === 'play_circle_outline') {
      this.play_status = 'pause_circle_outline';
    } else {
      this.play_status = 'play_circle_outline';
    }
  }

  onEnterOverPlayer($event: MouseEvent) {
    this.isShowSrcBtn = true;
  }

  onLeavePlayer($event: MouseEvent) {
    setTimeout(() => {
      this.isShowSrcBtn = false;
    }, 1000);
  }

  getDevice(type: string): Promise<any> {
    return new Promise(resolve => {
      const devs: Device[] = [];
      navigator.mediaDevices.enumerateDevices().then(function (devices) {
        console.log(devices);
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
        resolve(stream);
        // window.URL.createObjectURL(stream);
      });
    });
  }

  getCaptureStream(): Promise<any> {
    return new Promise(resolve => {
      const constraint = {
        video: true,
        audio: true
      };
      desktopCapturer.getSources({types: ['window', 'screen']}, (err, sources) => {
        resolve(sources);
      });
    });
  }

  onLiveCastStart(event: any) {
    console.log(this.selectedBitrate);
    this.remon.createCast();
  }

  onLiveCastStop(event: any) {
    this.remon.close();
  }

  async onLiveCastSwitch(event: any) {
    // this.remon.switchCamera();

    // console.log(this.remon.context.mediaManager);
    // console.log(this.selectedVideoDevice);
    // const id = this.selectedVideoDevice.replace(/window|screen/g, function (match) {
    //   return match + ':';
    // });
    // navigator.webkitGetUserMedia({
    //   audio: false,
    //   video: {
    //     mandatory: {
    //       chromeMediaSource: 'desktop',
    //       chromeMediaSourceId: id,
    //       minWidth: 1280,
    //       maxWidth: 1280,
    //       minHeight: 720,
    //       maxHeight: 720
    //     }
    //   }
    // }, (stream) => {
    //   // console.log(this.remon.context.peerConnection.getLocalStreams());
    //   // console.log(this.remon.context.peerConnection.getRemoteStreams());
    //   // this.remon.context.peerConnection.addStream(stream);
    //   // this.remon.context.bindLocalStreamToPeerConnection(stream);
    //
    //
    //
    //   console.log(this.remon);
    // }, (e) => {
    // });

  }

  onChangeVideoSource($event: any) {

    const videoConstraints = {
      deviceId: undefined
    };
    videoConstraints.deviceId = {exact: $event.value};
    const constraints = {
      video: videoConstraints,
      audio: false
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        this.v_src_obj = stream;
      }
    );
  }

  onChangeAudioSource(event: any) {
    this.src_video = this.getStream();
  }

  onChangeDesktopSource($event: any) {
    const id = $event.value.replace(/window|screen/g, function (match) {
      return match + ':';
    });
    navigator.webkitGetUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: id,
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720
        }
      }
    }, (stream) => {
      this.v_src_obj = stream;
      console.log(stream);
    }, (e) => {
    });
  }

  getDesktopId(str: string) {
    const r = str.replace(/:/, '');
    return r;
  }

  onVideoSettingChange($event: any) {
    console.log($event.target);
    console.log(this.selectedBitrate);
  }
}

interface SelectItem {
  name: string,
  value: string
}
