import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
//import { LoginComponent } from './login/login.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  imports: [
    FlexLayoutModule,
    MaterialModule,
    CommonModule
  ],
  declarations: [
    LoaderComponent, /* LoginComponent*/
  ],
  exports: [
    LoaderComponent, /* LoginComponent */
  ]
})
export class SharedModule { }
