import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponentScannerComponent } from './component/createDevice/create-component-scanner.component';

const routes: Routes = [
  {
    path: '',
    data: {
    },
    children:[
      {
        path:'',
        component:CreateComponentScannerComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScannerRoutingModule { }
