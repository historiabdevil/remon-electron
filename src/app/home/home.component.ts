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

  // Container
  direction: 'row' | 'row-reverse' | 'column' | 'column-reverse' = 'row';
  wrap: 'wrap' | 'no-wrap' = 'no-wrap';
  mainAxis: 'flex-start' | 'center' | 'flex-end' | 'space-around' | 'space-between' = 'flex-start';
  crossAxis: 'flex-start' | 'center' | 'flex-end' | 'stretch' = 'stretch';
  mainAxisOptions = ['flex-start', 'center', 'flex-end', 'space-around', 'space-between', 'space-evenly'];
  crossAxisOptions = ['flex-start', 'center', 'flex-end', 'stretch'];
  justifyContent: 'flex-start' | 'center' | 'flex-end' | 'stretch' = 'flex-start';
  alignContent: 'flex-start' | 'center' | 'flex-end' | 'stretch' = 'stretch';
  alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline' = 'stretch';
  justifyContentOptions = ['flex-start', 'flex-end', 'center', 'space-around', 'space-between', 'space-evenly'];
  alignContentOptions = ['flex-start', 'flex-end', 'center', 'space-around', 'space-between', 'stretch'];
  alignItemsOptions = ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'];
  alignSelfOptions = ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'];
  // Items
  grow = 0;
  shrink = 0;
  basis = 'auto';
  alignSelf: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch' = 'auto';
  order = 0;
  items = 3;

  flexForm: FormGroup;

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

  itemFlexOptions(setAlignSelf?: boolean) {
    return {
      grow: this.grow,
      shrink: this.shrink,
      basis: this.flexForm.get('basis').value,
      alignSelf: this.alignSelf,
      order: this.order,
    };
  }

  get itemsFormArray(): FormArray {
    return this.flexForm.get('items') as FormArray;
  }

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {

    this.flexForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
      basis: this.basis,
      justifyContent: this.justifyContent,
      alignContent: this.alignContent,
      alignItems: this.alignItems,
    });

    let numberOfItems = 0;

    while (numberOfItems < this.items) {
      this.itemsFormArray.push(this.formBuilder.group(this.itemFlexOptions()));
      numberOfItems++;
    }

    this.flexForm
      .get('basis')
      .valueChanges
      .subscribe(newValue => {
        this.itemsFormArray
          .controls
          .forEach((control, index) => this.itemsFormArray.at(index).get('basis').setValue(newValue));
      });


    this.flexForm
      .get('alignContent')
      .valueChanges
      .subscribe(newValue => {
        this.itemsFormArray
          .controls
          .forEach((control, index) => this.itemsFormArray.at(index).get('alignSelf').setValue('auto'));
      });
    const argu = {
      listener: null,
      config: this.config
    };
    this.remon = new Remon(argu);
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(function (stream) {
        console.log(stream);
      }
    );
    this.v_devices = this.getDevice('video');
    this.a_devices = this.getDevice('audio');
  }

  getFlexOptions(index: number) {
    const itemFlexOptions = this.itemsFormArray.at(index).value;

    if (itemFlexOptions.grow || itemFlexOptions.shrink || (itemFlexOptions.basis !== this.basis)) {
      return `${itemFlexOptions.grow} ${itemFlexOptions.shrink} ${itemFlexOptions.basis}`;
    } else {
      return `${this.grow} ${this.shrink} ${this.basis}`;
    }
  }

  getFlexAlignSelf(index: number) {
    const itemFlexOptions = this.itemsFormArray.at(index).value;

    if (itemFlexOptions.alignSelf !== this.alignSelf) {
      return itemFlexOptions.alignSelf;
    } else {
      return this.alignSelf;
    }
  }

  getFlexOrder(index: number) {
    const itemFlexOptions = this.itemsFormArray.at(index).value;

    if (itemFlexOptions.order !== this.order) {
      return itemFlexOptions.order;
    } else {
      return this.order;
    }
  }

  add(type: string) {
    this[type]++;
    if (type === 'items') {
      this.itemsFormArray.push(this.formBuilder.group(this.itemFlexOptions(true)));
    } else {
      this.itemsFormArray.controls.forEach((control, index) => this.itemsFormArray.at(index).get(type).setValue(this[type]));
    }
  }

  remove(type: string) {
    if (!this[type]) {
      return;
    }
    this[type]--;
    if (type === 'items') {
      this.itemsFormArray.removeAt(this[type]);
    } else {
      this.itemsFormArray.controls.forEach((control, index) => this.itemsFormArray.at(index).get(type).setValue(this[type]));
    }
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
