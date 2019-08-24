import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import {MatButtonToggleModule, MatGridListModule} from '@angular/material';
import {MatVideoModule} from 'mat-video';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, SharedModule, HomeRoutingModule, MatGridListModule, MatVideoModule, MatButtonToggleModule]
})
export class HomeModule {}
