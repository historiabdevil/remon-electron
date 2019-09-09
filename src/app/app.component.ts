import {Component} from '@angular/core';
import {ElectronService} from './core/services';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../environments/environment';
import * as url from 'url';
import * as path from 'path';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public electronService: ElectronService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
      electronService.ipcRenderer.send('app-launched', 'an-argument');
    } else {
      console.log('Mode web');
    }
    this.electronService.fs.exists('./setting.json', (exists) => {
      if (!exists) {
        this.electronService.fs.writeFileSync('./setting.json',
          '{"serviceid":"hdyang@catenoid.net","servicekey":"21c728d5182241392c20021c33d3a604c3e5380076406d11","user":"admin"}');
      }
    });
    this.electronService.fs.exists('./caster.json', (exists) => {
      if (!exists) {
        this.electronService.fs.writeFileSync('./caster.json',
          '{"resolution":"1920X1080","frameRate":"30","codec":"H264","bitrate":"4000"}');
      }
    });
    this.electronService.fs.exists('./branch-caster.json', (exists) => {
      if (!exists) {
        this.electronService.fs.writeFileSync('./branch-caster.json',
          '{"resolution":"1920X1080","frameRate":"30","codec":"VP9","bitrate":"1500"}');
      }
    });
  }

  onViwerNewWinodw($event: MouseEvent, link: string) {
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
    win.loadURL(
      'file://' +
      __dirname +
      '/index.html#/' +
      link
    );
    console.log(win);
  }
}
