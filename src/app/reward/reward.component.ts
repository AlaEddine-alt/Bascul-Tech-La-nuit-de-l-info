import { Component, OnInit } from '@angular/core';

interface Reward {
  id: number;
  title: string;
  unlockAt: number;
  icon: string;
  desc: string;
}

interface Challenge {
  id: string;
  points: number;
}

interface UserProgress {
  id: string;
  status: 'validated' | 'submitted' | 'pending';
  challenge_id: string;
  created_by: string;
}

@Component({
  selector: 'app-reward',
  templateUrl: './reward.component.html',
  styleUrl: './reward.component.css',
})
export class RewardComponent implements OnInit {
  demoUserType: 'student' | 'standard' = 'student';

  user: any = null;
  challenges: Challenge[] = [];
  progressData: UserProgress[] = [];

  totalPoints = 0;
  earnedPoints = 0;
  progressPercentage = 0;
  completedCount = 0;
  gradeBonus = '0.00';

  standardRewards: Reward[] = [
    {
      id: 1,
      title: "Bon d'achat 10€ - LDLC",
      unlockAt: 25,
      icon: 'shopping-bag',
      desc: 'Pour du matériel durable.',
    },
    {
      id: 2,
      title: '1 mois VPN Ethique',
      unlockAt: 50,
      icon: 'lock',
      desc: 'Protégez votre connexion.',
    },
    {
      id: 3,
      title: 'T-Shirt BASCUL TECH',
      unlockAt: 75,
      icon: 'user-circle',
      desc: 'Portez les couleurs de la résistance.',
    },
    {
      id: 4,
      title: 'Smartphone Reconditionné (-20%)',
      unlockAt: 100,
      icon: 'zap',
      desc: 'Partenariat BackMarket.',
    },
  ];

  ngOnInit() {
    this.loadUserData();
    this.calculateProgress();
  }

  loadUserData() {
    // Mock data - replace with actual API calls
    this.user = { email: 'user@example.com' };
    this.challenges = [
      { id: '1', points: 25 },
      { id: '2', points: 25 },
      { id: '3', points: 25 },
      { id: '4', points: 25 },
    ];
    this.progressData = [
      {
        id: '1',
        status: 'validated',
        challenge_id: '1',
        created_by: 'user@example.com',
      },
      {
        id: '2',
        status: 'submitted',
        challenge_id: '2',
        created_by: 'user@example.com',
      },
    ];
  }

  calculateProgress() {
    this.totalPoints = this.challenges.reduce(
      (acc, curr) => acc + (curr.points || 0),
      0
    );
    this.earnedPoints = this.progressData
      .filter((p) => p.status === 'validated' || p.status === 'submitted')
      .reduce((acc, p) => {
        const challenge = this.challenges.find((c) => c.id === p.challenge_id);
        return acc + (challenge?.points || 0);
      }, 0);

    this.progressPercentage =
      this.totalPoints > 0 ? (this.earnedPoints / this.totalPoints) * 100 : 0;
    this.completedCount = this.progressData.filter(
      (p) => p.status === 'validated' || p.status === 'submitted'
    ).length;
    this.gradeBonus = Math.min(
      0.5,
      (this.progressPercentage / 100) * 0.5
    ).toFixed(2);
  }

  setDemoUserType(type: 'student' | 'standard') {
    this.demoUserType = type;
  }

  isRewardUnlocked(unlockAt: number): boolean {
    return this.progressPercentage >= unlockAt;
  }

  handleClaim() {
    // Trigger confetti effect if available
    if (typeof window !== 'undefined' && (window as any).confetti) {
      (window as any).confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#059669'],
      });
    }
  }

  getRemainingPercentage(): number {
    return Math.round(100 - this.progressPercentage);
  }
}
