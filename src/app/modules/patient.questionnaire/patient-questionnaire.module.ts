import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { IconModule } from '@coreui/icons-angular';

import { PatientQuestionnaireRoutingModule } from './patient-questionnaire-routing.module';

import {
  AccordionModule, AlertModule,
  BadgeModule, ButtonGroupModule, ButtonModule,
  CardModule,
  CollapseModule, DatePickerModule, DateRangePickerModule, DropdownModule, FormModule, GridModule, ListGroupModule, MultiSelectModule, NavModule, ProgressModule, SharedModule,
  TableModule, TabsModule, TimePickerModule, TooltipModule
} from '@coreui/angular-pro';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PatientCommonModule } from '../common';
import {
  AddressInformationComponent, AggreementsComponent, EssentialInfoComponent, InsuranceInformationComponent, MedicalHistoryInformationComponent, MedicalInfoComponent, PatientsignatureComponent, QuestionnaireAddComponent, SummaryComponent, UploadPhotoComponent, WorkerCompComponent,
  WorkerNotCompComponent
} from './index';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';


@NgModule({
  declarations: [
    EssentialInfoComponent,
    AddressInformationComponent,
    InsuranceInformationComponent,
    QuestionnaireAddComponent,
    MedicalInfoComponent,
    WorkerCompComponent,
    WorkerNotCompComponent,
    MedicalHistoryInformationComponent,
    AggreementsComponent,
    SummaryComponent,
    UploadPhotoComponent,
    PatientsignatureComponent,
  ],
  imports: [
    CommonModule,
    PatientQuestionnaireRoutingModule,
    MatStepperModule,
    MatButtonModule,
    ReactiveFormsModule,
    AlertModule,
    BadgeModule,
    ButtonModule,
    CardModule,
    CollapseModule,
    GridModule,
    SharedModule,
    TableModule,
    FormModule,
    DatePickerModule,
    DropdownModule,
    ButtonGroupModule,
    ListGroupModule,
    TooltipModule,
    TabsModule,
    NavModule,
    DateRangePickerModule,
    TimePickerModule,
    ProgressModule,
    IconModule,
    FormsModule,
    MultiSelectModule,
    AccordionModule,
    PatientCommonModule,
    FontAwesomeModule,
    AutocompleteLibModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
  ]
})
export class PatientQuestionnaireModule { }
