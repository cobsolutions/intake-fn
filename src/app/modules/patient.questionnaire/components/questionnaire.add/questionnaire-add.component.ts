import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PatientField } from 'src/app/models/validation/new/patient.field';
import { PatientRequiredFieldsService } from 'src/app/modules/patient.admin/services/patient.required.fields.service';
import { PateintFilesValidator } from 'src/app/validators/patient.files.validator';
import { PatientAggreementsValidator } from 'src/app/validators/patient.validator/patient.aggreements.validator';
import { ValidatorContainer } from 'src/app/validators/ValidatorContainer';
import { Patient } from '../../models/intake/patient';
import { PatientSignature } from '../../models/patient/signature.model';
import { PatientService } from '../../service/patient.service';
import { PatientStoreService } from '../../service/store/patient-store.service';
import { AddressInformationComponent } from '../address.information/address-information.component';
import { AggreementsComponent } from '../aggreements/aggreements.component';
import { EssentialInfoComponent } from '../essential.info/essential-info.component';
import { InsuranceInformationComponent } from '../insurance.information/insurance-information.component';
import { MedicalHistoryInformationComponent } from '../medical.history.information/medical-history-information.component';
import { MedicalInfoComponent } from '../medical.information/medical-info.component';
import { PatientsignatureComponent } from '../signature/patientsignature.component';
import { UploadPhotoComponent } from '../upload.photos/upload-photo.component';


@Component({
  selector: 'app-questionnaire-add',
  templateUrl: './questionnaire-add.component.html',
  styleUrls: ['./questionnaire-add.component.css']
})
export class QuestionnaireAddComponent implements OnInit {
  clinicId: number;
  isCreated: boolean = false;
  isClinicIdEmpty: boolean = false;
  cards: { id: number, name: string }[] = [
    { "id": 1, "name": "Basic Information" },
    { "id": 2, "name": "Address Information" },
    { "id": 3, "name": "Medical Information" },
    { "id": 4, "name": "Medical History Information" },
    { "id": 5, "name": "Insurance Information" },
    { "id": 6, "name": "Upload Photos" },
    { "id": 7, "name": "Aggreements" },
    { "id": 8, "name": "Signature" },

  ];

  counter: number;
  progressValue: number;
  windowScrolled: boolean = true;
  validator: ValidatorContainer;
  isPatientUnderage: boolean = false;
  patientFields: PatientField;
  formFiles: FormData;
  @ViewChild(EssentialInfoComponent) essentialInfoComponent: EssentialInfoComponent;
  @ViewChild(AddressInformationComponent) addressInformationComponent: AddressInformationComponent;
  @ViewChild(MedicalInfoComponent) medicalInfoComponent: MedicalInfoComponent;
  @ViewChild(MedicalHistoryInformationComponent) medicalHistoryInformationComponent: MedicalHistoryInformationComponent;
  @ViewChild(InsuranceInformationComponent) insuranceInformationComponent: InsuranceInformationComponent;
  @ViewChild(UploadPhotoComponent) uploadPhotoComponent: UploadPhotoComponent;
  @ViewChild(AggreementsComponent) aggreementsComponent: AggreementsComponent;
  @ViewChild(PatientsignatureComponent) patientsignatureComponent: PatientsignatureComponent;
  PatientsignatureComponentTmp: PatientsignatureComponent;
  constructor(
    private patientService: PatientService,
    private patientRequiredFieldsService: PatientRequiredFieldsService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private patientStoreService: PatientStoreService) {
  }
  ngOnInit(): void {
    this.isCreated = false;
    this.counter = 1;
    this.progressValue = 0;
    this.windowScrolled = true;
    this.isPatientUnderage = false;
    this.formFiles = new FormData();
    this.clinicId = Number(this.route.snapshot.queryParamMap.get('clinicId'));
    if (this.clinicId === 0 || this.clinicId === undefined || this.clinicId === null) {
      this.isClinicIdEmpty = true;
    } else {
      this.router.navigate([], {
        queryParams: {
          'clinicId': null,
        },
        queryParamsHandling: 'merge'
      })
    }
    this.patientRequiredFieldsService.retrieve(this.clinicId).subscribe(patientFields => {
      this.patientFields = <PatientField>patientFields;
    })
  }


