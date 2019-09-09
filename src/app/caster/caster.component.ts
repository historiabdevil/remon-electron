import {AfterContentInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Connection, Device, SelectItem} from '../home/home.component';
// @ts-ignore
import Remon from '@remotemonster/sdk';
import {desktopCapturer} from 'electron';
import {ElectronService} from '../core/services';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {from, Observable} from 'rxjs';
import adapter from 'webrtc-adapter';


@Component({
  selector: 'app-caster',
  templateUrl: './caster.component.html',
  styleUrls: ['./caster.component.scss']
})
export class CasterComponent implements OnInit, AfterContentInit, OnDestroy {

  constructor(public electronService: ElectronService) {

  }

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
      local: '#v_cast'
    },
    media: {
      audio: {deviceId: undefined},
      video: {
        width: {max: '1920', min: '320'},
        height: {max: '1080', min: '240'},
        codec: 'H264',
        frameRate: 29.97,
        deviceId: undefined,
        maxBandwidth: '1000'
      }
    },
    dev: {
      logLevel: 'VERBOSE'
    },
    rtc: {
      simulate: false
    }
  };


  remon: Remon;
  selectedVideoDevice: string;
  selectedAudioDevice: string;
  devices: Promise<any>;
  v_devices: Promise<Device>;
  a_devices: Promise<Device>;
  c_devices: Promise<MediaStream>;
  src_video: Promise<any>;
  obs_device: Observable<any>;
  v_src_obj: any;
  v_src: any;


  selectedResolution: string;
  selectedCodec: string;
  selectedFramerate: string;
  selectedBitrate: string;
  textlog = 'LOG....\n';


  displayColumns: string[] = ['Branch', 'Resolution', 'Speed'];
  dataSource = new MatTableDataSource<Connection>(CONNECTION_DATA);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  connections: string;

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
      if (typeof (error) === 'string') {
        this.textlog += '[' + Date.now() + ']' + 'Error: ' + error + '\n';
      } else {
        this.textlog += '[' + Date.now() + ']' + 'Error: ' + JSON.stringify(error) + '\n';
      }
    },
    onStateChange: (state) => {
      this.textlog += '[' + Date.now() + ']' + 'State: ' + state + '\n';
    },
    onStat: (result) => {

      this.textlog += `[${Date.now()}] Report: ${JSON.stringify(result)}\n`;
    }
  };
  isLive: boolean;

  ngOnInit() {


  }

  ngAfterContentInit(): void {
    try {
      const castconfig = this.electronService.fs.readFileSync('./caster.json');
      const jsonCastconfig = JSON.parse(castconfig.toString());
      this.selectedBitrate = jsonCastconfig.bitrate;
      this.selectedResolution = jsonCastconfig.resolution;
      this.selectedCodec = jsonCastconfig.codec;
      this.selectedFramerate = jsonCastconfig.frameRate;
      this.dataSource.paginator = this.paginator;
      this.play_status = 'play_circle_outline';
      this.devices = this.getDevice();
      this.devices.then((resolve) => {
        this.v_devices = new Promise<Device>(resolve1 => {
          resolve1(resolve.videos);
        });
        this.a_devices = new Promise<Device>(resolve1 => {
          resolve1(resolve.audios);
        });
      });


      this.c_devices = this.getCaptureStream();
    } catch (e) {
      console.error(e);
    }
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

  getDevice(): Promise<any> {
    return new Promise<any>(resolve => {
      const audios: Device[] = [];
      const videos: Device[] = [];
      // @ts-ignore
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        console.log(devices);
        devices.forEach((item) => {
          if (item.kind === 'videoinput') {
            videos.push({viewValue: item.label, value: item.deviceId} as Device);
          } else {
            // @ts-ignore
            if (item.kind === 'audiooutput') {
              audios.push({viewValue: item.label, value: item.deviceId} as Device);
            }
          }
        });
        resolve({audios: audios, videos: videos});
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
    event.preventDefault();
    const castconfig = {
      resolution: this.selectedResolution,
      frameRate: this.selectedFramerate,
      codec: this.selectedCodec,
      bitrate: this.selectedBitrate
    };
    this.electronService.fs.writeFileSync('./caster.json', JSON.stringify(castconfig));


    this.remon = undefined;
    const setting = this.electronService.fs.readFileSync('./setting.json').toString();
    const jsonSetting = JSON.parse(setting);
    const config = this.config;
    config.credential.serviceId = jsonSetting.serviceid;
    config.credential.key = jsonSetting.servicekey;
    // tslint:disable-next-line:radix
    config.media.video.width.min = this.selectedResolution.split('X')[0];
    // tslint:disable-next-line:radix
    config.media.video.width.max = this.selectedResolution.split('X')[0];
    // tslint:disable-next-line:radix
    config.media.video.height.min = this.selectedResolution.split('X')[1];
    // tslint:disable-next-line:radix
    config.media.video.height.max = this.selectedResolution.split('X')[1];
    config.media.video.maxBandwidth = this.selectedBitrate;
    config.media.video.frameRate = Number(this.selectedFramerate);
    config.media.video.codec = this.selectedCodec;
    config.media.video.deviceId = this.selectedVideoDevice;
    config.media.audio.deviceId = this.selectedAudioDevice;

    console.log(config);
    const argu = {
      listener: this.listener,
      config: config
    };
    this.remon = new Remon(argu);
    const date = new Date().getTime();
    const channelId = `goto_${date}`;
    this.remon.createCast(channelId);
    this.isLive = true;
    return false;
  }

  onLiveCastStop(event: any) {
    this.remon.close();
    this.isLive = false;
  }

  onLiveCastSwitch(event: any) {
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
  }

  onChangeDesktopSource($event: any) {
    const id = $event.value.replace(/window|screen/g, function (match) {
      return match + ':';
    });
    // @ts-ignore
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

  ngOnDestroy(): void {
    if (this.remon) {
      this.remon.close();
    }
  }
}


const CONNECTION_DATA: Connection[] = [
  {Branch: '1', Resolution: '1920X1080', Speed: '1M'}
];

