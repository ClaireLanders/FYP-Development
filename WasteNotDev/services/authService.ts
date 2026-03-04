// Service layer for authentication API calls (US14).
// Handles login requests to the backend.

import { api } from './api';
import type { LoginRequest, LoginResponse } from './types';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/login', data);
    return response.data;
  },
};