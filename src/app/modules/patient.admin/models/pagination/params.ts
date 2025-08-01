import { IColumnFilterValue, ISorterValue } from "@coreui/angular-pro/lib/smart-table/smart-table.type";

export interface IParams {
    activePage?: number;
    columnFilterValue?: IColumnFilterValue;
    itemsPerPage?: number;
    sorterValue: ISorterValue;
    totalPages?: number;
  }