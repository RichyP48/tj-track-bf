import { apiClient } from '@/lib/api-client';
import { UserRole } from '@/lib/api-types';
import type { ProfileRequest, LoginRequest, OtpRequest, AuthResponse, ProfileResponse} from '@/lib/api-types';

export const authService = {
  async register(profileData: ProfileRequest): Promise<{ user: ProfileResponse; message: string }> {
    const response = await apiClient.post('/register', profileData);
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse | { requiresVerification: boolean; message: string; email: string }> {
    const response = await apiClient.post('/login', { email, password });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      // Extract roles from JWT if not provided in response
      let userData = response.data;
      if (!userData.roles && response.data.token) {
        try {
          const payload = JSON.parse(atob(response.data.token.split('.')[1]));
          userData = { ...userData, roles: payload.roles || [] };
        } catch (error) {
          console.error('Error decoding JWT:', error);
        }
      }
      
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return response.data;
  },

  async verifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string; token?: string; name?: string; roles?: string[] }> {
    const response = await apiClient.post('/verify-otp', { email, otp });
    
    // If login OTP verification returns token, store it
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        email: response.data.email,
        name: response.data.name,
        roles: response.data.roles,
        token: response.data.token
      }));
    }
    
    return response.data;
  },

  async verifyRegistrationOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/register-otp', { email, otp });
    return response.data;
  },

  async sendResetOtp(email: string): Promise<void> {
    await apiClient.post('/send-reset-otp', null, { params: { email } });
  },

  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    await apiClient.post('/reset-password', { email, otp, newPassword });
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): AuthResponse | null {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!user || !token) return null;
    
    const userData = JSON.parse(user);
    
    // If roles are missing, try to extract from JWT token
    if (!userData.roles && token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userData.roles = payload.roles || [];
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }
    }
    
    return userData;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};