  next(patientModel: string) {
    this.validator = new ValidatorContainer();
    if (patientModel === 'basic') {
      this.essentialInfoComponent?.formatDate();
      this.validator = this.essentialInfoComponent?.validate();
      if (this.validator.isValid) {
        this.patientStoreService.patientEssentialInformation = this.essentialInfoComponent.patientEssentialInformation;
        if (this.essentialInfoComponent.isPatientUnderage) {
          this.isPatientUnderage = true;
          this.patientStoreService.patientGrantor = this.essentialInfoComponent.patientGrantor;
          for (let guarantor of this.essentialInfoComponent.imageFormData) {
            this.formFiles.append(guarantor[0], guarantor[1])
          }
        } else {
          this.isPatientUnderage = false;
          this.patientStoreService.patientGrantor = undefined
        }
        this.proceedToNextStep();
      } else {
        this.scrollUp();
      }
    }
    if (patientModel === 'address') {
      this.validator = this.addressInformationComponent?.validate();
      if (this.validator.isValid) {
        this.patientStoreService.patientAddress = this.addressInformationComponent.patientAddress;
        this.proceedToNextStep();
      } else {
        this.scrollUp();
      }
    }
    if (patientModel === 'medical') {
      this.validator = this.medicalInfoComponent?.validate();
      if (this.validator.isValid) {
        this.patientStoreService.patientMedical = this.medicalInfoComponent.patientMedical;
        if (this.medicalInfoComponent.patientSource?.doctorSource) {
          if (this.medicalInfoComponent.patientSource?.doctorSource.doctorName === '')
            this.medicalInfoComponent.patientSource!.doctorSource!.doctorName = this.medicalInfoComponent.selectedDoctor;
        }
        this.patientStoreService.patientSource = this.medicalInfoComponent.patientSource;
        this.proceedToNextStep();
      } else {
        this.scrollUp();
      }
    }
    if (patientModel === 'medical-history') {
      this.validator = this.medicalHistoryInformationComponent?.validate();

      if (this.validator.isValid) {
        this.patientStoreService.patientMedicalHistory = this.medicalHistoryInformationComponent.patientMedicalHistory;
        this.proceedToNextStep();
      } else {
        this.scrollUp();
      }
    }
    if (patientModel === 'insurance') {
      this.validator = this.insuranceInformationComponent?.validate();

      if (this.validator.isValid) {
        this.insuranceInformationComponent?.store();
        this.proceedToNextStep(patientModel);
      } else {
        this.scrollUp();
      }
    }
    if (patientModel === 'upload') {
      this.validator = new PateintFilesValidator(this.uploadPhotoComponent.imageFormData).validate();
      if (this.validator.isValid) {
        for (let patientFiles of this.uploadPhotoComponent.imageFormData) {
          this.formFiles.append(patientFiles[0], patientFiles[1]);
        }
        this.proceedToNextStep();
      } else {
        this.scrollUp();
      }
    }
    if (patientModel === 'aggreements') {
      this.validator = new PatientAggreementsValidator(this.aggreementsComponent.patientAgreements || {}).validate();
      if (this.validator.isValid) {
        this.patientStoreService.patientAgreements = this.aggreementsComponent.patientAgreements
        this.proceedToNextStep();
      } else {
        this.scrollUp();
      }
    }
    if (patientModel === 'signature') {
      this.fillSignatureModel();
      this.proceedToNextStep();
    }
  }
  proceedToNextStep(patientModel?: string) {
    this.calculatePercentage(this.counter, 'next')
    this.counter++;
    if (patientModel === 'insurance' && this.isPatientUnderage)
      this.counter++;
    this.scrollUp();
  }
  back(patientModel?: string) {
    this.counter--;
    if (patientModel === 'insurance' && this.isPatientUnderage)
      this.counter--;
    this.calculatePercentage(this.counter, 'back');
    this.validator = new ValidatorContainer();
  }
  calculatePercentage(index: number, action: string) {
    if (action === 'back')
      index--;
    this.progressValue = Math.round(((index / this.cards.length) / 100) * 10000);
  }
  scrollUp() {
    (function smoothscroll() {
      var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.scrollTo(0, 0);
      }
    })();
  }
  uploadPatientSignature(patientId: number) {
    if (this.PatientsignatureComponentTmp?.signatureType === 1) {
      this.PatientsignatureComponentTmp?.draw();
      var model: PatientSignature = this.PatientsignatureComponentTmp?.model;
      model.patientId = patientId;
      this.patientService.uploadPatientSignature(model).subscribe(
        (response) => {
          console.log('uploaded drawed  patient Signature..');
        },
        (error) => {
          this.scrollUp();
          this.toastr.error(error.error.message, 'Error In Upload Images');
        });
    }
    if (this.PatientsignatureComponentTmp?.signatureType === 0) {
      this.PatientsignatureComponentTmp?.generate().then(canvas => {
        var model: PatientSignature = new PatientSignature();
        model.signature = canvas.toDataURL();
        model.patientId = patientId;
        this.patientService.uploadPatientSignature(model).subscribe(
          (response) => {
            document.getElementById("sig")!.innerHTML = ''
            document.getElementById("sig")!.hidden = true;
            console.log('uploaded generated patient Signature.. ')

          },
          (error) => {
            this.scrollUp();
            this.toastr.error(error.error.message, 'Error In Upload Images');
          });
      });;
    }
  }
  uploadPatientDocuments(patientId: number) {
    this.patientService.upload(this.formFiles, patientId).subscribe(
      (response) => {
        console.log('uploaded..')
      },
      (error) => {
        this.scrollUp();
        this.toastr.error(error.error.message, 'Error In Upload Images');
      });
  }
  submit() {
    var pateint: Patient = this.patientStoreService.getPatient();
    pateint.clinicId = ''
    this.patientService.createPatient(JSON.stringify(pateint)).subscribe(
      (response) => {
        this.uploadPatientDocuments(<number>response.body)
        this.uploadPatientSignature(<number>response.body);
        this.isCreated = true;
        setTimeout(() => {
          this.router.navigateByUrl('intake/add', { skipLocationChange: true }).then(() => {
            this.router.navigate(['intake/add'], { queryParams: { clinicId: this.clinicId } }).then(() => {
              this.patientStoreService.resetPateint()
              this.ngOnInit()
            })
          })
        }, 5000);
      },
      (error) => {
        console.log(JSON.stringify(error))
        this.toastr.error(error.error.message, 'Error In Creation');
        this.scrollUp();
      });
  }
  fillSignatureModel() {
    if (this.patientsignatureComponent !== undefined)
      this.PatientsignatureComponentTmp = this.patientsignatureComponent
  }
}
