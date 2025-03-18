import { Component, OnInit } from '@angular/core';
import { IColumn, ISorterValue } from '@coreui/angular-pro/lib/smart-table/smart-table.type';
import * as moment from 'moment';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { PatientSearchCriteria } from 'src/app/models/reporting/patient.search.criteria';
import { LocalService } from 'src/app/modules/common';
import { IParams } from '../../models/pagination/params';
import PatientSources from '../../models/patient.sources';
import { ExportPatientSourceReportRequest } from '../../models/report/export.patient.source.report.request';
import { ClinicService } from '../../services/clinic/clinic.service';
import { IApiParams } from '../../services/patient-list.service';
import { ISearchResult, PatientReportingService } from '../../services/patient.reporting.service';
import { PatientSourceReportingService } from '../../services/reporting/source/patient-source-reporting.service';
import entityValues from './_entity.values';
interface PateintSourceSelects {
  name: string | null,
  value: string | null;
}

@Component({
  selector: 'app-recommendation.report',
  templateUrl: './recommendation.report.component.html',
  styleUrls: ['./recommendation.report.component.css']
})
export class RecommendationReportComponent implements OnInit {
  patientSources = PatientSources;
  searchInputNotValid: boolean = false;
  errorMsg: string;
  patientSearchCriteria: PatientSearchCriteria = new PatientSearchCriteria();
  result: ISearchResult;
  patients$!: Observable<any[]>;
  searchErrorMessage: string | undefined
  constructor(private patientReportingService: PatientReportingService,
    private clinicService: ClinicService,
    private patientSourceReportingService: PatientSourceReportingService) { }

  entityValues = entityValues;
  pateintSourceSelects: PateintSourceSelects[] = [
    {
      name: "Doctor",
      value: "Doctor"
    },
    {
      name: "Entity",
      value: "Entity"
    }

  ]
  readonly columns: (string | IColumn)[] = [
    {
      key: 'firstName',
      label: 'First Name'
    },
    {
      key: 'middleName',
      label: 'Middle Name'
    },
    {
      key: 'lastName',
      label: 'Last Name'
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'phoneNumber',
      label: 'Phone Number'
    },
    {
      key: 'sourceType',
      label: 'Source '
    },
    {
      key: 'referringProviderName',
      label: 'Provider Name'
    },
    {
      key: 'referringProviderNPI',
      label: 'Provider NPI '
    },
    {
      key: 'createdAt',
      label: 'created'
    },
  ];
  colors = { color: 'primary', textColor: 'primary' };
  public customRanges = {
    Today: [new Date(), new Date()],
    Yesterday: [
      new Date(new Date().setDate(new Date().getDate() - 1)),
      new Date(new Date().setDate(new Date().getDate() - 1))
    ],
    'Last 7 Days': [
      new Date(new Date().setDate(new Date().getDate() - 6)),
      new Date(new Date())
    ],
    'Last 30 Days': [
      new Date(new Date().setDate(new Date().getDate() - 29)),
      new Date(new Date())
    ],
    'This Month': [
      new Date(new Date().setDate(1)),
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    ],
    'Last Month': [
      new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      new Date(new Date().getFullYear(), new Date().getMonth(), 0)
    ],
    'Clear': [
      null,
      null
    ]
  };
  private _apiParams: IApiParams = {};
  readonly activePage$ = new BehaviorSubject(0);
  readonly columnFilterValue$ = new BehaviorSubject({});
  readonly itemsPerPage$ = new BehaviorSubject(5);
  readonly loadingData$ = new BehaviorSubject<boolean>(true);
  readonly totalPages$ = new BehaviorSubject<number>(1);
  readonly sorterValue$ = new BehaviorSubject({});
  readonly totalItems$ = new BehaviorSubject(0);

