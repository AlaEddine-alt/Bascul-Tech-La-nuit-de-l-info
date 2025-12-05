import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface UserProgress {
  id: string;
  challenge_id: string;
  created_by: string;
  status: 'todo' | 'submitted' | 'validated';
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserProgressService {
  
  // Mock data - Replace with actual API call
  // TODO: Replace with: return this.http.get<UserProgress[]>('/api/user-progress');
  getUserProgress(userEmail: string): Observable<UserProgress[]> {
    // Mock progress data
    const mockProgress: UserProgress[] = [
      {
        id: '1',
        challenge_id: '1',
        created_by: userEmail,
        status: 'validated'
      },
      {
        id: '2',
        challenge_id: '2',
        created_by: userEmail,
        status: 'submitted'
      }
    ];
    
    return of(mockProgress).pipe(delay(300));
  }
}
