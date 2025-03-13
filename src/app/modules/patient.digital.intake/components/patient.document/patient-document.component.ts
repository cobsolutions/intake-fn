import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
import { ComponentReferenceComponentService } from '../../services/component.reference/component-reference-component.service';
import { CompressDocumentService } from '../../services/doument/compress-document.service';
import { CheckInvalidForm } from '../../util/invalid.form';
import { imageDocumentValidator } from '../create/validators/custom.validation/document.image.validator';
import { ValidationExploder } from '../create/validators/validation.exploder';

@Component({
  selector: 'patient-document',
  templateUrl: './patient-document.component.html',
  styleUrls: ['./patient-document.component.css']
})
export class PatientDocumentComponent implements OnInit, AfterViewInit {
  @Input() stepper: MatStepper
  isValidForm: boolean = false;
  fileMap: Map<string, File> = new Map();
  isGuarantor: boolean = false
  isMaxSize: boolean = false;
  excceedControl: string;
  patientInsurances: any[] = [];
  documentControlersNames: string[] = ['id-front', 'id-back'];
  @Input() form: FormGroup;

  constructor(private componentReference: ComponentReferenceComponentService
    , private compressDocumentService: CompressDocumentService) {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.componentReference.setPatientDocumentComponent(this)
    this.initForm();

    this.componentReference.getPatientInsuranceComponent()?.form.get('insurance')?.get('insurances')?.valueChanges.subscribe(value => {
      if (value !== null && value.commercialInsurances!.length > 0) {
        this.patientInsurances.push(...value.commercialInsurances)
        var doumentControllerName_front: string = '';
        var doumentControllerName_back: string = '';
        for (let i = 0; i < value.commercialInsurances?.length; i++) {
          doumentControllerName_front = value.commercialInsurances[i]._frontcontrollName;
          (this.form.get('document') as FormArray).push(new FormGroup({ [doumentControllerName_front]: new FormControl(null, [imageDocumentValidator()]) }))
          doumentControllerName_back = value.commercialInsurances[i]._backcontrollName;
          (this.form.get('document') as FormArray).push(new FormGroup({ [doumentControllerName_back]: new FormControl(null, [imageDocumentValidator()]) }))
        }
      }
      if (value !== null && value.workerCompensationInsurances?.length > 0) {
        this.patientInsurances.push(...value.workerCompensationInsurances)
        var doumentControllerName_front: string = '';
        var doumentControllerName_back: string = '';
        for (let i = 0; i < value.workerCompensationInsurances?.length; i++) {
          doumentControllerName_front = value.workerCompensationInsurances[i]._frontcontrollName;
          (this.form.get('document') as FormArray).push(new FormGroup({ [doumentControllerName_front]: new FormControl(null, [imageDocumentValidator()]) }))
          doumentControllerName_back = value.workerCompensationInsurances[i]._backcontrollName;
          (this.form.get('document') as FormArray).push(new FormGroup({ [doumentControllerName_back]: new FormControl(null, [imageDocumentValidator()]) }))
        }
      }
      if (value !== null && value.medicareInsurance?.length > 0) {
        this.patientInsurances.push(...value.medicareInsurance)
        var doumentControllerName_front: string = '';
        var doumentControllerName_back: string = '';
        for (let i = 0; i < value.medicareInsurance?.length; i++) {
          doumentControllerName_front = value.medicareInsurance[i]._frontcontrollName;
          (this.form.get('document') as FormArray).push(new FormGroup({ [doumentControllerName_front]: new FormControl(null, [imageDocumentValidator()]) }))
          doumentControllerName_back = value.medicareInsurance[i]._backcontrollName;
          (this.form.get('document') as FormArray).push(new FormGroup({ [doumentControllerName_back]: new FormControl(null, [imageDocumentValidator()]) }))
        }
      }
      if (value !== null && value.medicaidInsurance?.length > 0) {
        this.patientInsurances.push(...value.medicaidInsurance)
        var doumentControllerName_front: string = '';
        var doumentControllerName_back: string = '';
        for (let i = 0; i < value.medicaidInsurance?.length; i++) {
          doumentControllerName_front = value.medicaidInsurance[i]._frontcontrollName;
          (this.form.get('document') as FormArray).push(new FormGroup({ [doumentControllerName_front]: new FormControl(null, [imageDocumentValidator()]) }))
          doumentControllerName_back = value.medicaidInsurance[i]._backcontrollName;
          (this.form.get('document') as FormArray).push(new FormGroup({ [doumentControllerName_back]: new FormControl(null, [imageDocumentValidator()]) }))
        }
      }
    })
    this.componentReference.getPatientBasicComponent()?.form.get('basic')?.get('dob')?.valueChanges.subscribe(value => {
      this.isGuarantor = this.componentReference.getPatientBasicComponent()!.isGuarantor
      var patientAge = moment().diff(value, 'y')
      this.isGuarantor = patientAge < 18 ? true : false;
    })

  }
  public onImageUpload(event: any, photoType: string, name: string) {
    console.log(event.target.value)
    if (event.target.files[0].size / (1024 * 1024) > 50) {
      this.isMaxSize = true;
      this.form.get('document')?.get('0')?.get(name)?.setValue(null);
      this.excceedControl = name;
    } else {
      this.isMaxSize = false;
    }
    this.compressDocumentService.setuploadedImages(this.fileMap);
    this.compressDocumentService.onImageUpload(event, photoType)
  }
  public getFormDate() {
    //this.clearfilMap();
    var imageFormData = new FormData();
    for (const [key, value] of this.fileMap) {
      imageFormData.append('files', value, key);
    }
    return imageFormData;
  }
  private clearfilMap() {
    this.fileMap.delete('patientIdfront')
    this.fileMap.delete('patientIdback')
  }
  next() {
    CheckInvalidForm.check(this.form.get('document') as FormGroup);
    if (this.form.get('document')?.valid) {
      this.stepper.next();
      this.isValidForm = false;
    } else {
      this.isValidForm = true;
      ValidationExploder.explodeWithIndex(this.form, 'document', '0')
    }
  }
  private initForm() {
    (this.form.get('document') as FormArray).push(
      new FormGroup({
        'id-front': new FormControl(null, [Validators.required, imageDocumentValidator()]),
        'id-back': new FormControl(null, [Validators.required, imageDocumentValidator()]),
      })
    );
  }
  get document(): FormArray {
    return this.form.get('document') as FormArray;
  }
}
