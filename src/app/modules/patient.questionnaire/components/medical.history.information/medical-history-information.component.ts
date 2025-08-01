import { Component, Input, OnInit } from '@angular/core';
import { MedicalHistroyInformation } from 'src/app/models/questionnaire/medical/history/medical.history.info';
import { MedicalHistoryInformation } from 'src/app/models/validation/new/medical.history.information';
import { MdicalHistoryValidator } from 'src/app/validators/patient.validator/patient.medical.history.validator';
import { ValidatorContainer } from 'src/app/validators/ValidatorContainer';
import { PatientMedicalHistory } from '../../models/intake/medical/patient.medical.history';
import { PatientStoreService } from '../../service/store/patient-store.service';
import { IPatientCondition } from './patient.condition';

@Component({
  selector: 'app-medical-history-information',
  templateUrl: './medical-history-information.component.html',
  styleUrls: ['./medical-history-information.component.css']
})
export class MedicalHistoryInformationComponent implements OnInit {
  model: MedicalHistroyInformation = new MedicalHistroyInformation();
  patientMedicalHistory?: PatientMedicalHistory;
  @Input() requiredFields?: MedicalHistoryInformation;
  isScanning: string = '';
  isMetalImplantation: string = '';
  isPacemaker: string = ''
  patientConditions: IPatientCondition[];
  heightUnit: boolean = false;
  weightUnit: boolean = false;
  constructor(private patientStoreService: PatientStoreService) { }

  ngOnInit(): void {
    this.createPatientConditions();
    if (this.patientStoreService.patientMedicalHistory === undefined) {
      this.patientMedicalHistory = {
        scanningTestValue: []
      }
    } else {
      this.patientMedicalHistory = this.patientStoreService.patientMedicalHistory;
      this.isScanning = this.patientStoreService.patientMedicalHistory.scanningTest ? 'yes' : 'no'
      this.isMetalImplantation = this.patientStoreService.patientMedicalHistory.metalImplantation ? 'yes' : 'no'
      this.isPacemaker = this.patientStoreService.patientMedicalHistory.pacemaker ? 'yes' : 'no'
    }
  }


  scanningChange(val: string) {
    this.isScanning = val;

    if (val === 'yes') {
      this.patientMedicalHistory!.scanningTest = true
    } else {
      this.patientMedicalHistory!.scanningTestValue = []
      this.patientMedicalHistory!.scanningTest = false;
    }
  }
  metalImplantsChange(val: string) {
    this.isMetalImplantation = val;
    val === 'yes' ? this.patientMedicalHistory!.metalImplantation = true : this.patientMedicalHistory!.metalImplantation = false;
  }
  paceMakerChange(val: string) {
    this.isPacemaker = val;
    val === 'yes' ? this.patientMedicalHistory!.pacemaker = true : this.patientMedicalHistory!.pacemaker = false;
  }
  createPatientConditions() {
    this.patientConditions =
      [{
        name: "Alzheimer's",
        selected: false
      }, {
        name: "Cardiovascular Disease",
        selected: false
      },
      {
        name: "Cauda Equina Syndrome",
        selected: false
      }, {
        name: "Cerebral Vascular Accident",
        selected: false
      }, {
        name: "Current Infection",
        selected: false
      }, {
        name: "Diabetes Mellitus Type 1",
        selected: false
      }, {
        name: "Diabetes Mellitus Type 2",
        selected: false
      }, {
        name: "Fibromyalgia",
        selected: false
      }, {
        name: "Fracture",
        selected: false
      }, {
        name: "History of Cancer",
        selected: false
      },
      {
        name: "Huntington's",
        selected: false
      }, {
        name: "Immunosuppression",
        selected: false
      }, {
        name: "Lupus",
        selected: false
      }, {
        name: "Muscular Dystrophy",
        selected: false
      }, {
        name: "Parkinson's",
        selected: false
      }, {
        name: "Obesity",
        selected: false
      }, {
        name: "Osteoarthritis",
        selected: false
      },
      {
        name: "Rheumatoid Arthritis",
        selected: false
      },
      {
        name: "Traumatic Brain Injury",
        selected: false
      }
      ]
  }
  changeHeightUnit(event: any) {
    if (this.heightUnit) {
      this.patientMedicalHistory!.heightUnit = 'cm'
      this.patientMedicalHistory!.height = (Number(this.patientMedicalHistory!.height) / 0.3937).toFixed(2) + '';
    }
    if (!this.heightUnit) {
      this.patientMedicalHistory!.heightUnit = 'inch'
      this.patientMedicalHistory!.height = (Number(this.patientMedicalHistory!.height) * 0.3937).toFixed(2) + '';
    }
  }

  changeWeightUnit(event: any) {
    if (this.weightUnit) {
      this.patientMedicalHistory!.weightUnit = 'kg'
      this.patientMedicalHistory!.weight = (Number(this.patientMedicalHistory!.weight) * 0.45359237).toFixed(2) + '';
    }
    if (!this.weightUnit) {
      this.patientMedicalHistory!.weightUnit = 'pound'
      this.patientMedicalHistory!.weight = (Number(this.patientMedicalHistory!.weight) / 0.45359237).toFixed(2) + '';
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
    var patientValidator = new MdicalHistoryValidator(this.patientMedicalHistory || {}, this.requiredFields!)
    return patientValidator.validate();
  }
}
