import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  // Mock user - Replace with actual API call
  // TODO: Replace with: return this.http.get<User>('/api/auth/me');
  getCurrentUser(): Observable<User> {
    return of({
      id: '1',
      email: 'user@example.com',
      name: 'Test User'
    }).pipe(delay(200));
  }
}
