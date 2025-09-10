import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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
    { key: 'urinary1', text: 'How often do you experience urinary leakage?' },
    { key: 'urinary2', text: 'Do you feel urgency to urinate?' }
    // Add more questions
  ];

  bowelHealthQuestions = [
    { key: 'bowel1', text: 'How often do you experience bowel control issues?' }
    // Add more questions
  ];

  pelvicCoreQuestions = [
    { key: 'pelvic1', text: 'Do you experience pelvic pain?' }
    // Add more questions
  ];

  sexualHealthQuestions = [
    { key: 'sexual1', text: 'How would you describe your sexual health?' }
    // Add more questions
  ];

  qualityOfLifeQuestions = [
    { key: 'quality1', text: 'How does your condition affect your daily life?' }
    // Add more questions
  ];

  options = [
    { value: 'never', label: 'Never' },
    { value: 'rarely', label: 'Rarely' },
    { value: 'sometimes', label: 'Sometimes' },
    { value: 'often', label: 'Often' },
    { value: 'always', label: 'Always' }
  ];

  constructor(private fb: FormBuilder) {
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
    const answeredQuestions = Object.values(this.surveyForm.controls).filter(control => control.value).length;
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
      console.log('Form submitted:', this.surveyForm.value);
      // Handle form submission
      alert('Thank you for completing the survey!');
    }
  }

  resetForm() {
    this.surveyForm.reset();
    this.progress = 0;
  }
}

