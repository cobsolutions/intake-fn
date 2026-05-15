import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';
import { PatientEssentialInformation } from 'src/app/modules/patient.questionnaire/models/intake/essential/patient.essential.information';
import { FailedIntake } from 'src/app/modules/patient.questionnaire/models/intake/failed.intake';
import { PatientMedical } from "src/app/modules/patient.questionnaire/models/intake/medical/patient.medical";
import { PatientMedicalHistory } from 'src/app/modules/patient.questionnaire/models/intake/medical/patient.medical.history';
import { PatientPhysicalTherapy } from 'src/app/modules/patient.questionnaire/models/intake/medical/patient.physical.therapy';
import { Patient } from 'src/app/modules/patient.questionnaire/models/intake/patient';
import { PatientGrantor } from 'src/app/modules/patient.questionnaire/models/intake/patient.grantor';
import { ReferringProvider } from 'src/app/modules/patient.questionnaire/models/intake/referring.provider/referring.provider';
import { PatientSignature } from 'src/app/modules/patient.questionnaire/models/patient/signature.model';
import { PatientBasicAddress } from 'src/app/modules/patient.digital.intake/models/patient.address';

import { ComponentReferenceComponentService } from '../../services/component.reference/component-reference-component.service';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';

interface SectionStepIndex {
  photo:        number;
  basic:        number;
  medical:      number;
  history:      number;
  insurance:    number;
  agreement:    number;
  signature:    number;
  documents:    number;
}

