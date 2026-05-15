import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { Survey } from '../../models/create.survey/survey.model';
import { PatientSurveyService } from '../../services/survey/patient-survey.service';

@Component({
  selector: 'app-list-survey',
  templateUrl: './list-survey.component.html',
  styleUrls: ['./list-survey.component.css']
})
export class ListSurveyComponent implements OnInit {


  isSurvey: boolean
  surveys: any[] = [];
  editingSurvey: any = null;
  editForm!: FormGroup;
  constructor(private patientSurveyService:PatientSurveyService
    , private fb: FormBuilder,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.loadSurveys();
  }
  loadSurveys(): void {
    this.patientSurveyService.getAll().subscribe((data:any) => {
      this.surveys = data.body;
    });
  }
  toggleActiveStatus(survey: any) {    
    const updatedStatus = !survey.isActive;
    this.patientSurveyService.updateStatus(survey.id, updatedStatus).subscribe({
      next: () => {
        survey.active = updatedStatus; // update UI
        this.toastrService.success('Status Updated');
      },
      error: (err:any) => {
        console.error('Error updating status', err);
        this.toastrService.success('Error During update status');
      }
    });
  }
  buildForm(survey: Survey) {
    this.editForm = this.fb.group({
      name: [survey.name, Validators.required],
      sections: this.fb.array(
        survey.sections.map((section) =>
          this.fb.control(section.title, Validators.required)
        )
      ),
    });
  }
  startEdit(survey: any): void {
    this.editingSurvey = survey;
    this.buildForm(survey);
  }

  get sections(): FormArray {
    return this.editForm.get('sections') as FormArray;
  }

  deleteSection(index: number): void {
    this.sections.removeAt(index);
  }

  saveChanges() {
    if (!this.editingSurvey) return;
  
    const formValue = this.editForm.value;
  
    const updatedSurvey: Survey = {
      ...this.editingSurvey,
      name: formValue.name,
      sections: formValue.sections.map((title: string, idx: number) => ({
        // preserve existing fields if they exist
        ...this.editingSurvey!.sections[idx],
        title: title,
        name: this.editingSurvey!.sections[idx]?.name ?? title.toLowerCase().replace(/\s+/g, "_"),
        questions: this.editingSurvey!.sections[idx]?.questions ?? []
      }))
    };
  
    this.patientSurveyService.update(updatedSurvey).subscribe(() => {
      this.editingSurvey = null;
      this.loadSurveys();
    });
  }

  cancelEdit(): void {
    this.editingSurvey = null;
  }
  showPatientPelvicSurvey() {
    this.isSurvey = true;
  }
  togglePatientPelvicSurvey() {
    this.isSurvey = !this.isSurvey;
  }
  changeVisibility(event: string) {
    if (event === 'close')
      this.isSurvey = false
  }

  
}
