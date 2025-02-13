import { IColumn, IColumnFilterValue, ISorterValue } from "@coreui/angular-pro/lib/smart-table/smart-table.type";
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, Observable, Subject, takeUntil } from "rxjs";
import { IApiParams } from "../interfaces/api.params";
import { IParams } from "../interfaces/params";

export class PaginationListTemplate {
    readonly activePage$ = new BehaviorSubject(0);
    readonly columnFilterValue$ = new BehaviorSubject({});
    readonly itemsPerPage$ = new BehaviorSubject(5);
    readonly loadingData$ = new BehaviorSubject<boolean>(true);
    readonly totalPages$ = new BehaviorSubject<number>(1);
    readonly sorterValue$ = new BehaviorSubject({});
    readonly totalItems$ = new BehaviorSubject(0);

    readonly apiParams$ = new BehaviorSubject<IApiParams>({ limit: this.itemsPerPage$.value, offset: 0 });
    readonly retry$ = new Subject<boolean>();

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

    readonly #destroy$ = new Subject<boolean>();
    readonly errorMessage$ = new Subject<string>();

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

    constructColumns(cloumnsNames: string[]) {
        var columns: (string | IColumn)[] = []
        cloumnsNames.forEach(element => {
            if (element === 'actions')
                columns.push({
                    key: element,
                    label: element.charAt(0).toUpperCase() + element.slice(1),
                    filter: false,
                    sorter: false
                })
            else
                columns.push({
                    key: element,
                    label: element.charAt(0).toUpperCase() + element.slice(1)
                })
        });
        return columns;
    }
    initListComponent() {
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
}