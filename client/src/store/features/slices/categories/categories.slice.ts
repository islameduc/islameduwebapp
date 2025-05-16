import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addCategoryAction, getCategoriesAction } from './categories.action';
import { BaseResponseType } from '../../../store.types';

interface ProjectsType extends BaseResponseType {
  projects: any;
  allProjects: any;
  project: any;
  successMessage: string;
}

const initialState: ProjectsType = {
  loading: false,
  error: null,
  projects: null,
  allProjects: null,
  project: null,
  successMessage: '',
  projectError: null,
};
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: {
    [getCategoriesAction.fulfilled.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.loading = false;
      state.projects = payload;
      state.projectError = null;
    },
    [getCategoriesAction.rejected.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.projectError = payload;
      state.loading = false;
    },
    [addCategoryAction.fulfilled.toString()]: (state, { payload }: any) => {
      state.loading = false;
      state.successMessage = payload;
      state.projectError = null;
    },
    [addCategoryAction.rejected.toString()]: (
      state,
      { payload }: PayloadAction<BaseResponseType>,
    ) => {
      state.projectError = payload;
      state.loading = false;
    },
  },
});
export default projectsSlice.reducer;
