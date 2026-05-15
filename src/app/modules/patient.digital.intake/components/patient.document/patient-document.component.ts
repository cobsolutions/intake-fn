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
  @Input() stepper: MatStepper;
  isValidForm: boolean = false;
  fileMap: Map<string, File> = new Map();
  thumbnails: { [name: string]: string } = {};
  fileNames: { [name: string]: string } = {};
  isGuarantor: boolean = false;
  isMaxSize: boolean = false;
  excceedControl: string;
  patientInsurances: any[] = [];
  documentControlersNames: string[] = ['id-front', 'id-back'];
  @Input() form: FormGroup;

  constructor(
    private componentReference: ComponentReferenceComponentService,
    private compressDocumentService: CompressDocumentService
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.componentReference.setPatientDocumentComponent(this);
    this.initForm();

    this.componentReference.getPatientInsuranceComponent()?.form.get('insurance')?.get('insurances')?.valueChanges.subscribe(value => {
      this.patientInsurances = [];
      if (value !== null && value.commercialInsurances?.length > 0) {
        this.patientInsurances.push(...value.commercialInsurances);
        for (let i = 0; i < value.commercialInsurances.length; i++) {
          this.ensureControl(value.commercialInsurances[i]._frontcontrollName);
          this.ensureControl(value.commercialInsurances[i]._backcontrollName);
        }
      }
      if (value !== null && value.workerCompensationInsurances?.length > 0) {
        this.patientInsurances.push(...value.workerCompensationInsurances);
        for (let i = 0; i < value.workerCompensationInsurances.length; i++) {
          this.ensureControl(value.workerCompensationInsurances[i]._frontcontrollName);
          this.ensureControl(value.workerCompensationInsurances[i]._backcontrollName);
        }
      }
      if (value !== null && value.medicareInsurance?.length > 0) {
        this.patientInsurances.push(...value.medicareInsurance);
        for (let i = 0; i < value.medicareInsurance.length; i++) {
          this.ensureControl(value.medicareInsurance[i]._frontcontrollName);
          this.ensureControl(value.medicareInsurance[i]._backcontrollName);
        }
      }
      if (value !== null && value.medicaidInsurance?.length > 0) {
        this.patientInsurances.push(...value.medicaidInsurance);
        for (let i = 0; i < value.medicaidInsurance.length; i++) {
          this.ensureControl(value.medicaidInsurance[i]._frontcontrollName);
          this.ensureControl(value.medicaidInsurance[i]._backcontrollName);
        }
      }
    });

    this.componentReference.getPatientBasicComponent()?.form.get('basic')?.get('dob')?.valueChanges.subscribe(value => {
      this.isGuarantor = this.componentReference.getPatientBasicComponent()!.isGuarantor;
      const patientAge = moment().diff(value, 'y');
      this.isGuarantor = patientAge < 18;
    });
  }

  public onImageUpload(event: any, photoType: string, name: string) {
    const file: File | undefined = event?.target?.files?.[0];
    if (!file) return;

    if (file.size / (1024 * 1024) > 50) {
      this.isMaxSize = true;
      this.form.get('document')?.get('0')?.get(name)?.setValue(null);
      this.excceedControl = name;
      return;
    } else {
      this.isMaxSize = false;
    }

    const reader = new FileReader();
    reader.onload = (ev: any) => {
      this.thumbnails[name] = ev.target.result;
      this.fileNames[name] = file.name;
    };
    reader.readAsDataURL(file);

    this.compressDocumentService.setuploadedImages(this.fileMap);
    this.compressDocumentService.onImageUpload(event, photoType);
  }

  public removeUploadedDocument(name: string, controlPath: 'idDoc' | 'insurance'): void {
    delete this.thumbnails[name];
    delete this.fileNames[name];
    this.fileMap.delete(name);
    if (controlPath === 'idDoc') {
      this.form.get('document')?.get('0')?.get(name)?.setValue(null);
      this.form.get('document')?.get('0')?.get(name)?.markAsUntouched();
    } else {
      const docArray = this.form.get('document') as FormArray;
      for (let i = 0; i < docArray.length; i++) {
        const grp = docArray.at(i) as FormGroup;
        if (grp.get(name)) {
          grp.get(name)?.setValue(null);
          grp.get(name)?.markAsUntouched();
          break;
        }
      }
    }
  }

  public hasFile(name: string): boolean {
    return !!this.thumbnails[name];
  }

  public getFormDate() {
    const imageFormData = new FormData();
    for (const [key, value] of this.fileMap) {
      imageFormData.append('files', value, key);
    }
    return imageFormData;
  }

  public uploadedDocumentsCount(): number {
    return Object.keys(this.thumbnails).length;
  }

  public uploadedDocumentNames(): string[] {
    return Object.keys(this.fileNames);
  }

  public insuranceTypeLabel(type: string): string {
    switch (type) {
      case 'worker':     return "Worker's Compensation";
      case 'auto_acc':   return 'Auto Accident';
      case 'commercial': return 'Commercial Insurance';
      case 'medicare':   return 'Medicare';
      case 'medicaid':   return 'Medicaid';
      default: return type;
    }
  }

  public insuranceMeta(insurance: any): string {
    if (insurance.type === 'worker' || insurance.type === 'auto_acc') {
      return insurance.insuranceName ? `Insurance Co.: ${insurance.insuranceName}` : '';
    }
    if (insurance.type === 'commercial') {
      return insurance.name ? `Insurance Co.: ${insurance.name}` : '';
    }
    if (insurance.type === 'medicare' || insurance.type === 'medicaid') {
      return insurance.policyId ? `Policy: ${insurance.policyId}` : '';
    }
    return '';
  }

  next() {
    CheckInvalidForm.check(this.form.get('document') as FormGroup);
    if (this.form.get('document')?.valid) {
      this.stepper.next();
      this.isValidForm = false;
    } else {
      this.isValidForm = true;
      ValidationExploder.explodeWithIndex(this.form, 'document', '0');
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

  private ensureControl(controlName: string): void {
    const docArray = this.form.get('document') as FormArray;
    for (let i = 0; i < docArray.length; i++) {
      const grp = docArray.at(i) as FormGroup;
      if (grp.get(controlName)) return;
    }
    docArray.push(new FormGroup({ [controlName]: new FormControl(null, [imageDocumentValidator()]) }));
  }

  get document(): FormArray {
    return this.form.get('document') as FormArray;
  }
}
