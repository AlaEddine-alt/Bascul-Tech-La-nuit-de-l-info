import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ChallengeService, Challenge } from '../services/challenge.service';

@Component({
  selector: 'app-challenge-details',
  templateUrl: './challenge-details.component.html',
  styleUrls: ['./challenge-details.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('0.5s ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideInUp', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ChallengeDetailsComponent implements OnInit {
  challenge: Challenge | undefined;
  isLoading = true;
  challengeId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private challengeService: ChallengeService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.challengeId = params['id'] || null;
      if (this.challengeId) {
        this.loadChallenge();
      } else {
        this.router.navigate(['/challenges']);
      }
    });
  }

  loadChallenge(): void {
    if (!this.challengeId) return;
    
    this.isLoading = true;
    this.challengeService.getChallengeById(this.challengeId).subscribe({
      next: (challenge) => {
        this.challenge = challenge;
        this.isLoading = false;
        if (!challenge) {
          this.router.navigate(['/challenges']);
        }
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/challenges']);
      }
    });
  }

  getYouTubeEmbedUrl(videoId: string): SafeResourceUrl {
    const url = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  goBack(): void {
    this.router.navigate(['/challenges']);
  }
}
