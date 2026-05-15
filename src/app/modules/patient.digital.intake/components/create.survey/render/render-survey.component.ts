import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Survey } from 'src/app/modules/patient.admin/models/create.survey/survey.model';
import { PatientSurveyRequest } from '../../../models/survey/patient.survey.request';
import { SurveyData } from '../../../models/survey/survey.data';
import { DigitalIntakeService } from '../../../services/digitalIntake/digital-intake.service';

@Component({
  selector: 'render-survey',
  templateUrl: './render-survey.component.html',
  styleUrls: ['./render-survey.component.css']
})
export class RenderSurveyComponent implements OnInit {
  @Input() token: string;
  @Input() surveyId: number
  @Input() patientId: number;
  @Input() createdpatient: number
  survey: any;
  surveyForm: FormGroup;
  progress = 0;
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const element = document.querySelector('.survey-sticky-header') as HTMLElement;
    if (window.scrollY > 20) {
      element.classList.add('is-stuck');
    } else {
      element.classList.remove('is-stuck');
    }
  }

  

  options = [
    { value: 0, label: 'Never' },
    { value: 1, label: 'Rarely' },
    { value: 2, label: 'Sometimes' },
    { value: 3, label: 'Often' },
    { value: 4, label: 'Always' }
  ];

  constructor(private fb: FormBuilder,
    private digitalIntakeService: DigitalIntakeService,
    private router: Router) {
    this.surveyForm = this.fb.group({});
  }

  ngOnInit() {

    this.digitalIntakeService.findsurveyById(this.surveyId).pipe(
      map(data => data.body)
    ).subscribe((survey: any) => {
      this.survey = survey;
      this.buildFormControls(survey);
    })
    
    // Listen to form value changes to update progress
    this.surveyForm.valueChanges.subscribe(() => {
      this.calculateProgress();
    });
  }
  private buildFormControls(survey: Survey) {
    survey.sections.forEach(section => {
      section.questions.forEach(q => {
        this.surveyForm.addControl(
          q.key,
          this.fb.control('', Validators.required)
        );
      });
    });
  }
  calculateProgress() {
    const totalQuestions = Object.keys(this.surveyForm.controls).length;
    const answeredQuestions = Object.values(this.surveyForm.controls)
      .filter(control => control.value !== null && control.value !== undefined && control.value !== '').length;
    this.progress = Math.round((answeredQuestions / totalQuestions) * 100);
  }


  onSubmit() {
    if (this.surveyForm.valid) {
      var pId = (this.createdpatient === null || this.createdpatient === undefined) ? this.patientId : this.createdpatient;
      var model: PatientSurveyRequest = this.buildSurveyRequest(pId, this.survey.name);
      this.digitalIntakeService.createSurvey(model).subscribe(reVal => {
        this.router.navigateByUrl('/digital-intake/survey-done?token=' + this.digitalIntakeService.token);
      })
    }
  }

  resetForm() {
    this.surveyForm.reset();
    this.progress = 0;
  }
  private buildSurveyRequest(patientId: number, surveyName: string): PatientSurveyRequest {
    const formValue = this.surveyForm.value;

    const surveyData: SurveyData[] = Object.entries(formValue).map(([key, value]) => ({
      questionName: key,
      questionSelection: value as number
    }));

    return {
      patientId,
      surveyName,
      surveyData
    };
  }
}
