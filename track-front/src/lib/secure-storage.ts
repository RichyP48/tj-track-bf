// Gestion sécurisée du stockage des tokens
class SecureStorage {
  private readonly TOKEN_KEY = 'tj_track_token';
  private readonly USER_KEY = 'tj_track_user';

  setToken(token: string): void {
    try {
      const encoded = btoa(token);
      localStorage.setItem(this.TOKEN_KEY, encoded);
    } catch (error) {
      console.error('Erreur lors du stockage du token:', error);
    }
  }

  getToken(): string | null {
    try {
      const encoded = localStorage.getItem(this.TOKEN_KEY);
      return encoded ? atob(encoded) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  setUser(user: any): void {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Erreur lors du stockage utilisateur:', error);
    }
  }

  getUser(): any | null {
    try {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération utilisateur:', error);
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Validation du token côté client
  isTokenValid(token: string): boolean {
    try {
      if (!token || token.split('.').length !== 3) {
        return false;
      }
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp && payload.exp > currentTime;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
}

export const secureStorage = new SecureStorage();