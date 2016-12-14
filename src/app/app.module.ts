import { BrowserModule } from '@angular/platform-browser';
import {NgModule, RootRenderer} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {CanvasRootRenderer} from "./CanvasRenderer";
import {CanvasRootRenderer2} from "./CanvasRenderer2";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    {
      provide: RootRenderer,
      useClass: CanvasRootRenderer
      // useClass: CanvasRootRenderer2
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
