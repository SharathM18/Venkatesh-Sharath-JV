import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchTestData, submitAnswer, skipQuestion, evaluateTest } from './testThunks';

interface Option {
  id: string;
  optionText: string;
  isCorrect: boolean;
}
interface MCQ {
  id: string;
  questionTitle: string;
  difficulty: string;
  options: Option[];
}
interface ApiQuestion {
  id: string;
  status: 'not_visited' | 'skipped' | 'answered';
  selectedOptionId: string | null;
  editable: boolean;
  mcq_question: MCQ;
}

interface TestState {
  questions: ApiQuestion[];
  currentIndex: number;
  unlockedIndex: number;
  answers: Record<string, string>;
  timeLeft: number;
  started: boolean;
  submitted: boolean;
  score: number | null;
  loading: boolean;
}

const initialState: TestState = {
  questions: [],
  currentIndex: 0,
  unlockedIndex: 0,
  answers: {},
  timeLeft: 45 * 60,
  started: false,
  submitted: false,
  score: null,
  loading: false,
};

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    setStarted(state, action: PayloadAction<boolean>) {
      state.started = action.payload;
    },
    setCurrentIndex(state, action: PayloadAction<number>) {
      state.currentIndex = action.payload;
    },
    setAnswer(state, action: PayloadAction<{ questionId: string; optionId: string }>) {
      state.answers[action.payload.questionId] = action.payload.optionId;
    },
    decrementTime(state) {
      state.timeLeft -= 1;
    },
    resetTimer(state) {
      state.timeLeft = 45 * 60;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestData.fulfilled, (state, action) => {
        const { questions, lastSeenQuestion } = action.payload;
        state.questions = questions;
        state.answers = {};
        questions.forEach((q: ApiQuestion) => {
          if (q.selectedOptionId) {
            state.answers[q.mcq_question.id] = q.selectedOptionId;
          }
        });
        state.currentIndex = lastSeenQuestion
          ? questions.findIndex((q: ApiQuestion) => q.mcq_question.id === lastSeenQuestion.id)
          : 0;
        state.loading = false;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        const { questionId } = action.payload;
        const question = state.questions.find(q => q.mcq_question.id === questionId);
        if (question) {
          question.status = 'answered';
          question.editable = false;
        }
      })
      .addCase(skipQuestion.fulfilled, (state, action) => {
        const { questionId } = action.payload;
        const question = state.questions.find(q => q.mcq_question.id === questionId);
        if (question) {
          question.status = 'skipped';
          question.editable = true;
        }
      })
      .addCase(evaluateTest.fulfilled, (state, action) => {
        state.score = action.payload.correct;
        state.submitted = true;
      });
  }
});

export const { setStarted, setCurrentIndex, setAnswer, decrementTime, resetTimer } = testSlice.actions;
export default testSlice.reducer;