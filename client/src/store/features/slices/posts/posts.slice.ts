import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { BaseResponseType } from '../../../store.types';
import { addPostAction, getPostsAction } from './posts.action';

interface PostsType extends BaseResponseType {
  posts: any;
  successMessage: string;
}

const initialState: PostsType = {
  loading: false,
  error: null,
  posts: null,
  successMessage: '',
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {
    [getPostsAction.fulfilled.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.loading = false;
      state.posts = payload;
      state.error = null;
    },
    [getPostsAction.rejected.toString()]: (state, { payload }: PayloadAction<BaseResponseType>) => {
      state.error = payload;
      state.loading = false;
    },
    [addPostAction.fulfilled.toString()]: (state, { payload }: any) => {
      state.loading = false;
      state.successMessage = payload;
      state.projectError = null;
    },
    [addPostAction.rejected.toString()]: (state, { payload }: PayloadAction<BaseResponseType>) => {
      state.projectError = payload;
      state.loading = false;
    },
  },
});
export default postsSlice.reducer;
