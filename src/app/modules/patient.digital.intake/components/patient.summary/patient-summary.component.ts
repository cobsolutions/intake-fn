import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { PatientEssentialInformation } from 'src/app/modules/patient.questionnaire/models/intake/essential/patient.essential.information';
import { PatientMedical } from "src/app/modules/patient.questionnaire/models/intake/medical/patient.medical";
import { PatientMedicalHistory } from 'src/app/modules/patient.questionnaire/models/intake/medical/patient.medical.history';
import { PatientPhysicalTherapy } from 'src/app/modules/patient.questionnaire/models/intake/medical/patient.physical.therapy';
import { Patient } from 'src/app/modules/patient.questionnaire/models/intake/patient';
import { PatientAgreement } from 'src/app/modules/patient.questionnaire/models/intake/patient.agreement';
import { PatientGrantor } from 'src/app/modules/patient.questionnaire/models/intake/patient.grantor';
import { ReferringProvider } from 'src/app/modules/patient.questionnaire/models/intake/referring.provider/referring.provider';
import { PatientSignature } from 'src/app/modules/patient.questionnaire/models/patient/signature.model';
import { PatientAddress } from '../../models/patient.address';
import { ComponentReferenceComponentService } from '../../services/component.reference/component-reference-component.service';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';

@Component({
  selector: 'patient-summary',
  templateUrl: './patient-summary.component.html',
  styleUrls: ['./patient-summary.component.css']
})
export class PatientSummaryComponent implements OnInit {
  @Input() form: FormGroup;
  pateint: Patient = {}
  patientSignature: PatientSignature = new PatientSignature();
  clinicId: string;
  submitting: boolean = false;
  constructor(private componentReference: ComponentReferenceComponentService
    , private digitalIntakeService: DigitalIntakeService
    , private router: Router
    , private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.fillPateintEssentialInformation();
    this.fillPatientAddress();
    this.fillPatientSource();
    this.fillPatientMedicalInformation();
    this.fillPatientMedicalHistoryInformation();
    this.fillPatientInsurance();
    this.fillPatientAgreement();
    this.getSignture()
    this.getPhoto();
    this.clinicId = localStorage.getItem('clinicId') || '';
  }
  submit() {
    this.submitting = true
    var imageFormData = new FormData();
    this.componentReference.getPatientDocumentComponent()!.getFormDate().forEach((patientDocument: any) => {
      imageFormData.append('files', patientDocument, patientDocument.name);
    })
    this.pateint.clinicIdUUID = this.clinicId;
    console.log(JSON.stringify(this.pateint))
    imageFormData.append('patient', new Blob([JSON.stringify(this.pateint)], { type: 'application/json' }));
    this.digitalIntakeService.create(imageFormData)
      .subscribe(resuldd => {
        this.submitting = false;
        this.router.navigateByUrl('/digital-intake/done?token=' + this.digitalIntakeService.token);
      }, error => {
        this.submitting = false;
        this.toastrService.error(JSON.stringify(error))
        console.log('Error During Creation ' + JSON.stringify(error))
      })
  }
  private fillPateintEssentialInformation() {
    var patientEssentialInformation: PatientEssentialInformation = {}
    this.form.get('basic')?.valueChanges.forEach(selected => {
      patientEssentialInformation = {
        patientName: {
          firstName: selected.firstname,
          middleName: selected.middleName,
          lastName: selected.lastName,
        },
        birthDate_str: moment(selected.dob).format("MM/DD/YYYY"),
        dateOfBirth: Number(moment(selected.dob).format("x")),
        gender: selected.gender,
        maritalStatus: selected.marital,
        patientPhone: {
          phoneType: selected.phoneType,
          phone: selected.phone
        },
        email: selected.email,
        patientEmployment: {
          employmentStatus: selected.employment,
          employmentCompany: selected.employmentCompany
        },
        patientEmergencyContact: {
          emergencyName: selected.emergencyName,
          emergencyPhone: selected.emergencyPhone,
          emergencyRelation: selected.emergencyContact
        },
        address: {

        }
      };
      var patientAge = moment().diff(selected.dob, 'y')
      var isGuarantor: boolean = patientAge < 18 ? true : false;
      if (isGuarantor) {
        var patientGrantor: PatientGrantor = {
          firstName: selected.guarantorFirstName,
          middleName: selected.guarantorMiddleName,
          lastName: selected.guarantorLastName,
          relation: selected.guarantorRelationship
        };
        this.pateint.patientGrantor = patientGrantor;
      } else {
        this.pateint.patientGrantor = undefined;
      }
      this.pateint.patientEssentialInformation = patientEssentialInformation
    })
  }
  private fillPatientAddress() {
    var address: PatientAddress = {}
    this.form.get('address')?.valueChanges.forEach(selected => {
      address = {
        firstAddress: selected.firstAddress,
        secondAddress: selected.secondAddress,
        city: selected.city,
        state: selected.state,
        zipCode: selected.zipCode
      };
      this.pateint.patientAddress = address
    })
  }
  private fillPatientSource() {
    this.form.get('medical')?.get('referringEntity')?.valueChanges.subscribe(value => {
      this.pateint.patientIncomingSource = value;
    })
    var referringProvider: ReferringProvider = {}
    this.form.get('medical')?.get('providerName')?.valueChanges.subscribe(value => {
      console.log('provider name value  ' + value)
      referringProvider.npi = value;
      this.pateint.referringProvider = referringProvider;
    })
    this.form.get('medical')?.get('providerNPI')?.valueChanges.subscribe(value => {
      console.log('provider npi value  ' + value)
      referringProvider.name = value;
      this.pateint.referringProvider = referringProvider;
    })
  }

