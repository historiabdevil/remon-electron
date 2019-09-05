import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PageNotFoundComponent} from './shared/components';
import {HomeComponent} from './home/home.component';
import {FirstComponent} from './first/first.component';
import {CasterComponent} from './caster/caster.component';
import {SettingComponent} from './setting/setting.component';
import {ViewerComponent} from './viewer/viewer.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/first',
    pathMatch: 'full'
  },
  {
    path: 'first',
    component: FirstComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'caster',
    component: CasterComponent
  },
  {
    path: 'setting',
    component: SettingComponent
  },
  {
    path: 'viewer',
    component: ViewerComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
