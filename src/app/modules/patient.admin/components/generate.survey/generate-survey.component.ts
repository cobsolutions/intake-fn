import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { STANDARD_ANSWER_OPTIONS } from '../../models/create.survey/answer-options.const';
import { Survey, SurveyQuestion, SurveySection } from '../../models/create.survey/survey.model';
import { PatientSurveyService } from '../../services/survey/patient-survey.service';

@Component({
  selector: 'generate-survey',
  templateUrl: './generate-survey.component.html',
  styleUrls: ['./generate-survey.component.css']
})
export class GenerateSurveyComponent implements OnInit {
  @Output() changeVisibility = new EventEmitter<string>()
  isEdit = false;

  form: FormGroup = this.fb.group({
    id: [null],
    name: ['', Validators.required],
    sections: this.fb.array([]),
    isActive: [true],
  });
  // question editor
  editingQuestion: { sectionIndex: number; questionIndex: number } | null = null;
  questionEditor = this.fb.group({
    key: [''],
    text: ['', Validators.required]
  });
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private patientSurveyService:PatientSurveyService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {

  }
  get sections(): FormArray {
    return this.form.get('sections') as FormArray;
  }

  getQuestions(sectionIndex: number): FormArray {
    return this.sections.at(sectionIndex).get('questions') as FormArray;
  }
  private prepareSurveyForForm(s: Survey): Survey {
    return {
      ...s,
      sections: (s.sections || []).map(sec => ({
        ...sec,
        questions: (sec.questions || []).map(q => ({
          ...q,
          answerOptions: q.answerOptions && q.answerOptions.length ? q.answerOptions : STANDARD_ANSWER_OPTIONS
        }))
      }))
    };
  }
  addSectionInline(): void {
    const name = this.generateSafeKey(`section_${this.sections.length + 1}`);
    this.addSection(name, `Section ${this.sections.length + 1}`);
  }
  addSection(name: string, title: string): void {
    const sectionGroup = this.fb.group({
      name: [name, Validators.required],
      title: [title, Validators.required],
      questions: this.fb.array([])
    });
    this.sections.push(sectionGroup);
  }
  setSections(secs: SurveySection[]): void {
    this.sections.clear();
    (secs || []).forEach(sec => {
      const questionsArray = this.fb.array([]);
      (sec.questions || []).forEach((q: SurveyQuestion) => {
        var dd: any = this.fb.group({
          key: [q.key || this.generateSafeKey('q')],
          text: [q.text || '', Validators.required],
          answerOptions: [q.answerOptions || STANDARD_ANSWER_OPTIONS]
        })
        questionsArray.push(dd);
      });
      const secGroup = this.fb.group({
        name: [sec.name || this.generateSafeKey('section'), Validators.required],
        title: [sec.title || '', Validators.required],
        questions: questionsArray
      });
      this.sections.push(secGroup);
    });
  }
  removeSection(index: number): void {
    if (confirm('Remove this section?')) {
      this.sections.removeAt(index);
    }
  }
  addQuestion(sectionIndex: number, question?: Partial<SurveyQuestion>): void {
    const questions = this.getQuestions(sectionIndex);
    questions.push(this.fb.group({
      key: [question?.key || this.generateSafeKey('q')],
      text: [question?.text || '', Validators.required],
      answerOptions: [question?.answerOptions || STANDARD_ANSWER_OPTIONS]
    }));
  }
  removeQuestion(sectionIndex: number, questionIndex: number): void {
    const q = this.getQuestions(sectionIndex);
    if (confirm('Remove this question?')) {
      q.removeAt(questionIndex);
    }
  }
  openQuestionEditor(sectionIndex: number, questionIndex: number): void {
    const qg = this.getQuestions(sectionIndex).at(questionIndex);
    this.questionEditor.patchValue({
      key: qg.get('key')?.value,
      text: qg.get('text')?.value
    });
    this.editingQuestion = { sectionIndex, questionIndex };
  }

  closeQuestionEditor(): void {
    this.editingQuestion = null;
    this.questionEditor.reset();
  }
  saveQuestionEdit(): void {
    if (!this.editingQuestion) return;
    if (this.questionEditor.invalid) {
      this.questionEditor.markAllAsTouched();
      return;
    }
    const { sectionIndex, questionIndex } = this.editingQuestion;
    const qg = this.getQuestions(sectionIndex).at(questionIndex);
    qg.patchValue({
      key: this.generateSafeKey(this.questionEditor.value.key || qg.get('key')?.value),
      text: this.questionEditor.value.text
    });
    this.closeQuestionEditor();
  }
  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: Survey = this.form.value;
    payload.sections = (payload.sections || []).map(sec => ({
      ...sec,
      questions: (sec.questions || []).map((q: any) => ({
        ...q,
        answerOptions: q.answerOptions?.length ? q.answerOptions : STANDARD_ANSWER_OPTIONS
      }))
    }));
    this.patientSurveyService.create(payload).subscribe(re=>{
      this.toastrService.success('survey is created successfully')
      this.changeVisibility.emit('close')
    })
  }

  generateSafeKey(seed: string): string {
    const base = (seed || '').replace(/\s+/g, '_').toLowerCase();
    const suffix = Math.random().toString(36).substring(2, 7);
    return `${base}_${suffix}`;
  }
}
