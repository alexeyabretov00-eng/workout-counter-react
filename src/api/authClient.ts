import { ApiJsonClient, ApiRequestError } from '@utils';

export type AuthUserDto = {
  id: number;
  login: string;
};

class AuthClient extends ApiJsonClient {
  async register(login: string, password: string): Promise<{ user: AuthUserDto }> {
    return this.request('/register', {
      method: 'POST',
      jsonBody: { login, password },
    });
  }

  async login(login: string, password: string): Promise<{ user: AuthUserDto }> {
    return this.request('/login', {
      method: 'POST',
      jsonBody: { login, password },
    });
  }

  async logout(): Promise<void> {
    await this.request<{ ok: boolean }>('/logout', {
      method: 'POST',
      jsonBody: {},
    });
  }

  async me(): Promise<{ user: AuthUserDto } | null> {
    try {
      return await this.request<{ user: AuthUserDto }>('/me', { method: 'GET' });
    } catch (error: unknown) {
      if (error instanceof ApiRequestError && error.code === 'UNAUTHORIZED') {
        return null;
      }
      throw error;
    }
  }
}

export const authClient = new AuthClient();
