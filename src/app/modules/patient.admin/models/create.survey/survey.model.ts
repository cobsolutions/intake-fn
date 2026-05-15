export interface AnswerOption {
    value: number;
    label: string;
  }
  
  export interface SurveyQuestion {
    key: string;
    text: string;
    answerOptions: AnswerOption[];
  }
  
  export interface SurveySection {
    name: string; // internal key, e.g. "urinary_health"
    title: string; // visible title
    questions: SurveyQuestion[];
  }
  
  export interface Survey {
    id?: string;
    name: string;
    sections: SurveySection[];
    isActive: boolean;
  }