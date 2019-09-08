import {Component} from '@angular/core';
import {ElectronService} from './core/services';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../environments/environment';
import * as url from "url";
import * as path from "path";

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

  onViwerNewWinodw($event: MouseEvent, link: string) {
    const win = window.open(`/#/${link}`, '_blank');
    console.log(win);
  }
}
