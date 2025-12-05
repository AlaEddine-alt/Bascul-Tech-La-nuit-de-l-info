import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  animations: [
    trigger('mobileMenu', [
      state('closed', style({ opacity: 0, height: 0, overflow: 'hidden' })),
      state('open', style({ opacity: 1, height: 'auto' })),
      transition('closed <=> open', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]
})
export class LayoutComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  scrolled = false;
  currentPath = '/';
  private routerSubscription?: Subscription;

  navItems: NavItem[] = [
    { label: 'Home', path: '/home', icon: 'shield' },
    { label: 'Défis', path: '/challenges', icon: 'map' },
    { label: 'Tableau de Bord', path: '/dashboard', icon: 'dashboard' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Track current route
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentPath = event.url;
        this.isMobileMenuOpen = false; // Close mobile menu on navigation
      });
    
    this.currentPath = this.router.url;
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.scrolled = window.scrollY > 20;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  isActive(path: string): boolean {
    return this.currentPath === path || this.currentPath.startsWith(path + '/');
  }

  handleLogout(): void {
    // TODO: Implement logout with base44 client
    // await base44.auth.logout();
    console.log('Logout clicked');
  }
}
