import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScannerRoutingModule } from './scanner-routing.module';
import { CreateComponentScannerComponent } from './component/createDevice/create-component-scanner.component';


@NgModule({
  declarations: [
    CreateComponentScannerComponent
  ],
  imports: [
    CommonModule,
    ScannerRoutingModule
  ]
})
export class ScannerModule { }
