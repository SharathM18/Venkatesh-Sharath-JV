import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTestData = createAsyncThunk(
  'test/fetchData',
  async ({ token, applicantId, attemptId }: any, thunkAPI) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/applicant-questions/resume/${applicantId}/${attemptId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data; // contains: questions, lastSeenQuestion, attemptCount
    } catch (err) {
      return thunkAPI.rejectWithValue('Unable to resume test');
    }
  }
);

export const submitAnswer = createAsyncThunk(
  'test/submitAnswer',
  async ({ token, applicantId, attemptId, questionId, selectedOptionId }: any) => {
    await axios.post(
      'http://localhost:3000/applicant-questions/answer',
      { applicantId, attemptId, questionId, selectedOptionId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { questionId };
  }
);

export const skipQuestion = createAsyncThunk(
  'test/skipQuestion',
  async ({ token, applicantId, attemptId, questionId }: any) => {
    await axios.patch(
      'http://localhost:3000/applicant-questions/skip',
      { applicantId, attemptId, questionId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { questionId };
  }
);

export const evaluateTest = createAsyncThunk(
  'test/evaluate',
  async ({ token, applicantId, attemptId }: any) => {
    const res = await axios.get(
      `http://localhost:3000/applicant-questions/evaluate/${applicantId}/${attemptId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  }
);
