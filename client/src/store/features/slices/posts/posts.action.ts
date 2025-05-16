import { createAsyncThunk } from '@reduxjs/toolkit';
import { startLoading, stopLoading } from '../loader/loader.slice';
import axiosInstance from '../../../../api/axiosConfig';
import { backendUrls } from '../../../../api/urls';

export const getPostsAction = createAsyncThunk('posts/get-posts', async (args, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const res = await axiosInstance.get(`${backendUrls.posts.GET_POSTS}?limit=1000`);
    return res?.data?.result;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue(error);
    }
  }
});
export const addPostAction = createAsyncThunk(
  'posts/add-post',
  async (data: any, { rejectWithValue, dispatch }) => {
    dispatch(startLoading());
    try {
      const res = await axiosInstance.post(backendUrls.projects.ADD_POST, data.formData, {
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
export const getPostDetailsAction = createAsyncThunk(
  'posts/post-details',
  async (data: any, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(startLoading());
    try {
      const res = await axiosInstance.get(`${backendUrls.posts.GET_POST_DETAILS(data?.id)}`, {
        headers: {
          Authorization: `Bearer ${data?.token}`,
        },
      });
      return res?.data;
    } catch (error: any) {
      return rejectWithValue(error);
    } finally {
      dispatch(stopLoading());
    }
  },
);