  readonly apiParams$ = new BehaviorSubject<IApiParams>({ pageSize: this.itemsPerPage$.value, currentPage: 0 });
  readonly errorMessage$ = new Subject<string>();
  readonly retry$ = new Subject<boolean>();
  readonly #destroy$ = new Subject<boolean>();
  readonly props$: Observable<IParams> = combineLatest([
    this.activePage$,
    this.columnFilterValue$,
    this.itemsPerPage$,
    this.sorterValue$,
    this.totalPages$
  ]).pipe(
    debounceTime(100),
    map(([activePage, columnFilterValue, itemsPerPage, sorterValue, totalPages]) => ({
      activePage,
      columnFilterValue,
      itemsPerPage,
      sorterValue,
      totalPages
    }))
  );
  set apiParams(value: any) {
    const params = {
      ...this._apiParams,
      ...value
    };

    const entries = new Map(Object.entries(params));
    entries.forEach((value, key, map) => {
      if (value === '' || value === undefined || value === null) {
        map.delete(key);
      }
    });

    const apiParams = Object.fromEntries(entries);
    this.loadingData$.next(true);
    this._apiParams = { ...apiParams };
    this.retry$.next(true);

    this.apiParams$.next({ ...apiParams });
  }
  ngOnInit(): void {
    this.clinicService.selectedClinic$.pipe(
      filter(clinicId => clinicId == null)
    ).
      subscribe(clinicId => {
        this.patientSearchCriteria.clinicId = clinicId;
      })
    this.patientSources = this.patientSources.map((source: any) => ({ ...source, selected: true }));
    if (this.patientSearchCriteria.sourceType === 'direct')
      this.patientSources = this.patientSources.filter(source => source.entityValue !== 'referringDoctor')
    this.result = {
      resultCount: 0,
      result: []
    }
    this.activePage$.pipe(
      takeUntil(this.#destroy$)
    ).subscribe((page) => {
      const limit = this.itemsPerPage$.value;
      const offset = page - 1;
      this.apiParams = { offset, limit };
    });

    this.itemsPerPage$.pipe(
      distinctUntilChanged(),
      takeUntil(this.#destroy$)
    ).subscribe((limit) => {
      const totalPages = Math.ceil(this.totalItems$.value / limit) ?? 1;
      this.totalPages$.next(totalPages);
    });

    this.totalItems$.pipe(
      distinctUntilChanged(),
      takeUntil(this.#destroy$)
    ).subscribe((totalItems) => {
      const totalPages = Math.ceil(totalItems / this.itemsPerPage$.value) ?? 1;
      this.totalPages$.next(totalPages);
    });

    this.totalPages$.pipe(
      takeUntil(this.#destroy$)
    ).subscribe((totalPages) => {
      const activePage = this.activePage$.value > totalPages ? totalPages : this.activePage$.value;
      this.setActivePage(activePage);
    });

  }
  setActivePage(page: number) {
    page = page > 0 && this.totalPages$.value + 1 > page ? page : 1;
    this.activePage$.next(page);
  }
  search() {
    this.formatDate();
    this.requestSearchService();

  }

  private formatDate() {
    if (this.patientSearchCriteria.startDate_date !== undefined)
      this.patientSearchCriteria.startDate = this.patientSearchCriteria.startDate_date ? moment(new Date(this.patientSearchCriteria.startDate_date)).startOf('day').valueOf() : 0;
    if (this.patientSearchCriteria.endDate_date !== undefined)
      this.patientSearchCriteria.endDate = this.patientSearchCriteria.endDate_date ? moment(new Date(this.patientSearchCriteria.endDate_date)).endOf('day').valueOf() : 0;
    if (this.patientSearchCriteria.startDate_date === null)
      this.patientSearchCriteria.startDate = null;
    if (this.patientSearchCriteria.endDate_date === null)
      this.patientSearchCriteria.endDate = null;
  }

  private isValid(): boolean {
    if (this.patientSearchCriteria.type !== null || this.patientSearchCriteria.sourceType !== null)
      return true;
    else
      return false;
  }
  private requestSearchService() {
    var isValidPatientSearchCriteria: boolean = this.isValid();
    if (isValidPatientSearchCriteria) {
      this.searchErrorMessage = undefined
      this.cleanEmptyFields(this.patientSearchCriteria)
      this.patients$ = this.clinicService.selectedClinic$.pipe(
        tap(clinicid => {
          this.patientSearchCriteria.clinicId = clinicid
        }),
        switchMap(dd => {
          return this.patientSourceReportingService.search(this.apiParams$, this.patientSearchCriteria).pipe(
            tap((response: any) => {
              this.totalItems$.next(response.number_of_matching_records);
              if (response.number_of_records) {
                this.errorMessage$.next('');
              }
              this.retry$.next(false);
              this.loadingData$.next(false);
            }),
            tap((response) => {
              this.totalItems$.next(response.number_of_matching_records);
              if (response.number_of_records) {
                this.errorMessage$.next('');
              }
              this.retry$.next(false);
              this.loadingData$.next(false);
            }),
            map((response) => {
              return response.records;
            })
          );
        })
      )
    } else {
      this.searchErrorMessage = "Please select Patient Source type"
    }
  }
  exportResult() {
    var isValidPatientSearchCriteria: boolean = this.patientSearchCriteria.type !== null || this.patientSearchCriteria.sourceType !== null
    if (isValidPatientSearchCriteria) {
      this.cleanEmptyFields(this.patientSearchCriteria)
      const type: string | null | undefined = this.patientSearchCriteria.sourceType;
      this.patientSourceReportingService.searchAll(this.patientSearchCriteria).pipe(
        map((response: any) => {
          return response.body.records;
        })
      )
        .subscribe((patients: any) => {

          var request: ExportPatientSourceReportRequest = {
            patients: patients,
            type: type!,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
          this.patientReportingService.export(request).subscribe(
            (response) => {
              const a = document.createElement('a')
              const objectUrl = URL.createObjectURL(response)
              a.href = objectUrl
              var nameDatePart = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
              a.download = 'patient-' + nameDatePart + '.xlsx';
              a.click();
              URL.revokeObjectURL(objectUrl);
            },
            (error) => {
              console.log(error)
            });
        })
    } else {
      this.searchErrorMessage = "Please select Patient Source type"
    }
  }

  private FillEmptyFieldsInSearchCriteria() {
    if (this.patientSearchCriteria.type === 'Doctor')
      this.patientSearchCriteria.entityNames = null
    if (this.patientSearchCriteria.type === 'Entity') {
      this.patientSearchCriteria.doctorName = null
      this.patientSearchCriteria.doctorNPI = null
    }
    if (this.patientSearchCriteria.type === "") {
      this.patientSearchCriteria.entityNames = null;
      this.patientSearchCriteria.doctorName = null;
      this.patientSearchCriteria.doctorNPI = null;
    }
  }

  private checkEmptyOfpatientSearchCriteria() {
    console.log(this.patientSearchCriteria.type + ' ' + this.patientSearchCriteria.entityNames)
    var errorMsg = ''
    if (this.patientSearchCriteria.type === 'Entity' && (this.patientSearchCriteria.entityNames === undefined
      || this.patientSearchCriteria.entityNames?.length === 0 || this.patientSearchCriteria.entityNames === null))
      errorMsg = 'Please Select Entity Value'
    return errorMsg
  }
  handleItemsPerPageChange(limit: number) {
    this.itemsPerPage$.next(limit);
  }
  handleSorterValueChange(sorterValue: ISorterValue) {
    this.sorterValue$.next(!!sorterValue.state ? sorterValue : {});
    const sort = !!sorterValue.state ? `${sorterValue.column}%${sorterValue.state}` : '';
    this.apiParams = { sort };
  }
  handleActivePageChange(page: number) {
    this.setActivePage(page);
  }
  changeSources(event: any) {
    console.log(event)
    this.patientSearchCriteria.entityNames = event;
  }
  cleanEmptyFields(criteria: PatientSearchCriteria): void {
    Object.keys(criteria).forEach((key) => {
      const value = (criteria as any)[key];
      if (value === '') {
        (criteria as any)[key] = null;
      }
    });
  }
}
