import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgreementHolder } from 'src/app/models/patient/agreements/agreements.holder';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';
import { ValidationExploder } from '../create/validators/validation.exploder';

@Component({
  selector: 'patient-agreement',
  templateUrl: './patient-agreement.component.html',
  styleUrls: ['./patient-agreement.component.css']
})
export class PatientAgreementComponent implements OnInit, AfterViewInit {
  @Input() stepper: MatStepper
  isValidForm: boolean = false;
  @Input() form: FormGroup;

  agreementFormArray: FormArray;
  agreements: AgreementHolder[] | null = null;

  fullViewAgreement: AgreementHolder | null = null;
  private safeHtmlCache = new Map<number, SafeHtml>();

  constructor(private sanitizer: DomSanitizer
    , private digitalIntakeService: DigitalIntakeService) { }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.digitalIntakeService.findAgreements().subscribe(response => {
      this.agreements = response.body ?? [];

      this.initForm(this.agreements);

      this.form.get('medicalhistory')?.get('ptSpecialties')?.valueChanges.subscribe(ptVal => {
        this.updateAgreementRequirement(ptVal);
      });

      const initialVal = this.form.get('medicalhistory')?.get('ptSpecialties')?.value;
      this.updateAgreementRequirement(initialVal);
    });
  }


  next() {
    if (this.form.get('agreement')?.valid) {
      this.stepper.next();
      this.isValidForm = false;
    } else {
      this.isValidForm = true;
      ValidationExploder.explode(this.form, 'agreement');
      this.scrollToNextRequired();
    }
  }
  getAllFormValues(formGroup: FormGroup): any {
    const values: any = {};
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof FormControl) {
        values[key] = control.value;
      } else if (control instanceof FormGroup) {
        values[key] = this.getAllFormValues(control);
      } else if (control instanceof FormArray) {
        values[key] = control.controls.map(ctrl =>
          ctrl instanceof FormGroup ? this.getAllFormValues(ctrl) : ctrl.value
        );
      }
    });
    return values;
  }

  isSigned(agreement: AgreementHolder): boolean {
    return this.form.get('agreement')?.get(agreement.fieldName)?.value === true;
  }

  trustedAgreementHtml(agreement: AgreementHolder): SafeHtml {
    const cached = this.safeHtmlCache.get(agreement.id);
    if (cached) return cached;
    const safe = this.sanitizer.bypassSecurityTrustHtml(agreement.agreementText ?? '');
    this.safeHtmlCache.set(agreement.id, safe);
    return safe;
  }

  get totalRequiredCount(): number {
    return this.agreements?.filter(a => a.required).length ?? 0;
  }

  get signedRequiredCount(): number {
    return this.agreements?.filter(a => a.required && this.isSigned(a)).length ?? 0;
  }

  get totalSignedCount(): number {
    return this.agreements?.filter(a => this.isSigned(a)).length ?? 0;
  }

  get progressPercent(): number {
    const total = this.totalRequiredCount;
    if (total === 0) {
      const all = this.agreements?.length ?? 0;
      if (all === 0) return 0;
      return Math.round((this.totalSignedCount / all) * 100);
    }
    return Math.round((this.signedRequiredCount / total) * 100);
  }

  get allRequiredSigned(): boolean {
    return this.totalRequiredCount > 0 && this.signedRequiredCount === this.totalRequiredCount;
  }

  trackById = (_: number, agreement: AgreementHolder) => agreement.id;

  cardId(agreement: AgreementHolder): string {
    return `agreement-card-${agreement.id}`;
  }

  scrollToNextRequired(): void {
    const target = this.agreements?.find(a => a.required && !this.isSigned(a));
    if (!target || typeof document === 'undefined') return;
    const el = document.getElementById(this.cardId(target));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('is-flash');
      setTimeout(() => el.classList.remove('is-flash'), 1200);
    }
  }

  toggleSign(agreement: AgreementHolder, accepted: boolean): void {
    const control = this.form.get('agreement')?.get(agreement.fieldName);
    control?.setValue(accepted);
    control?.markAsTouched();
  }

  reopenSigned(agreement: AgreementHolder): void {
    this.toggleSign(agreement, false);
    if (typeof document !== 'undefined') {
      setTimeout(() => {
        const el = document.getElementById(this.cardId(agreement));
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  openFull(agreement: AgreementHolder): void {
    this.fullViewAgreement = agreement;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeFull(): void {
    this.fullViewAgreement = null;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  acceptFromFullView(): void {
    if (!this.fullViewAgreement) return;
    this.toggleSign(this.fullViewAgreement, true);
    this.closeFull();
  }

  private isPelvic(list: string[]): boolean {
    return list?.includes('pelpt') ?? false;
  }
  private isCupping(list: string[]): boolean {
    return list?.includes('cuppt') ?? false;
  }

  private updateAgreementRequirement(ptVal: string[]): void {
    const pelvicSelected = this.isPelvic(ptVal);
    const cuppingSelected = this.isCupping(ptVal);
    this.agreements?.forEach(agreement => {
      if (agreement.id === 17) {
        agreement.required = pelvicSelected;
      }
      if (agreement.id === 16) {
        agreement.required = cuppingSelected;
      }
    });

    this.initForm(this.agreements);
  }
  private initForm(agreements: AgreementHolder[] | null): void {
    const agreementGroup = this.form.get('agreement') as FormGroup;

    agreements?.forEach(agreement => {
      const controlExists = agreementGroup.contains(agreement.fieldName);
      const validators = agreement.required ? [Validators.requiredTrue] : [];

      if (controlExists) {
        const control = agreementGroup.get(agreement.fieldName);
        control?.setValidators(validators);
        control?.updateValueAndValidity();
      } else {
        agreementGroup.addControl(agreement.fieldName, new FormControl(null, validators));
      }
    });
  }
}
