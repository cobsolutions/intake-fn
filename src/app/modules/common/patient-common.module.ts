import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {
  AlertModule,
  BadgeModule,
  ButtonModule,
  CardModule,
  CollapseModule, DateRangePickerModule, FormModule, GridModule, MultiSelectModule, SharedModule, TimePickerModule
} from '@coreui/angular-pro';

import { AddressComponent } from './components/address/address.component';
import { NumberonlyDirective } from './directives/numberonly.directive';
import { ZipcodeDirective } from './directives/zipcode.directive';
import { PhonePipe } from './pipes/phone.pipe';
import { TrimTextPipe } from './pipes/trimer/trim-text.pipe';
import { InputTrimmerDirective } from './directives/trimmer/input-trimmer.directive';
import { HeightFormatPipe } from './pipes/height/height-format.pipe';
import { HeightFormatterDirective } from './directives/heightFormat/height-formatter.directive';
import { WeightFormatPipe } from './pipes/weight/weight-format.pipe';




@NgModule({
  declarations: [
    AddressComponent,
    NumberonlyDirective,
    ZipcodeDirective,
    PhonePipe,
    TrimTextPipe,
    InputTrimmerDirective,
    HeightFormatPipe,
    HeightFormatterDirective,
    WeightFormatPipe,

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AlertModule,
    BadgeModule,
    ButtonModule,
    CardModule,
    CollapseModule,
    GridModule,
    SharedModule,
    FormModule,
    DateRangePickerModule,
    TimePickerModule,
    MultiSelectModule,
    
    
  ],
  exports: [
    AddressComponent,
    NumberonlyDirective,
    ZipcodeDirective,
    PhonePipe,
    TrimTextPipe,
    InputTrimmerDirective,
    HeightFormatPipe,
    HeightFormatterDirective,
    WeightFormatPipe
  ]
})
export class PatientCommonModule { }
