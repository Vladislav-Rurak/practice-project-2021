import { createAsyncThunk } from '@reduxjs/toolkit';

export const pendingReducer = state => {
  state.isFetching = true;
  state.error = null;
};

export const fulfilledReducer = state => {
  state.isFetching = false;
};

export const rejectedReducer = (state, { payload }) => {
  state.isFetching = false;
  state.error = payload;
};

/**
 * Decorate createAsyncThunk by taking out repeating error catching code
 * @param {Object} thunkOptions - options
 * @param {string} thunkOptions.key - thunk typePrefix
 * @param {Function} thunkOptions.thunk - async thunk
 * @returns {AsyncThunk} Async Thunk object with typePrefix key and async function thunk
 */

export const decorateAsyncThunk = ({ key, thunk }) => {
  const asyncThunk = createAsyncThunk(key, async (payload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      return await thunk(payload, thunkAPI);
    } catch ({ response: { data, status } }) {
      return rejectWithValue({ data, status });
    }
  });
  return asyncThunk;
};
