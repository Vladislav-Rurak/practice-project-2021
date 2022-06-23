import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as restController from './../../api/rest/restController';
import { clearContestStore } from './storeContestSlice';
import { changeProfileViewMode } from './userProfileSlice';
import { updateUser } from './userSlice';
import CONSTANTS from './../../constants';

const PAYMENT_SLICE_NAME = 'payment';

export const pay = createAsyncThunk(
  `${PAYMENT_SLICE_NAME}/pay`,
  async ({ data, history }, { rejectWithValue, dispatch }) => {
    try {
      await restController.payMent(data);
      history.replace('dashboard');
      dispatch(clearContestStore());
      dispatch(clearPaymentStore());
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const cashOut = createAsyncThunk(
  `${PAYMENT_SLICE_NAME}/cashOut`,
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await restController.cashOut(payload);
      dispatch(updateUser.fulfilled(data));
      dispatch(clearPaymentStore());
      dispatch(changeProfileViewMode(CONSTANTS.USER_INFO_MODE));
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  isFetching: false,
  error: null,
  focusOnElement: 'number',
};

const reducers = {
  changeFocusOnCard: (state, { payload }) => {
    state.focusOnElement = payload;
  },
  clearPaymentStore: () => initialState,
};

const extraReducers = builder => {
  builder.addCase(pay.pending, state => {
    state.isFetching = true;
    state.error = null;
  });
  builder.addCase(pay.rejected, (state, { payload }) => {
    state.isFetching = false;
    state.error = payload;
  });
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  builder.addCase(cashOut.pending, state => {
    state.isFetching = true;
    state.error = null;
  });
  builder.addCase(cashOut.rejected, (state, { payload }) => {
    state.isFetching = false;
    state.error = payload;
  });
};

const paymentSlice = createSlice({
  name: PAYMENT_SLICE_NAME,
  initialState,
  reducers,
  extraReducers,
});

const { actions, reducer } = paymentSlice;

export const { changeFocusOnCard, clearPaymentStore } = actions;

export default reducer;
