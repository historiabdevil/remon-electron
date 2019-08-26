import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';

import {HomeComponent} from './home.component';
import {SharedModule} from '../shared/shared.module';
import {
  MatButtonModule, MatFormFieldModule, MatSelectModule
} from '@angular/material';
import {MatVideoModule} from 'mat-video';
import {FlexModule} from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, SharedModule, HomeRoutingModule, MatVideoModule, FlexModule,
    MatButtonModule, BrowserAnimationsModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule]
})
export class HomeModule {
}
