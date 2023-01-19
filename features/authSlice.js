import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { interceptorResponseErr } from '@utils/interceptor';
import axios from 'axios';

const initialState = {
  user: null,
  error: '',
  message: null
};

export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    const { email, password } = data;
    try {
      axios.interceptors.response.use(
        res => res,
        error => interceptorResponseErr(error)
      );
      const res = await axios.post(
        'https://api-corp-hc-services.bumame.com/api/v1/users/login',
        {
          email,
          password
        }
      );
      return response.data.payload.token;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    retrieveLocalStorage: state => {
      const user = localStorage.getItem('user');
      if (user) {
        state.user = JSON.parse(user);
      }
    },
    logout: state => {
      state.user = null;
      state.error = null;
      state.message = null;
      localStorage.removeItem('user');
    }
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.error = null;
      state.message = null;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    [login.rejected]: (state, action) => {
      state.error = action.payload;
      state.message = null;
    }
  }
});

export default authSlice;