  private fillPatientMedicalInformation() {
    var patientMedical: PatientMedical = {}
    var patientPhysicalTherapy: PatientPhysicalTherapy = {}
    this.form.get('medical')?.valueChanges.forEach(selected => {
      patientMedical.appointmentBooking = selected.appointmentBooking;
      patientMedical.primaryDoctor = selected.isPrimaryDoctor
      // patientMedical.familyResultSubmission = selected.isFamilyDoctorRequest
      this.pateint.patientMedical = patientMedical;
    })
    this.form.get('medical')?.get('isReceivedPhysicalTherapy')?.valueChanges.subscribe(value => {
      if (value === 'yes') {
        this.form.get('medical')?.get('PhysicalTherapyLocation')?.valueChanges.subscribe(value => {
          patientPhysicalTherapy.location = value
        })
        this.form.get('medical')?.get('PhysicalTherapyNumber')?.valueChanges.subscribe(value => {
          patientPhysicalTherapy.numberOfVisit = value
        })
        this.pateint.patientMedical!.hasPatientPhysicalTherapy = true;
        this.pateint.patientMedical!.patientPhysicalTherapy = patientPhysicalTherapy;
      } else {
        this.pateint.patientMedical!.hasPatientPhysicalTherapy = false;
        this.pateint.patientMedical!.patientPhysicalTherapy = undefined
      }

    })
  }
  private fillPatientMedicalHistoryInformation() {
    var patientMedicalHistory: PatientMedicalHistory = {};
    this.form.get('medicalhistory')?.valueChanges.forEach(select => {
      patientMedicalHistory.height = select.height
      patientMedicalHistory.heightUnit = select.heightUnit ? 'Inch' : 'cm'
      var height: string[] = this.calculateHeight(select.heightUnit, select.height)
      patientMedicalHistory.height = height[0]
      patientMedicalHistory.heightFT = height[1]
      patientMedicalHistory.weight = select.weight
      patientMedicalHistory.weightUnit = select.weightUnit ? 'kg' : 'pound'
      var weight: string[] = this.calculateWeight(select.weightUnit, select.weight)
      patientMedicalHistory.weight = weight[0]
      patientMedicalHistory.weightPN = weight[1]
      patientMedicalHistory.evaluationSubmission = select.evaluationReason;
      patientMedicalHistory.patientCondition = select.patientConditionsSelections
      patientMedicalHistory.medicationPrescription = select.prescriptionMedications
      patientMedicalHistory.medicationPrescriptionText = select.PhysicalTherapyLocationText
      patientMedicalHistory.scanningTest = select.isXRay === 'yes' ? true : false
      patientMedicalHistory.scanningTestValue = select.isXRayValue
      patientMedicalHistory.pacemaker = select.isPacemaker === 'yes' ? true : false
      patientMedicalHistory.metalImplantation = select.isMetalImplants === 'yes' ? true : false
      patientMedicalHistory.surgeriesList = select.surgeriesList
      if (this.pateint.patientMedical !== undefined)
        this.pateint.patientMedical.patientMedicalHistory = patientMedicalHistory
    })
  }
  private fillPatientInsurance() {
    this.form.get('insurance')?.valueChanges.forEach(select => {
      if (select.insurances !== null) {
        this.pateint.insurances = select.insurances
      }
    })
  }
  private fillPatientAgreement() {
    // var patientAgreement: PatientAgreement = {}
    var map: Map<string, boolean> = new Map<string, boolean>();
    this.form.get('agreement')?.valueChanges.forEach(value => {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          map.set(key, value[key]);
        }
      }
      const filteredMap = new Map(
        [...map].filter(([key, value]) => value !== null)
      );
      this.pateint.patientAgreements = Object.fromEntries(filteredMap);
    })
  }
  private getSignture() {
    this.form.get('signature')?.get('generatesign')?.valueChanges.subscribe((valu: any) => {
      console.log(valu)
      this.patientSignature.signature = valu;
      this.pateint.signature = valu;
    })
    this.form.get('signature')?.get('drawsign')?.valueChanges.subscribe(valu => {
      console.log(valu)
      this.pateint.signature = valu;
      this.patientSignature.signature = valu;
    })
  }

  private getPhoto() {
    this.form.get('bio')?.get('capturedImage')?.valueChanges.subscribe((valu: any) => {
      this.pateint.photo = valu;
    })
  }
  private calculateHeight(unit: boolean, value: string): string[] {
    var heightUnit: string = unit ? 'Inch' : 'cm'
    var height: string[] = []
    switch (heightUnit) {
      case 'cm':
        height[0] = value;
        height[1] = Number((Number(value) * 0.032808).toFixed(1)).toString();
        break;
      case 'Inch':
        height[0] = Math.round(Number(value) / 0.032808).toString();
        height[1] = value;
        break;
    }
    return height;
  }
  private calculateWeight(unit: boolean, value: string): string[] {
    var weightUnit: string = unit ? 'kg' : 'pound'
    var weight: string[] = []
    switch (weightUnit) {
      case 'kg':
        weight[0] = value;
        weight[1] = Number((Number(value) / 2.20462).toFixed(1)).toString();
        break;
      case 'pound':
        weight[0] = Math.round(Number(value) * 2.20462).toString()
        weight[1] = value
        break;
    }
    return weight;
  }
}
