import {Component} from '@angular/core';
import {ElectronService} from './core/services';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../environments/environment';

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
  }

  onViwerNewWinodw($event: MouseEvent) {
    const win = new this.electronService.remote.BrowserWindow({
      height: 600,
      width: 800
    });
    win.loadURL('http://localhost:4200/viewer');

  }
}
