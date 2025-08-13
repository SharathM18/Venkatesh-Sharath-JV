// src/redux/slices/proctorSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ProctorState {
  capturedImage: string | null;
  alertMessage: string;
  isTestStarted: boolean;
  isTestCompleted: boolean;
  malpracticeCount: number;
  verificationComplete: boolean;
}

const initialState: ProctorState = {
  capturedImage: null,
  alertMessage: '',
  isTestStarted: false,
  isTestCompleted: false,
  malpracticeCount: 0,
  verificationComplete: false,
};

const proctorSlice = createSlice({
  name: 'proctor',
  initialState,
  reducers: {
    setCapturedImage(state, action: PayloadAction<string | null>) {
      state.capturedImage = action.payload;
    },
    setAlertMessage(state, action: PayloadAction<string>) {
      state.alertMessage = action.payload;
    },
    setIsTestStarted(state, action: PayloadAction<boolean>) {
      state.isTestStarted = action.payload;
    },
    setIsTestCompleted(state, action: PayloadAction<boolean>) {
      state.isTestCompleted = action.payload;
    },
    setMalpracticeCount(state, action: PayloadAction<number>) {
      state.malpracticeCount = action.payload;
    },
    incrementMalpractice(state) {
      if (state.malpracticeCount < 5) {
        state.malpracticeCount += 1;
      }
    },
    setVerificationComplete(state, action: PayloadAction<boolean>) {
      state.verificationComplete = action.payload;
    },
    resetProctorState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setCapturedImage,
  setAlertMessage,
  setIsTestStarted,
  setIsTestCompleted,
  setMalpracticeCount,
  incrementMalpractice,
  setVerificationComplete,
  resetProctorState,
} = proctorSlice.actions;

export default proctorSlice.reducer;