@Component({
  selector: 'patient-summary',
  templateUrl: './patient-summary.component.html',
  styleUrls: ['./patient-summary.component.css']
})
export class PatientSummaryComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() stepper?: MatStepper;

  pateint: Patient = {};
  patientSignature: PatientSignature = new PatientSignature();
  clinicId: string;
  submitting: boolean = false;
  isError: boolean = false;
  errorMessage: string;
  loadedPatientId: number;
  confirmAccuracy: boolean = false;

  readonly stepIndex: SectionStepIndex = {
    photo:     2,
    basic:     3,
    medical:   4,
    history:   5,
    insurance: 6,
    agreement: 7,
    signature: 8,
    documents: 9
  };

  constructor(
    private componentReference: ComponentReferenceComponentService,
    private digitalIntakeService: DigitalIntakeService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.digitalIntakeService.loadedPatient$.pipe(
      filter(data => data !== null)
    ).subscribe(patient => {
      this.loadedPatientId = patient.id;
    });
    this.fillPateintEssentialInformation();
    this.fillPatientAddress();
    this.fillPatientSource();
    this.fillPatientMedicalInformation();
    this.fillPatientMedicalHistoryInformation();
    this.fillPatientInsurance();
    this.fillPatientAgreement();
    this.getSignture();
    this.getPhoto();
    this.clinicId = localStorage.getItem('clinicId') || '';
  }

  editStep(index: number): void {
    if (this.stepper) {
      this.stepper.selectedIndex = index;
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  submit() {
    this.submitting = true;
    const imageFormData = new FormData();
    this.componentReference.getPatientDocumentComponent()!.getFormDate().forEach((patientDocument: any) => {
      imageFormData.append('files', patientDocument, patientDocument.name);
    });
    this.pateint.clinicIdUUID = this.clinicId;
    if (this.loadedPatientId !== undefined)
      this.pateint.id = this.loadedPatientId;
    imageFormData.append('patient', new Blob([JSON.stringify(this.pateint)], { type: 'application/json' }));
    this.digitalIntakeService.create(imageFormData)
      .subscribe(_ => {
        this.submitting = false;
        this.isError = false;
        this.router.navigateByUrl('/digital-intake/intake-finish');
      }, error => {
        this.errorMessage = error.error?.message ?? 'Submission failed. Please try again.';
        this.submitting = false;
        this.isError = true;
        this.scrollUp();
        const failedIntake: FailedIntake = {
          patient: this.pateint,
          errorMessage: this.errorMessage
        };
        this.digitalIntakeService.failedIntake(failedIntake).subscribe(() => {});
      });
  }

  /* -------- Display helpers (used by template) -------- */

  get fullName(): string {
    const n = this.pateint.patientEssentialInformation?.patientName;
    if (!n) return '';
    return [
      this.capitalizeFirstLetter(n.firstName),
      this.capitalizeFirstLetter(n.middleName),
      this.capitalizeFirstLetter(n.lastName)
    ].filter(Boolean).join(' ');
  }

  get age(): string | null {
    const dob = this.form.get('basic')?.get('dob')?.value;
    if (!dob) return null;
    const yrs = moment().diff(dob, 'y');
    return yrs >= 0 ? `${yrs} years old` : null;
  }

  get phoneDisplay(): string {
    const p = this.pateint.patientEssentialInformation?.patientPhone;
    if (!p?.phone) return '';
    return p.phoneType ? `${p.phone} (${p.phoneType})` : p.phone;
  }

  get emergencyDisplay(): string {
    const e = this.pateint.patientEssentialInformation?.patientEmergencyContact;
    if (!e?.emergencyName) return '';
    const parts = [e.emergencyName, e.emergencyRelation, e.emergencyPhone].filter(Boolean);
    return parts.join(' • ');
  }

  get fullAddress(): string {
    const a = this.pateint.patientEssentialInformation?.patientAddress;
    if (!a) return '';
    const line1 = [a.firstAddress, a.secondAddress].filter(Boolean).join(', ');
    const line2 = [a.city, a.state, a.zipCode].filter(Boolean).join(', ');
    return [line1, line2].filter(Boolean).join(' — ');
  }

  get heightDisplay(): string {
    const h = this.pateint.patientMedical?.patientMedicalHistory;
    return h?.heightFT ? `${h.heightFT}` : '';
  }

  get weightDisplay(): string {
    const h = this.pateint.patientMedical?.patientMedicalHistory;
    return h?.weight ? `${h.weight} lbs` : '';
  }

  get conditionsList(): string[] {
    const c = this.pateint.patientMedical?.patientMedicalHistory?.patientCondition as any[];
    return Array.isArray(c) ? c.map((x: any) => x?.name).filter(Boolean) : [];
  }

  get scanningTests(): string[] {
    const x = this.pateint.patientMedical?.patientMedicalHistory?.scanningTestValue as any[];
    return Array.isArray(x) ? x : [];
  }

  get capturedPhoto(): string | null {
    return this.form.get('bio')?.get('capturedImage')?.value ?? null;
  }

  get signatureDataUrl(): string | null {
    return this.pateint.signature
      || this.form.get('signature')?.get('generatesign')?.value
      || this.form.get('signature')?.get('drawsign')?.value
      || null;
  }

  get acceptedAgreementCount(): number {
    const ag = this.form.get('agreement')?.value || {};
    return Object.values(ag).filter(v => v === true).length;
  }

  get totalAgreementCount(): number {
    const ag = this.form.get('agreement')?.value || {};
    return Object.keys(ag).length;
  }

  get uploadedDocumentCount(): number {
    return this.componentReference.getPatientDocumentComponent()?.uploadedDocumentsCount() ?? 0;
  }

  get uploadedDocumentNames(): string[] {
    return this.componentReference.getPatientDocumentComponent()?.uploadedDocumentNames() ?? [];
  }

  get hasGuarantor(): boolean {
    return !!this.pateint.patientGrantor;
  }

  get genderDisplay(): string {
    const g = this.pateint.patientEssentialInformation?.gender;
    if (!g) return '';
    if (g === 'Self_Describe') {
      return this.pateint.patientEssentialInformation?.genderDescribe || 'Self-described';
    }
    return g;
  }

  hasAnyInsurance(): boolean {
    const ins = this.pateint.insurances as any;
    if (!ins) return false;
    return (
      (ins.commercialInsurances?.length > 0) ||
      (ins.workerCompensationInsurances?.length > 0) ||
      (ins.medicareInsurance?.length > 0) ||
      (ins.medicaidInsurance?.length > 0) ||
      ins.selfPay?.type === 'selfpay'
    );
  }

  /* -------- Original fill methods (preserved) -------- */

  private fillPateintEssentialInformation() {
    let patientEssentialInformation: PatientEssentialInformation = {};
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
        genderDescribe: selected.genderDescribe,
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
        address: {}
      };
      const patientAge = moment().diff(selected.dob, 'y');
      const isGuarantor = patientAge < 18;
      if (isGuarantor) {
        const patientGrantor: PatientGrantor = {
          firstName: selected.guarantorFirstName,
          middleName: selected.guarantorMiddleName,
          lastName: selected.guarantorLastName,
          relation: selected.guarantorRelationship
        };
        this.pateint.patientGrantor = patientGrantor;
      } else {
        this.pateint.patientGrantor = undefined;
      }
      this.pateint.patientEssentialInformation = patientEssentialInformation;
    });
  }
  private fillPatientAddress() {
    let address: PatientBasicAddress = {};
    this.form.get('basic')?.valueChanges.forEach(selected => {
      address = {
        firstAddress: selected.firstAddress,
        secondAddress: selected.secondAddress,
        city: selected.city,
        state: selected.state,
        zipCode: selected.zipCode
      };
      this.pateint.patientEssentialInformation!.patientAddress = address;
    });
  }
  private fillPatientSource() {
    this.form.get('medical')?.get('referringEntity')?.valueChanges.subscribe(value => {
      this.pateint.patientIncomingSource = value;
    });
    const referringProvider: ReferringProvider = {};
    this.form.get('medical')?.get('providerName')?.valueChanges.subscribe(value => {
      referringProvider.name = value;
      this.pateint.referringProvider = referringProvider;
    });
    this.form.get('medical')?.get('providerNPI')?.valueChanges.subscribe(value => {
      referringProvider.npi = value;
      this.pateint.referringProvider = referringProvider;
    });
  }

  private fillPatientMedicalInformation() {
    const patientMedical: PatientMedical = {};
    const patientPhysicalTherapy: PatientPhysicalTherapy = {};
    this.form.get('medical')?.valueChanges.forEach(selected => {
      patientMedical.appointmentBooking = selected.appointmentBooking;
      patientMedical.communicationType = selected.communicationType;
      patientMedical.communicationTime = selected.communicationTime;
      patientMedical.primaryDoctor = selected.isPrimaryDoctor;
      this.pateint.patientMedical = patientMedical;
    });
    this.form.get('medical')?.get('isReceivedPhysicalTherapy')?.valueChanges.subscribe(value => {
      if (value === 'yes') {
        this.form.get('medical')?.get('PhysicalTherapyLocation')?.valueChanges.subscribe(v => {
          patientPhysicalTherapy.location = v;
        });
        this.form.get('medical')?.get('PhysicalTherapyNumber')?.valueChanges.subscribe(v => {
          patientPhysicalTherapy.numberOfVisit = v;
        });
        this.pateint.patientMedical!.hasPatientPhysicalTherapy = true;
        this.pateint.patientMedical!.patientPhysicalTherapy = patientPhysicalTherapy;
      } else {
        this.pateint.patientMedical!.hasPatientPhysicalTherapy = false;
        this.pateint.patientMedical!.patientPhysicalTherapy = undefined;
      }
    });
  }
  private fillPatientMedicalHistoryInformation() {
    const patientMedicalHistory: PatientMedicalHistory = {};
    this.form.get('medicalhistory')?.valueChanges.forEach(select => {
      patientMedicalHistory.height = select.height;
      patientMedicalHistory.heightUnit = select.heightUnit ? 'Inch' : 'cm';
      const height: string[] = this.calculateHeight(select.heightUnit, select.height);
      patientMedicalHistory.height = height[1];
      patientMedicalHistory.heightFT = height[0];
      patientMedicalHistory.weight = select.weight;
      patientMedicalHistory.weightUnit = select.weightUnit ? 'kg' : 'pound';
      const weight: string[] = this.calculateWeight(select.weightUnit, select.weight);
      patientMedicalHistory.weight = weight[0];
      patientMedicalHistory.weightPN = weight[1];
      patientMedicalHistory.evaluationSubmission = select.evaluationReason;
      patientMedicalHistory.patientCondition = select.patientConditionsSelections;
      patientMedicalHistory.medicationPrescription = select.prescriptionMedications;
      patientMedicalHistory.medicationPrescriptionText = select.PhysicalTherapyLocationText;
      patientMedicalHistory.scanningTest = select.isXRay === 'yes' ? true : false;
      patientMedicalHistory.scanningTestValue = select.isXRayValue;
      patientMedicalHistory.ptSpecialties = select.ptSpecialties;
      patientMedicalHistory.pacemaker = select.isPacemaker === 'yes' ? true : false;
      patientMedicalHistory.metalImplantation = select.isMetalImplants === 'yes' ? true : false;
      patientMedicalHistory.surgeriesList = select.surgeriesListText;
      if (this.pateint.patientMedical !== undefined)
        this.pateint.patientMedical.patientMedicalHistory = patientMedicalHistory;
    });
  }
  private fillPatientInsurance() {
    this.form.get('insurance')?.valueChanges.forEach(select => {
      if (select.insurances !== null) {
        this.pateint.insurances = select.insurances;
      }
    });
  }
  private fillPatientAgreement() {
    const map: Map<string, boolean> = new Map<string, boolean>();
    this.form.get('agreement')?.valueChanges.forEach(value => {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          map.set(key, value[key]);
        }
      }
      const filteredMap = new Map(
        [...map].filter(([_, v]) => v !== null)
      );
      this.pateint.patientAgreements = Object.fromEntries(filteredMap);
    });
  }
  private getSignture() {
    // Only adopt a value when it's truthy. Each channel emits null when the
    // user switches between typed and drawn signatures; without this guard a
    // stale clear on the inactive channel can wipe the live signature.
    this.form.get('signature')?.get('generatesign')?.valueChanges.subscribe((valu: any) => {
      if (valu) {
        this.patientSignature.signature = valu;
        this.pateint.signature = valu;
      }
    });
    this.form.get('signature')?.get('drawsign')?.valueChanges.subscribe(valu => {
      if (valu) {
        this.pateint.signature = valu;
        this.patientSignature.signature = valu;
      }
    });
  }

  private getPhoto() {
    this.form.get('bio')?.get('capturedImage')?.valueChanges.subscribe((valu: any) => {
      this.pateint.photo = valu;
    });
  }
  private calculateHeight(unit: boolean, value: string): string[] {
    const height: string[] = [];
    if (value !== null)
      height[0] = this.normalizeHeight(value);
    return height;
  }
  private calculateWeight(unit: boolean, value: string): string[] {
    const weight: string[] = [];
    weight[0] = value;
    return weight;
  }
  private normalizeHeight(input: string): string {
    const digitsOnly = input.replace(/\D/g, '').slice(0, 4);
    if (digitsOnly.length === 0) return '';
    let feet = '';
    let inches = '';
    if (digitsOnly.length <= 2) {
      feet = digitsOnly.charAt(0);
      inches = digitsOnly.slice(1);
    } else {
      feet = digitsOnly.slice(0, digitsOnly.length - 2);
      inches = digitsOnly.slice(-2);
    }
    return `${parseInt(feet)}'${parseInt(inches)}"`;
  }
  private scrollUp() {
    (function smoothscroll() {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.scrollTo(0, 0);
      }
    })();
  }
  capitalizeFirstLetter(input: string | undefined): string | undefined {
    if (!input) return input;
    return input.charAt(0).toUpperCase() + input.slice(1);
  }
}
