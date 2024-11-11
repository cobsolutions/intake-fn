import { Component, OnDestroy, OnInit } from '@angular/core';
import { IColumn, IColumnFilterValue, ISorterValue } from '@coreui/angular-pro/lib/smart-table/smart-table.type';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, debounceTime, distinctUntilChanged, map, Observable, retry, Subject, takeUntil, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { KcAuthServiceService } from 'src/app/modules/security/service/kc/kc-auth-service.service';
import { PatientSearchCriteria } from '../../models/patient.search.criteria';
import { ClinicService } from '../../services/clinic/clinic.service';
import { PateintDocumentsService } from '../../services/documents/pateint-documents.service';
import { IApiParams, IPatient, IUsers, PatientListService } from '../../services/patient-list.service';
import { PatientReportingService } from '../../services/patient.reporting.service';
import { PatientSearchService } from '../../services/patient.search/patient-search.service';
export interface IParams {
  activePage?: number;
  columnFilterValue?: IColumnFilterValue;
  itemsPerPage?: number;
  sorterValue: ISorterValue;
  totalPages?: number;
}
@Component({
  selector: 'app-patient.list',
  templateUrl: './patient.list.component.html',
  styleUrls: ['./patient.list.component.css']
})
export class PatientListComponent implements OnInit, OnDestroy {
  noShow: BehaviorSubject<boolean | null>;
  constructor(private patientListService: PatientListService
    , private reportingService: PatientReportingService
    , private pateintDocumentsService: PateintDocumentsService
    , private clinicService: ClinicService
    , private kcAuthServiceService: KcAuthServiceService
    , private toastrService: ToastrService
    , private patientSearchService: PatientSearchService) {
  }
  patientSearchCriteria: PatientSearchCriteria = {}
  isSchedulePatient: boolean;
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
  readonly columns: (string | IColumn)[] = [
    {
      key: 'lastName',
      label: 'Last Name',
      sorter: false,
    },
    {
      key: 'firstName',
      label: 'First Name',
      sorter: false,
    },
    {
      key: 'email',
      label: 'Email',
      sorter: false,
    },
    {
      key: 'phoneNumber',
      label: 'Phone Number',
      sorter: false,
    },
    {
      key: 'sourceType',
      label: 'Source',
      sorter: false,
    },
    {
      key: 'hasGuarantor',
      label: 'Has Guarantor',
      sorter: false,
    },
    {
      key: 'createAt',
      label: 'Created At',
      sorter: false,
    },
    {
      key: 'schedule',
      label: 'Schedule',
      sorter: false,
    },
    {
      key: 'actions',
      label: 'Actions',
      sorter: false,
    }
  ];
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
  usersData$!: Observable<IUsers[]>;
  readonly #destroy$ = new Subject<boolean>();

  private _apiParams: IApiParams = {};

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

  ngOnDestroy(): void {
    this.#destroy$.next(true);
  }
  logout() {
    this.kcAuthServiceService.logout()
  }
  exportPDF(data: IPatient) {
    this.reportingService.exportPDF(data.patientId).subscribe(
      (response: any) => {
        this.constructExportedFile(response, 'patient-', 'pdf')
      });
  }
  exportPatientIDDocument(data: IPatient, hasGuarantor?: boolean) {
    this.pateintDocumentsService.exportPateintIdDocuments(data.patientId, hasGuarantor).subscribe(
      (response: any) => {
        this.constructExportedFile(response, 'patient-ID-Documents', 'zip')
      }
    )

  }
  exportPatientInsuranceDocument(data: IPatient) {
    this.pateintDocumentsService.exportPateintInsuranceDocuments(data.patientId).subscribe(
      (response: any) => {
        this.constructExportedFile(response, 'patient-Insurance-Documents', 'zip')
      },
      (error) => {

      }
    )
  }

  constructExportedFile(response: any, fileName: string, extention: string) {
    const a = document.createElement('a')
    const objectUrl = URL.createObjectURL(response)
    a.href = objectUrl
    var nameDatePart = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    a.download = fileName + nameDatePart + '.' + extention;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }
  ngOnInit(): void {
    this.noShow = this.clinicService.preventUser$;
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

    this.usersData$ = this.patientListService.getPatients(this.apiParams$).pipe(
      retry({
        delay: (error) => {
          console.warn('Retry: ', error);
          this.errorMessage$.next(error.message ?? `Error: ${JSON.stringify(error)}`);
          this.loadingData$.next(false);
          return this.retry$;
        }
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
  }

  handleColumnFilterValueChange(columnFilterValue: IColumnFilterValue) {
    this.setActivePage(1);
    this.apiParams = { ...columnFilterValue };
    this.columnFilterValue$.next(columnFilterValue);
  }

  handleSorterValueChange(sorterValue: ISorterValue) {
    this.sorterValue$.next(!!sorterValue.state ? sorterValue : {});
    const sort = !!sorterValue.state ? `${sorterValue.column}%${sorterValue.state}` : '';
    this.apiParams = { sort };
  }

  handleFilteredItemsChange(filteredItems: IUsers[]) {
    // console.table(filteredItems);
  }

  handleActivePageChange(page: number) {
    this.setActivePage(page);
  }

  handleItemsPerPageChange(limit: number) {
    this.itemsPerPage$.next(limit);
  }

  setActivePage(page: number) {
    page = page > 0 && this.totalPages$.value + 1 > page ? page : 1;
    this.activePage$.next(page);
  }
  details_visible = Object.create({});
  toggleDetails(item: any) {
    this.details_visible[item] = !this.details_visible[item];
  }
  isSchedule(item: any) {
    console.log(item.schedule)
    this.patientListService.updatePatientSchedule(item.patientId, item.schedule).subscribe(result => {
      this.toastrService.success('Patient is scheduled');
    }, error => {
      this.toastrService.error('error during schedule patient');
    })
  }
  search() {
    if (this.patientSearchCriteria.startDate_date !== undefined)
      this.patientSearchCriteria.startDate = moment(this.patientSearchCriteria.startDate_date).unix() * 1000;
    if (this.patientSearchCriteria.endDate_date !== undefined)
      this.patientSearchCriteria.endDate = moment(this.patientSearchCriteria.endDate_date).unix() * 1000;

    this.usersData$ = this.patientSearchService.findFilter(this.apiParams$, this.patientSearchCriteria).pipe(
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
  }
}

