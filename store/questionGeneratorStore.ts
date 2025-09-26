import { create } from 'zustand';

interface SelectOption {
  value: string;
  label: string;
}

interface QuestionGeneratorState {
  exams: SelectOption[];
  courses: SelectOption[];
  subjects: SelectOption[];
  units: SelectOption[];
  chapters: SelectOption[];
  topics: SelectOption[];
  parts: SelectOption[];
  slots: SelectOption[];

  selectedExam: SelectOption | null;
  selectedCourse: SelectOption | null;
  selectedSubject: SelectOption | null;
  selectedUnit: SelectOption | null;
  selectedChapter: SelectOption | null;
  selectedTopic: SelectOption | null;
  selectedPart: SelectOption | null;
  selectedSlot: SelectOption | null;

  generationMode: 'new_questions' | 'pyq_solutions';
  questionType: 'MCQ' | 'MSQ' | 'NAT' | 'SUB';
  numberOfQuestions: number;
  timeMinutes: number;
  correctMarks: number;
  incorrectMarks: number;
  skippedMarks: number;
  partialMarks: number;

  newQuestionsGeneratedCount: number;
  pyqSolutionsGeneratedCount: number;

  setExams: (exams: SelectOption[]) => void;
  setCourses: (courses: SelectOption[]) => void;
  setSubjects: (subjects: SelectOption[]) => void;
  setUnits: (units: SelectOption[]) => void;
  setChapters: (chapters: SelectOption[]) => void;
  setTopics: (topics: SelectOption[]) => void;
  setParts: (parts: SelectOption[]) => void;
  setSlots: (slots: SelectOption[]) => void;

  setSelectedExam: (exam: SelectOption | null) => void;
  setSelectedCourse: (course: SelectOption | null) => void;
  setSelectedSubject: (subject: SelectOption | null) => void;
  setSelectedUnit: (unit: SelectOption | null) => void;
  setSelectedChapter: (chapter: SelectOption | null) => void;
  setSelectedTopic: (topic: SelectOption | null) => void;
  setSelectedPart: (part: SelectOption | null) => void;
  setSelectedSlot: (slot: SelectOption | null) => void;

  setGenerationMode: (mode: 'new_questions' | 'pyq_solutions') => void;
  setQuestionType: (type: 'MCQ' | 'MSQ' | 'NAT' | 'SUB') => void;
  setNumberOfQuestions: (num: number) => void;
  setTimeMinutes: (time: number) => void;
  setCorrectMarks: (marks: number) => void;
  setIncorrectMarks: (marks: number) => void;
  setSkippedMarks: (marks: number) => void;
  setPartialMarks: (marks: number) => void;

  incrementNewQuestionsGenerated: (count: number) => void;
  incrementPyqSolutionsGenerated: (count: number) => void;
}

export const useQuestionGeneratorStore = create<QuestionGeneratorState>((set) => ({
  exams: [],
  courses: [],
  subjects: [],
  units: [],
  chapters: [],
  topics: [],
  parts: [],
  slots: [],

  selectedExam: null,
  selectedCourse: null,
  selectedSubject: null,
  selectedUnit: null,
  selectedChapter: null,
  selectedTopic: null,
  selectedPart: null,
  selectedSlot: null,

  generationMode: 'new_questions',
  questionType: 'MCQ',
  numberOfQuestions: 30,
  timeMinutes: 3,
  correctMarks: 4,
  incorrectMarks: -1,
  skippedMarks: 0,
  partialMarks: 0,

  newQuestionsGeneratedCount: 0,
  pyqSolutionsGeneratedCount: 0,

  setExams: (exams) => set({ exams }),
  setCourses: (courses) => set({ courses }),
  setSubjects: (subjects) => set({ subjects }),
  setUnits: (units) => set({ units }),
  setChapters: (chapters) => set({ chapters }),
  setTopics: (topics) => set({ topics }),
  setParts: (parts) => set({ parts }),
  setSlots: (slots) => set({ slots }),

  setSelectedExam: (selectedExam) => set({ selectedExam, selectedCourse: null, selectedSubject: null, selectedUnit: null, selectedChapter: null, selectedTopic: null, courses: [], subjects: [], units: [], chapters: [], topics: [] }),
  setSelectedCourse: (selectedCourse) => set({ selectedCourse, selectedSubject: null, selectedUnit: null, selectedChapter: null, selectedTopic: null, subjects: [], units: [], chapters: [], topics: [] }),
  setSelectedSubject: (selectedSubject) => set({ selectedSubject, selectedUnit: null, selectedChapter: null, selectedTopic: null, units: [], chapters: [], topics: [] }),
  setSelectedUnit: (selectedUnit) => set({ selectedUnit, selectedChapter: null, selectedTopic: null, chapters: [], topics: [] }),
  setSelectedChapter: (selectedChapter) => set({ selectedChapter, selectedTopic: null, topics: [] }),
  setSelectedTopic: (selectedTopic) => set({ selectedTopic }),
  setSelectedPart: (selectedPart) => set({ selectedPart }),
  setSelectedSlot: (selectedSlot) => set({ selectedSlot }),

  setGenerationMode: (generationMode) => set({ generationMode }),
  setQuestionType: (questionType) => set({ questionType }),
  setNumberOfQuestions: (numberOfQuestions) => set({ numberOfQuestions }),
  setTimeMinutes: (timeMinutes) => set({ timeMinutes }),
  setCorrectMarks: (correctMarks) => set({ correctMarks }),
  setIncorrectMarks: (incorrectMarks) => set({ incorrectMarks }),
  setSkippedMarks: (skippedMarks) => set({ skippedMarks }),
  setPartialMarks: (partialMarks) => set({ partialMarks }),

  incrementNewQuestionsGenerated: (count) => set((state) => ({ newQuestionsGeneratedCount: state.newQuestionsGeneratedCount + count })),
  incrementPyqSolutionsGenerated: (count) => set((state) => ({ pyqSolutionsGeneratedCount: state.pyqSolutionsGeneratedCount + count })),
}));
