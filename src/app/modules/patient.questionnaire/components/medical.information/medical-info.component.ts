import { Component, Input, OnInit } from '@angular/core';
import { MedicalQuestionnaireInfo } from 'src/app/models/questionnaire/medical.questionnaire.info';
import { MedicalInformation } from 'src/app/models/validation/new/medical.information';
import { Doctors } from 'src/app/modules/common/data/doctor.db';
import { Doctor } from 'src/app/modules/common/model/doctor';
import entityValues from 'src/app/modules/patient.admin/components/reports/_entity.values';
import { PatientMedicalQuestionnaireValidator } from 'src/app/validators/patient.validator/patient.medical.questionnaire.validator';
import { ValidatorContainer } from 'src/app/validators/ValidatorContainer';
import { PatientMedical } from '../../models/intake/medical/patient.medical';
import { DoctorSource } from '../../models/intake/source/doctor.source';
import { PatientSource } from '../../models/intake/source/patient.source';
import { PatientStoreService } from '../../service/store/patient-store.service';
@Component({
  selector: 'app-medical-info',
  templateUrl: './medical-info.component.html',
  styleUrls: ['./medical-info.component.css']
})
export class MedicalInfoComponent implements OnInit {
  keyword = 'name';
  selectedNPI: string;
  public doctors: Doctor[] = Doctors;
  selectedDoctor: string;
  selectEvent(item: Doctor) {
    this.patientSource!.doctorSource!.doctorName = item.name!;
    this.patientSource!.doctorSource!.doctorNPI = item.npi!;
    this.patientSource!.doctorSource!.isPotential = false;
  }
  onChangeSearch(search: string) {
    if (search === undefined || search === '') {
      this.patientSource!.doctorSource!.doctorName = '';
      this.patientSource!.doctorSource!.doctorNPI = '';
      this.patientSource!.doctorSource!.isPotential = undefined;
    }
  }

  onFocused(e: any) {
  }
  isReferringDoctor: string | undefined = undefined;
  ispatientPhysicalTherapy: string | undefined = undefined;
  isfamilyResultSubmission: string | undefined = undefined;
  //isfamilyResultSubmission: string = '';
  medicalQuestionnaireInfo: MedicalQuestionnaireInfo;
  patientMedical?: PatientMedical;
  patientSource?: PatientSource = {};
  @Input() requiredFields?: MedicalInformation;
  entityValues = entityValues;
  constructor(private patientStoreService: PatientStoreService) { }

  referringDoctorQChange(val: string) {
    this.isReferringDoctor = val;
    val === 'yes' ? this.patientSource!.doctorSource = {} : this.patientSource!.entitySource = {};
    if (val === 'yes') {
      this.patientSource!.doctorSource = {
        doctorName: '',
        doctorNPI: ''
      }
      this.patientSource!.entitySource = undefined;
    } else {
      this.patientSource!.entitySource = {
        organizationName: '',
      }
      this.patientSource!.doctorSource = undefined;
    }
  }
  physicalTherapyQChange(value: string) {
    this.patientMedical!.patientPhysicalTherapy = value === 'yes' ? {} : undefined
    this.patientMedical!.hasPatientPhysicalTherapy = value === 'yes' ? true : false;
    this.ispatientPhysicalTherapy = value;

  }
  resultsfamilyQChange(val: string) {
    // this.patientMedical!.familyResultSubmission = val === 'yes' ? true : false
    this.isfamilyResultSubmission = val;
  }
  ngOnInit(): void {
    if (this.patientStoreService.patientMedical === undefined) {
      this.patientMedical = {
        patientMedicalHistory: {},
        appointmentBooking: ''
      }
    } else {
      this.patientMedical = this.patientStoreService.patientMedical;
      this.patientSource = this.patientStoreService.patientSource;
      this.isReferringDoctor = this.patientStoreService.patientSource?.doctorSource ? 'yes' : 'no'
      this.ispatientPhysicalTherapy = this.patientStoreService.patientMedical.hasPatientPhysicalTherapy ? 'yes' : 'no'
      // this.isfamilyResultSubmission = this.patientStoreService.patientMedical.familyResultSubmission ? 'yes' : 'no'
    }
  }
  isRequiredField(name: string): boolean {
    var field: boolean = false;
    Object.entries(this.requiredFields!)
      .forEach(([key, value]) => {
        if (key === name) {
          field = value;
        }
      })
    return field;
  }
  public validate(): ValidatorContainer {
    var patientValidator = new PatientMedicalQuestionnaireValidator(this.patientMedical || {}, this.patientSource || {},
      this.requiredFields!);
    return patientValidator.validate();
  }
}
