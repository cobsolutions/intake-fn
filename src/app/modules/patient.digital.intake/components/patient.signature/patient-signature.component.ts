import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
import { combineLatest } from 'rxjs';

import SignaturePad from 'signature_pad';
import { ComponentReferenceComponentService } from '../../services/component.reference/component-reference-component.service';
import { PatientSignatureService } from '../../services/signature/patient-signature.service';

type SignatureMode = 'type' | 'draw';

@Component({
  selector: 'patient-signature',
  templateUrl: './patient-signature.component.html',
  styleUrls: ['./patient-signature.component.css']
})
export class PatientSignatureComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() stepper: MatStepper;
  @Input() form: FormGroup;

  isValidForm: boolean = true;
  mode: SignatureMode = 'type';

  signaturePad!: SignaturePad;
  signatureClass: string = '';
  signatureImg!: string;

  patientFullName: string = '';
  gPatientFullName: string | undefined;
  isDrawsign: boolean | undefined = false;
  isGeneratesign: boolean | undefined = false;
  selectedSignature: string = '';

  signatures = [
    { value: 'signature-format-Dancing-Script',     displayText: 'Dancing Script',     fontFamily: 'Dancing Script' },
    { value: 'signature-format-Gloria-Hallelujah',  displayText: 'Hand-Written',       fontFamily: 'Gloria Hallelujah' },
    { value: 'signature-format-Great-Vibes',        displayText: 'Great Vibes',        fontFamily: 'Great Vibes' },
    { value: 'signature-format-Homemade-Apple',     displayText: 'Homemade Apple',     fontFamily: 'Homemade Apple' },
    { value: 'signature-format-Monsieur-La-Doulaise', displayText: 'Elegant',          fontFamily: 'Monsieur La Doulaise' },
    { value: 'signature-format-Nanum-Brush-Script', displayText: 'Brush Script',       fontFamily: 'Nanum Brush Script' },
    { value: 'signature-format-Reenie-Beanie',      displayText: 'Casual',             fontFamily: 'Reenie Beanie' }
  ];

  @ViewChild('patientsig') patientsig: ElementRef;
  @ViewChild('canvas') canvasEl!: ElementRef<HTMLCanvasElement>;

  constructor(
    private patientSignatureService: PatientSignatureService,
    private renderer: Renderer2,
    private componentReference: ComponentReferenceComponentService
  ) {}

  ngOnInit(): void {
    this.patientSignatureService.setPatientSignatureComponent(this);
    this.seedFullNameFromCurrentValues();
  }

  ngAfterViewInit(): void {
    const basic = this.componentReference.getPatientBasicComponent()?.form.get('basic');

    combineLatest([
      basic?.get('firstname')?.valueChanges,
      basic?.get('lastName')?.valueChanges
    ] as any).subscribe((pName: any) => {
      this.patientFullName = this.composeName(pName[0], pName[1]);
    });

    basic?.get('dob')?.valueChanges.subscribe(dob => {
      const patientAge = moment().diff(dob, 'y');
      const isGuarantor = patientAge < 18;
      if (isGuarantor) {
        combineLatest([
          basic?.get('guarantorFirstName')?.valueChanges,
          basic?.get('guarantorLastName')?.valueChanges
        ] as any).subscribe((pName: any) => {
          this.gPatientFullName = this.composeName(pName[0], pName[1]);
        });
      } else {
        this.gPatientFullName = undefined;
        combineLatest([
          basic?.get('firstname')?.valueChanges,
          basic?.get('lastName')?.valueChanges
        ] as any).subscribe((pName: any) => {
          this.patientFullName = this.composeName(pName[0], pName[1]);
        });
      }
    });

  }

  ngOnDestroy(): void {
    this.signaturePad?.off();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.mode === 'draw') {
      this.resizeCanvas();
    }
  }

  setMode(mode: SignatureMode): void {
    this.mode = mode;
    if (mode === 'draw') {
      // Canvas lives inside *ngIf="mode === 'draw'", so it isn't in the DOM
      // until Angular re-renders. Defer init/resize until the next tick.
      setTimeout(() => {
        this.ensureSignaturePad();
        this.resizeCanvas();
      });
    }
  }

  private ensureSignaturePad(): void {
    if (this.signaturePad) return;
    const canvas = this.canvasEl?.nativeElement;
    if (!canvas) return;
    this.signaturePad = new SignaturePad(canvas, {
      penColor: '#0f4c81',
      minWidth: 1,
      maxWidth: 2.6
    });
    this.signaturePad.addEventListener('endStroke', () => this.onStrokeEnd());
  }

  selectSignature(signature: any) {
    this.selectedSignature = signature.value;
  }

  clearPad() {
    this.isDrawsign = false;
    this.signaturePad?.clear();
    this.form.get('signature')?.get('drawsign')?.setValue(null);
  }

  stopDrawing() {
    this.onStrokeEnd();
  }

  generatesign(event: any) {
    this.selectedSignature = event.value;
    this.patientsig.nativeElement.name = 'patientsig';
    this.renderer.setAttribute(this.patientsig.nativeElement, 'class', event.value);
    // Clear the inactive channel BEFORE writing the new one so a stale null
    // valueChanges can't overwrite the live signature in subscribers.
    this.form.get('signature')?.get('drawsign')?.setValue(null);
    this.signaturePad?.clear();
    this.isDrawsign = false;
    this.isGeneratesign = true;
    html2canvas(this.patientsig.nativeElement, { backgroundColor: null }).then(canvas => {
      this.form.get('signature')?.get('generatesign')?.setValue(canvas.toDataURL());
    });
  }

  next() {
    this.isDrawsign = false;
    if (this.mode === 'draw' && this.signaturePad && !this.signaturePad.isEmpty()) {
      this.isDrawsign = true;
    }
    if (this.isGeneratesign || this.isDrawsign) {
      this.stepper.next();
      this.isValidForm = true;
    } else {
      this.isValidForm = false;
    }
  }

  touchStopDrawing() {
    this.onStrokeEnd();
  }

  capitalizeFirstLetter(input: string | undefined): string | undefined {
    if (!input) return input;
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  get effectiveName(): string {
    return this.gPatientFullName || this.patientFullName || 'Your Name';
  }

  get hasSignature(): boolean {
    return !!(this.isGeneratesign || this.isDrawsign);
  }

  get savedSignatureDataUrl(): string | null {
    return this.form.get('signature')?.get('generatesign')?.value
        || this.form.get('signature')?.get('drawsign')?.value
        || null;
  }

  private onStrokeEnd(): void {
    if (!this.signaturePad) return;
    if (this.signaturePad.isEmpty()) return;
    // Clear the inactive channel BEFORE writing the new one so a stale null
    // valueChanges can't overwrite the live signature in subscribers.
    this.form.get('signature')?.get('generatesign')?.setValue(null);
    this.isGeneratesign = false;
    this.isDrawsign = true;
    this.form.get('signature')?.get('drawsign')?.setValue(this.signaturePad.toDataURL());
  }

  private resizeCanvas(): void {
    const canvas = this.canvasEl?.nativeElement;
    if (!canvas) return;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const cssWidth = canvas.offsetWidth;
    const cssHeight = canvas.offsetHeight || 220;
    if (cssWidth === 0) return;
    const data = this.signaturePad && !this.signaturePad.isEmpty() ? this.signaturePad.toDataURL() : null;
    canvas.width = cssWidth * ratio;
    canvas.height = cssHeight * ratio;
    canvas.getContext('2d')?.scale(ratio, ratio);
    this.signaturePad?.clear();
    if (data) {
      this.signaturePad?.fromDataURL(data, { ratio });
    }
  }

  private seedFullNameFromCurrentValues(): void {
    const basic = this.componentReference.getPatientBasicComponent()?.form.get('basic');
    if (!basic) return;
    this.patientFullName = this.composeName(basic.get('firstname')?.value, basic.get('lastName')?.value);
    const dob = basic.get('dob')?.value;
    if (dob && moment().diff(dob, 'y') < 18) {
      this.gPatientFullName = this.composeName(basic.get('guarantorFirstName')?.value, basic.get('guarantorLastName')?.value);
    }
  }

  private composeName(first?: string, last?: string): string {
    const f = this.capitalizeFirstLetter(first) || '';
    const l = this.capitalizeFirstLetter(last) || '';
    return `${f} ${l}`.trim();
  }
}
