import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private _userRole = signal<'user' | 'admin'>('user');
  userRole = this._userRole.asReadonly();
  isAdmin = computed(() => this._userRole() == 'admin');

  updateRole(role: 'user' | 'admin') {
    this._userRole.set(role);
  }

  signUp(data: any) {
    return this.http.post('http://localhost:3000/api/users/register', data);
  }

  login(data: any) {
    return this.http.post('http://localhost:3000/api/users/login', data);
  }

  async saveToken(token: string) {
    await Preferences.set({
      key: 'auth_token',
      value: token,
    });
  }

  async getToken() {
    const { value } = await Preferences.get({ key: 'auth_token' });
    return value;
  }

  async logout() {
    await Preferences.remove({ key: 'auth_token' });
  }
}
