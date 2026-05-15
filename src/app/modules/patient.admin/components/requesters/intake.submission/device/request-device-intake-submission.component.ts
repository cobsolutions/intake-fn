import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, of, startWith } from 'rxjs';
import { DigitalIntakeOneTimeTokenRequest } from 'src/app/modules/patient.admin/models/one.time.token/digital.intake.one.time.token.request';
import { Clinic } from 'src/app/modules/patient.admin/models/clinic.model';
import { ClinicService } from 'src/app/modules/patient.admin/services/clinic/clinic.service';
import { OneTimeTokenService } from 'src/app/modules/patient.admin/services/one.time.token/one-time-token.service';

@Component({
  selector: 'request-device-intake-submission',
  templateUrl: './request-device-intake-submission.component.html',
  styleUrls: ['./request-device-intake-submission.component.css']
})
export class RequestDeviceIntakeSubmissionComponent implements OnInit {
  public baseURL: string = location.origin;
  clinics$: Observable<Clinic[]>;
  filteredClinics$: Observable<Clinic[]>;
  private allClinics$ = new BehaviorSubject<Clinic[]>([]);
  private searchTerm$ = new BehaviorSubject<string>('');

  selectedClinicUUID: string | undefined = undefined;
  selectedClinic: Clinic | null = null;

  submissionURL: string;
  isGenerated: boolean = false;
  isValid: boolean = true;
  isGenerating: boolean = false;
  loadingClinics: boolean = true;

  constructor(private clinicService: ClinicService, private oneTimeTokenService: OneTimeTokenService) { }

  ngOnInit(): void {
    this.getAllClinics();

    this.filteredClinics$ = combineLatest([
      this.allClinics$.asObservable(),
      this.searchTerm$.asObservable()
    ]).pipe(
      map(([clinics, term]) => {
        const t = (term || '').trim().toLowerCase();
        if (!t) return clinics;
        return clinics.filter(c =>
          (c.name || '').toLowerCase().includes(t) ||
          (c.address || '').toLowerCase().includes(t)
        );
      })
    );
  }

  private getAllClinics() {
    this.loadingClinics = true;
    this.clinicService.get().pipe(
      map(result => result.body || [])
    ).subscribe({
      next: (clinics: any) => {
        this.allClinics$.next(clinics);
        this.loadingClinics = false;
      },
      error: () => {
        this.loadingClinics = false;
        this.allClinics$.next([]);
      }
    });
  }

  selectClinic(clinic: Clinic): void {
    this.selectedClinic = clinic;
    this.selectedClinicUUID = clinic.uuid ?? undefined;
    this.isValid = true;
  }

  isClinicSelected(clinic: Clinic): boolean {
    return !!clinic.uuid && clinic.uuid === this.selectedClinicUUID;
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm$.next(value);
  }

  generateQRCode() {
    if (this.selectedClinicUUID === undefined) {
      this.isValid = false;
      return;
    }
    this.isValid = true;
    this.isGenerating = true;
    const request: DigitalIntakeOneTimeTokenRequest = {
      clinicId: this.selectedClinicUUID,
      requester: 'Device_Submission',
      type: 'Full'
    };
    this.oneTimeTokenService.generateNew(request).subscribe({
      next: (response: any) => {
        const ottResponse: any = response.body;
        this.submissionURL = this.baseURL + '/digital-intake/device-submission-request?token-id=' + ottResponse.tokenId;
        this.isGenerated = true;
        this.isGenerating = false;
      },
      error: () => {
        this.isGenerating = false;
      }
    });
  }

  regenerate(): void {
    this.isGenerated = false;
    this.submissionURL = '';
    this.generateQRCode();
  }

  changeClinic(): void {
    this.isGenerated = false;
    this.submissionURL = '';
  }
}
