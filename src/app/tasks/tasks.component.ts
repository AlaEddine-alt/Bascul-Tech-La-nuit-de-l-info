import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ChallengeService, Challenge } from '../services/challenge.service';

const categoryColors: { [key: string]: string } = {
  OS: "bg-blue-500/10",
  Bureautique: "bg-orange-500/10",
  Web: "bg-purple-500/10",
  Cloud: "bg-cyan-500/10",
  Mobile: "bg-emerald-500/10",
  Mail: "bg-yellow-500/10",
};

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  animations: [
    trigger('fadeInScale', [
      state('void', style({ opacity: 0, transform: 'scale(0.9)' })),
      transition(':enter', [
        animate('0.3s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('0.2s ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})
export class TasksComponent implements OnInit {
  challenges: Challenge[] = [];
  filteredChallenges: Challenge[] = [];
  selectedCategory: string = 'All';
  searchQuery: string = '';
  isLoading: boolean = false;
  categories: string[] = ['All', 'OS', 'Bureautique', 'Web', 'Cloud', 'Mobile'];

  constructor(private challengeService: ChallengeService) {}

  ngOnInit(): void {
    this.loadChallenges();
  }

  loadChallenges(): void {
    this.isLoading = true;
    this.challengeService.getChallenges().subscribe({
      next: (challenges) => {
        this.challenges = challenges;
        this.filterChallenges();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading challenges:', error);
        this.isLoading = false;
      }
    });
  }

  filterChallenges(): void {
    this.filteredChallenges = this.challenges.filter(challenge => {
      const matchesCategory = this.selectedCategory === 'All' || challenge.category === this.selectedCategory;
      const matchesSearch = challenge.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                            challenge.alternative_name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.filterChallenges();
  }

  onSearchChange(): void {
    this.filterChallenges();
  }

  getCategoryColors(category: string): string {
    return categoryColors[category] || '';
  }

  trackByChallengeId(index: number, challenge: Challenge): string {
    return challenge.id;
  }
}
