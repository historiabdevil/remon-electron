import {Injectable} from '@angular/core';
// @ts-ignore
import fs from 'fs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() {
  }

  readJson(path: string): any {
    try {
      return JSON.parse(fs.readFileSync(path));
    } catch (e) {
    }
  }
  writeFile(path: string, content: string): void{
    fs.writeFileSync(path, content);
  }
}
