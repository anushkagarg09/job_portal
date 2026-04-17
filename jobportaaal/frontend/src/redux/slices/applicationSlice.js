import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMyApplications = createAsyncThunk('applications/fetchMyApplications', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/applications/my-applications');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    myApplications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications = action.payload.data;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching applications';
      });
  },
});

export default applicationSlice.reducer;
