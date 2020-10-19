import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const initialState = {
  session: false,
};

export const logoutSession = createAsyncThunk(
  'session/logoutSession',
  async () => {
    try {
      await api.post('/logout', null, { withCredentials: true });
    } catch (error) {}
  }
);

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, { payload }) => {
      state.session = payload;
    },
  },
  extraReducers: {
    [logoutSession.fulfilled]: (state) => {
      state.session = false;
    },
  },
});

export const { setSession } = sessionSlice.actions;
export const sessionSelector = (state) => state.session;
export default sessionSlice.reducer;
