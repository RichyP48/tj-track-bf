import { apiClient } from '@/lib/api-client';
import { UserRole } from '@/lib/api-types';
import { secureStorage } from '@/lib/secure-storage';
import type { ProfileRequest, LoginRequest, OtpRequest, AuthResponse, ProfileResponse} from '@/lib/api-types';

export const authService = {
  async register(profileData: ProfileRequest): Promise<{ user: ProfileResponse; message: string }> {
    const response = await apiClient.post('/register', profileData);
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse | { requiresVerification: boolean; message: string; email: string }> {
    const response = await apiClient.post('/login', { email, password });
    
    if (response.data.token) {
      secureStorage.setToken(response.data.token);
      
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
      
      secureStorage.setUser(userData);
    }
    
    return response.data;
  },

  async verifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string; token?: string; name?: string; roles?: string[] }> {
    const response = await apiClient.post('/verify-otp', { email, otp });
    
    console.log('OTP verification response:', response.data);
    
    // If login OTP verification returns token, store it
    if (response.data.token) {
      secureStorage.setToken(response.data.token);
      
      // Extract roles from JWT if not in response
      let roles = response.data.roles;
      if (!roles && response.data.token) {
        try {
          const payload = JSON.parse(atob(response.data.token.split('.')[1]));
          roles = payload.roles || [];
          console.log('Extracted roles from JWT:', roles);
        } catch (error) {
          console.error('Error extracting roles from JWT:', error);
        }
      }
      
      const userData = {
        email: response.data.email || email,
        name: response.data.name,
        roles: roles,
        token: response.data.token
      };
      
      console.log('Storing user data:', userData);
      secureStorage.setUser(userData);
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
    secureStorage.clear();
  },

  getCurrentUser(): AuthResponse | null {
    const user = secureStorage.getUser();
    const token = secureStorage.getToken();
    
    if (!user || !token) return null;
    
    const userData = typeof user === 'string' ? JSON.parse(user) : user;
    
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
    try {
      const token = secureStorage.getToken();
      console.log('Auth check - token exists:', !!token);
      
      if (!token) {
        console.log('Auth check - no token found');
        return false;
      }
      
      const isValid = secureStorage.isTokenValid(token);
      console.log('Auth check - token valid:', isValid);
      
      if (!isValid) {
        console.log('Auth check - token invalid, logging out');
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      this.logout();
      return false;
    }
  }
};