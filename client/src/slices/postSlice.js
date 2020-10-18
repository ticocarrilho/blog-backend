import { createSlice } from '@reduxjs/toolkit';
import api from '../services/api';

export const initialState = {
  loading: false,
  posts: [],
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    getAllPostsSucess: (state, { payload }) => {
      state.posts = payload;
      state.loading = false;
    },
  },
});

export const { setLoading, getAllPostsSucess } = postSlice.actions;
export const postSelector = (state) => state;
export default postSlice.reducer;

export const fetchPosts = () => {
  return async (dispatch) => {
    dispatch(setLoading());
    try {
      const { data } = await api.get('/post');
      dispatch(getAllPostsSucess(data));
    } catch (error) {}
  };
};
