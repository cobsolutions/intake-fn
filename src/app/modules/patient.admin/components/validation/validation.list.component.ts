import { Component, OnInit } from '@angular/core';
import { PatientField } from 'src/app/models/validation/new/patient.field';
import { ClinicService } from '../../services/clinic/clinic.service';
import { PatientRequiredFieldsService } from '../../services/patient.required.fields.service';
export interface WorkerTypes {
  typeName: string,
  typeValue: string
}
@Component({
  selector: 'app-validation.list',
  templateUrl: './validation.list.component.html',
  styleUrls: ['./validation.list.component.css']
})

export class ValidationListComponent implements OnInit {
  patientFields: PatientField;
  isBasicInfoReuqiredChanged: boolean = false;
  isMedicalInfoReuqiredChanged: boolean = false;
  isMedicalHistoryInfoReuqiredChanged: boolean = false;
  isInsuranceInfoReuqiredChanged: boolean = false;
  workersTypes: WorkerTypes[] = [
    { typeName: 'CompensationNoFault', typeValue: 'comp' },
    { typeName: 'Commercial', typeValue: 'commercial' }
  ]
  workerType: string = '';
  constructor(private clinicService: ClinicService , private patientRequiredFieldsService: PatientRequiredFieldsService) { }

  ngOnInit(): void {
    this.retrieveBaiscInfoRequiredFields();
  }
  changeRequiredFields(model: string) {
    this.patientRequiredFieldsService.change(this.patientFields).subscribe(
      (response) => {
        this.handleInfoFlags(model, true);
        setTimeout(() => {
          this.handleInfoFlags(model, false);
        }, 2000);
      },
      (error) => {
        this.handleInfoFlags(model, false);
        console.log(error);
      });
  }
  handleInfoFlags(model: string, value: boolean) {
    if (model === 'basic')
      this.isBasicInfoReuqiredChanged = value
    if (model === 'medical')
      this.isMedicalInfoReuqiredChanged = value
    if (model === 'medical-history')
      this.isMedicalHistoryInfoReuqiredChanged = value;
    if (model === 'insurance')
      this.isInsuranceInfoReuqiredChanged = value;
  }
  retrieveBaiscInfoRequiredFields() {
    this.clinicService.selectedClinic$.subscribe(clinicId=>{
      this.patientRequiredFieldsService.retrieve(clinicId!).subscribe(patientFields => {
        if (patientFields !== null) {
          this.patientFields = <PatientField>patientFields;;
        } else {
          this.patientFields ={
            essentialInformation:{},
            addressInformation:{},
            medicalInformation:{},
            medicalHistoryInformation:{},
            insuranceCompensationInformation:{},
            insuranceCommercialInformation:{},
          }
        }
      });
    })
   
  }
}
