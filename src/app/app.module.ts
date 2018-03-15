import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { AppComponent } from './app.component';
import {RestService} from './services/rest.service';
import {HttpUtil} from './helpers/http-util';
import {HttpClientModule} from '@angular/common/http';
import {DataTableModule, SharedModule, InputSwitchModule} from 'primeng/primeng';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DataTableModule,
    SharedModule,
    InputSwitchModule
  ],
  providers: [RestService, HttpUtil],
  bootstrap: [AppComponent]
})
export class AppModule  { }
