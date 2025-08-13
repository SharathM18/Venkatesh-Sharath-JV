import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// ✅ Hydrate from localStorage on page load
const userFromStorage = localStorage.getItem('user');
const tokenFromStorage = localStorage.getItem('token');

const initialState: AuthState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  token: tokenFromStorage || null,
  loading: false,
  error: null,
  isAuthenticated: !!tokenFromStorage,
};

// LOGIN THUNK
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// REGISTER THUNK
export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    formData: {
      name: string;
      email: string;
      phone: string;
      roleId: string;
      password: string;
      status: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await axios.post('http://localhost:3000/users', formData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.access_token);
        localStorage.setItem('user', JSON.stringify(action.payload.data));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;



// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   loading: boolean;
//   error: string | null;
//   isAuthenticated: boolean;
// }

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   loading: false,
//   error: null,
//   isAuthenticated: false,
// };

// // LOGIN THUNK
// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async (credentials: { email: string; password: string }, thunkAPI) => {
//     try {
//       const response = await axios.post('http://localhost:3000/auth/login', credentials);
//       return response.data;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
//     }
//   }
// );

// // REGISTER THUNK
// export const registerUser = createAsyncThunk(
//   'auth/register',
//   async (
//     formData: {
//       name: string;
//       email: string;
//       phone: string;
//       roleId: string;
//       password: string;
//       status: string;
//     },
//     thunkAPI
//   ) => {
//     try {
//       const response = await axios.post('http://localhost:3000/users', formData);
//       return response.data;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     logout(state) {
//       state.user = null;
//       state.token = null;
//       state.error = null;
//       state.isAuthenticated = false;
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//     },
//   },
//   extraReducers: builder => {
//     builder
//       .addCase(loginUser.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.data;
//         state.token = action.payload.access_token;
//         state.isAuthenticated = true;
//         localStorage.setItem('token', action.payload.access_token);
//         localStorage.setItem('user', JSON.stringify(action.payload.data));
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//         state.isAuthenticated = false;
//       })

//       .addCase(registerUser.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;
