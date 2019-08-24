import {Component, OnInit} from '@angular/core';
import Remon from '@remotemonster/sdk';

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
    onIn
    onCreate: function(){},


  }

  remon: Remon;

  constructor() {
  }

  ngOnInit() {
    const argu = {
      listener : null,
      config: this.config
    };
    this.remon = new Remon(argu);

  }
  onLiveCastStart(event: any){
    this.remon.createCast();
  }
  onLiveCastStop(event: any){
    this.remon.close();
  }

}
