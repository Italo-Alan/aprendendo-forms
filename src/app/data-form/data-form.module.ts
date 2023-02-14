import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataFormComponent } from './data-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { AppComponent } from './../app.component';
import { FormDebugComponent } from '../shared/form-debug/form-debug.component';



@NgModule({
  declarations: [
    DataFormComponent,
    AppComponent,
    FormDebugComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    SharedModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    FormDebugComponent
  ]
})
export class DataFormModule { }
