import { createAsyncThunk } from '@reduxjs/toolkit';
import { backendUrls } from '../../../../api/urls';
import { startLoading, stopLoading } from '../loader/loader.slice';
import { toast } from 'react-toastify';
import axiosInstance from '../../../../api/axiosConfig';

export const addCategoryAction = createAsyncThunk(
  'categories/add-category',
  async (data: any, { rejectWithValue, dispatch }) => {
    dispatch(startLoading());
    try {
      const res = await axiosInstance.post(backendUrls.categories.ADD_CATEGORY, data.formData, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      // toast.success(res?.data.message);
      return res?.data?.message;
    } catch (error: any) {
      return rejectWithValue(error);
    } finally {
      dispatch(stopLoading());
    }
  },
);

export const getCategoriesAction = createAsyncThunk(
  'categories/categories',
  async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.get(backendUrls.categories.GET_CATEGORIES);
      return res?.data?.result;
    } catch (error: any) {
      if (error?.message) {
        return rejectWithValue(error?.message);
      } else {
        return rejectWithValue(error);
      }
    } finally {
      dispatch(stopLoading());
    }
  },
);

export const getCategoryPostsAction = createAsyncThunk(
  'categories/category-posts',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.get(backendUrls.categories.GET_CATEGORY_POSTS(data?.id));
      return res?.data;
    } catch (error: any) {
      return rejectWithValue(error);
    } finally {
      dispatch(stopLoading());
    }
  },
);

export const updateCategorytAction = createAsyncThunk(
  'categories/update-category',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.patch(backendUrls.categories.UPDATE_CATEGORY(data?.id), data.content, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      toast.success('Category Updated!');
      return res?.data?.result;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error);
      }
    } finally {
      dispatch(stopLoading());
    }
  },
);

export const deleteCategorytAction = createAsyncThunk(
  'categories/delete-category',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.delete(backendUrls.categories.DELETE_CATEGORY(data?.id), {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      toast.success('Category Deleted!');
      return res?.data?.result;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error);
      }
    } finally {
      dispatch(stopLoading());
    }
  },
);

