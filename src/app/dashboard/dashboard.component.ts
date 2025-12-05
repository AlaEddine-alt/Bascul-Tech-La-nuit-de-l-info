import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChallengeService, Challenge } from '../services/challenge.service';
import { UserService, User } from '../services/user.service';
import { UserProgressService, UserProgress } from '../services/user-progress.service';

interface Stat {
  name: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('fadeInUp', [
      state('void', style({ opacity: 0, transform: 'translateY(10px)' })),
      transition(':enter', [
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      state('void', style({ opacity: 0, transform: 'translateX(-20px)' })),
      transition(':enter', [
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  challenges: Challenge[] = [];
  progressData: UserProgress[] = [];
  
  loadingChallenges = false;
  loadingProgress = false;
  
  totalPoints = 0;
  earnedPoints = 0;
  progressPercentage = 0;
  isCompleted = false;
  
  stats: Stat[] = [];

  constructor(
    private challengeService: ChallengeService,
    private userService: UserService,
    private userProgressService: UserProgressService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Load user
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
      if (user) {
        this.loadProgress(user.email);
      }
    });

    // Load challenges
    this.loadingChallenges = true;
    this.challengeService.getChallenges().subscribe({
      next: (challenges) => {
        this.challenges = challenges;
        this.loadingChallenges = false;
        this.calculateStats();
      },
      error: () => {
        this.loadingChallenges = false;
      }
    });
  }

  loadProgress(userEmail: string): void {
    this.loadingProgress = true;
    this.userProgressService.getUserProgress(userEmail).subscribe({
      next: (progress) => {
        this.progressData = progress;
        this.loadingProgress = false;
        this.calculateStats();
      },
      error: () => {
        this.loadingProgress = false;
      }
    });
  }

  calculateStats(): void {
    // Calculate total points
    this.totalPoints = this.challenges.reduce((acc, curr) => acc + (curr.points || 0), 0);
    
    // Calculate earned points
    this.earnedPoints = this.progressData
      .filter(p => p.status === 'validated' || p.status === 'submitted')
      .reduce((acc, p) => {
        const challenge = this.challenges.find(c => c.id === p.challenge_id);
        return acc + (challenge?.points || 0);
      }, 0);
    
    // Calculate progress percentage
    this.progressPercentage = this.totalPoints > 0 ? (this.earnedPoints / this.totalPoints) * 100 : 0;
    this.isCompleted = this.progressPercentage === 100;
    
    // Calculate stats for chart
    const validatedCount = this.progressData.filter(p => p.status === 'validated').length;
    const submittedCount = this.progressData.filter(p => p.status === 'submitted').length;
    const todoCount = this.challenges.length - this.progressData.length;
    
    this.stats = [
      { name: 'Validé', value: validatedCount, color: '#10b981' },
      { name: 'En Attente', value: submittedCount, color: '#f59e0b' },
      { name: 'À Faire', value: todoCount, color: '#334155' },
    ];
  }

  getTaskStatus(challengeId: string): 'todo' | 'submitted' | 'validated' {
    const record = this.progressData.find(p => p.challenge_id === challengeId);
    return record ? record.status : 'todo';
  }

  isTaskDone(challengeId: string): boolean {
    const status = this.getTaskStatus(challengeId);
    return status === 'validated' || status === 'submitted';
  }

  trackByChallengeId(index: number, challenge: Challenge): string {
    return challenge.id;
  }

  // Expose Math to template
  Math = Math;

  // Calculate pie chart path
  getPiePath(stat: Stat, index: number): string {
    const total = this.stats.reduce((sum, s) => sum + s.value, 0);
    if (total === 0 || stat.value === 0) {
      // Return empty path for zero values
      return '';
    }
    
    const centerX = 0;
    const centerY = 0;
    const radius = 80;
    const innerRadius = 60;
    const paddingAngle = 5 * (Math.PI / 180); // 5 degrees in radians
    
    // Calculate cumulative start angle
    let startAngle = -Math.PI / 2; // Start from top
    for (let i = 0; i < index; i++) {
      const prevAngle = (this.stats[i].value / total) * (2 * Math.PI - paddingAngle * this.stats.length);
      startAngle += prevAngle + paddingAngle;
    }
    
    // Calculate angle for this segment
    const angle = (stat.value / total) * (2 * Math.PI - paddingAngle * this.stats.length);
    const endAngle = startAngle + angle;
    
    // Outer arc points
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    // Inner arc points
    const x3 = centerX + innerRadius * Math.cos(endAngle);
    const y3 = centerY + innerRadius * Math.sin(endAngle);
    const x4 = centerX + innerRadius * Math.cos(startAngle);
    const y4 = centerY + innerRadius * Math.sin(startAngle);
    
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    
    // Create donut segment path
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
  }
}
