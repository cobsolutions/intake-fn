import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientSurveyRequest } from 'src/app/modules/patient.digital.intake/models/survey/patient.survey.request';
import { SurveyData } from 'src/app/modules/patient.digital.intake/models/survey/survey.data';
import { DigitalIntakeService } from 'src/app/modules/patient.digital.intake/services/digitalIntake/digital-intake.service';


@Component({
  selector: 'pelvic-survey',
  templateUrl: './pelvic-survey.component.html',
  styleUrls: ['./pelvic-survey.component.css']
})
export class PelvicSurveyComponent implements OnInit {
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

  // Define your questions here
  urinaryHealthQuestions = [
    { key: 'urinary1', text: 'Do you leak urine when coughing, laughing, or exercising?' },
    { key: 'urinary2', text: 'Do you leak urine before reaching the toilet (urgency)?' },
    { key: 'urinary3', text: 'Do you feel unable to fully empty your bladder?' },
    { key: 'urinary4', text: 'Do you wake up more than twice at night to urinate?' },
    // Add more questions
  ];

  bowelHealthQuestions = [
    { key: 'bowel1', text: 'Do you often experience constipation (fewer than 3 bowel movements per week)?' },
    { key: 'bowel2', text: 'Do you strain during bowel movements?' },
    { key: 'bowel3', text: 'Do you feel incomplete emptying after a bowel movement?' },
    { key: 'bowel4', text: 'Do you have leakage of stool or gas?' }
    // Add more questions
  ];

  pelvicCoreQuestions = [
    { key: 'pelvic1', text: 'Do you feel heaviness/bulging in your pelvic area?' },
    { key: 'pelvic2', text: 'Do you have pelvic or low back pain that limits daily life?' },
    { key: 'pelvic3', text: 'Do you find it hard to activate/relax your pelvic floor muscles?' },
    // Add more questions
  ];

  sexualHealthQuestions = [
    { key: 'sexual1', text: 'Do you experience pain during sexual activity?' },
    { key: 'sexual2', text: 'Do you have difficulty achieving orgasm due to pelvic discomfort?' },
    { key: 'sexual3', text: 'Do you avoid intimacy due to pelvic/urinary/bowel issues?' },
    { key: 'sexual4', text: 'Do you feel reduced sexual satisfaction compared to before?' }
    // Add more questions
  ];

  qualityOfLifeQuestions = [
    { key: 'quality1', text: 'Do your symptoms limit your ability to exercise or be active?' },
    { key: 'quality2', text: 'Do your symptoms interfere with social/work activities?' },
    { key: 'quality3', text: 'Do your symptoms affect your confidence or self-esteem?' }
    // Add more questions
  ];

  options = [
    { value: 0, label: 'Never' },
    { value: 1, label: 'Rarely' },
    { value: 2, label: 'Sometimes' },
    { value: 3, label: 'Often' },
    { value: 4, label: 'Always' }
  ];

  constructor(private fb: FormBuilder,private digitalIntakeService:DigitalIntakeService) {
    this.surveyForm = this.fb.group({});
  }

  ngOnInit() {
    // Create form controls for all questions
    this.createFormControls();

    // Listen to form value changes to update progress
    this.surveyForm.valueChanges.subscribe(() => {
      this.calculateProgress();
    });
  }

  createFormControls() {
    // Add controls for all questions
    const allQuestions = [
      ...this.urinaryHealthQuestions,
      ...this.bowelHealthQuestions,
      ...this.pelvicCoreQuestions,
      ...this.sexualHealthQuestions,
      ...this.qualityOfLifeQuestions
    ];

    allQuestions.forEach(question => {
      this.surveyForm.addControl(question.key, this.fb.control('', Validators.required));
    });
  }

  calculateProgress() {
    const totalQuestions = Object.keys(this.surveyForm.controls).length;
    const answeredQuestions = Object.values(this.surveyForm.controls)
      .filter(control => control.value !== null && control.value !== undefined && control.value !== '').length;
    this.progress = Math.round((answeredQuestions / totalQuestions) * 100);
  }

  getQuestionIndex(sectionIndex: number, questionIndex: number): number {
    // Calculate the global question index
    const sections = [
      this.urinaryHealthQuestions,
      this.bowelHealthQuestions,
      this.pelvicCoreQuestions,
      this.sexualHealthQuestions,
      this.qualityOfLifeQuestions
    ];

    let index = 0;
    for (let i = 0; i < sectionIndex; i++) {
      index += sections[i].length;
    }
    return index + questionIndex + 1;
  }

  onSubmit() {
    if (this.surveyForm.valid) {
      
      console.log(JSON.stringify(this.buildSurveyRequest(1,"Pelvic")));
      // Handle form submission
      alert('Thank you for completing the survey!');
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

